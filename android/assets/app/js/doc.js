/* Qalam — document model.
 *
 * A document is a stack of layer *definitions* plus a list of frames. Each frame
 * stores one "cel" (a canvas) per layer, allocated only when something is
 * actually painted there. That is the classic cel-animation model: layers stay
 * in sync across frames, and a 20 frame animation costs memory only for the
 * cels that exist.
 */
(function () {
  'use strict';
  const Q = window.Q;

  Q.BLEND_MODES = [
    ['source-over', 'Normal'], ['multiply', 'Multiply'], ['screen', 'Screen'],
    ['overlay', 'Overlay'], ['darken', 'Darken'], ['lighten', 'Lighten'],
    ['color-dodge', 'Colour dodge'], ['color-burn', 'Colour burn'],
    ['hard-light', 'Hard light'], ['soft-light', 'Soft light'],
    ['difference', 'Difference'], ['exclusion', 'Exclusion'],
    ['hue', 'Hue'], ['saturation', 'Saturation'], ['color', 'Colour'],
    ['luminosity', 'Luminosity']
  ];

  let layerSeq = 0;
  function makeLayer(name) {
    layerSeq += 1;
    return {
      id: Q.uid(),
      name: name || ('Layer ' + layerSeq),
      visible: true,
      opacity: 1,
      blend: 'source-over'
    };
  }

  /* ── history ─────────────────────────────────────────────── */

  function History(doc) {
    this.doc = doc;
    this.undoStack = [];
    this.redoStack = [];
    this.max = 36;
    this.snap = null;
    this.snapCtx = null;
    this.pixelF = 0;
    this.pixelL = 0;
    this.onchange = null;
  }

  History.prototype.structSnapshot = function () {
    const d = this.doc;
    return {
      layers: d.layers.map(function (l) {
        return { id: l.id, name: l.name, visible: l.visible, opacity: l.opacity, blend: l.blend };
      }),
      frames: d.frames.map(function (f) { return f.cels.slice(); }),
      activeLayer: d.activeLayer,
      activeFrame: d.activeFrame
    };
  };

  History.prototype.applyStruct = function (s) {
    const d = this.doc;
    d.layers = s.layers.map(function (l) {
      return { id: l.id, name: l.name, visible: l.visible, opacity: l.opacity, blend: l.blend };
    });
    d.frames = s.frames.map(function (cels) { return { cels: cels.slice() }; });
    d.activeLayer = Q.clamp(s.activeLayer, 0, d.layers.length - 1);
    d.activeFrame = Q.clamp(s.activeFrame, 0, d.frames.length - 1);
  };

  History.prototype.struct = function (fn) {
    const before = this.structSnapshot();
    const self = this;
    const result = fn.call(this.doc);
    const after = this.structSnapshot();
    this.push({ type: 'struct', before: before, after: after });
    if (self.onchange) self.onchange();
    return result;
  };

  History.prototype.beginPixels = function (cel) {
    const d = this.doc;
    if (!this.snap) this.snap = Q.canvas(d.width, d.height);
    if (this.snap.width !== d.width || this.snap.height !== d.height) {
      this.snap.width = d.width;
      this.snap.height = d.height;
      this.snapCtx = null;
    }
    if (!this.snapCtx) this.snapCtx = this.snap.getContext('2d');
    this.snapCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.snapCtx.globalCompositeOperation = 'source-over';
    this.snapCtx.globalAlpha = 1;
    this.snapCtx.clearRect(0, 0, this.snap.width, this.snap.height);
    if (cel) this.snapCtx.drawImage(cel, 0, 0);
    this.pixelF = d.activeFrame;
    this.pixelL = d.activeLayer;
  };

  History.prototype.endPixels = function (rect) {
    if (!rect || rect.w < 1 || rect.h < 1) return;
    const d = this.doc;
    const w = Math.min(Math.ceil(rect.w), d.width - Math.floor(rect.x));
    const h = Math.min(Math.ceil(rect.h), d.height - Math.floor(rect.y));
    if (w < 1 || h < 1) return;
    const before = this.snapCtx.getImageData(Math.floor(rect.x), Math.floor(rect.y), w, h);
    this.push({
      type: 'pixels', f: this.pixelF, l: this.pixelL,
      rect: { x: Math.floor(rect.x), y: Math.floor(rect.y), w: w, h: h },
      before: before
    });
  };

  History.prototype.push = function (entry) {
    this.undoStack.push(entry);
    this.redoStack.length = 0;
    while (this.undoStack.length > this.max) this.undoStack.shift();
    if (this.onchange) this.onchange();
  };

  History.prototype.canUndo = function () { return this.undoStack.length > 0; };
  History.prototype.canRedo = function () { return this.redoStack.length > 0; };

  History.prototype.undo = function () {
    const e = this.undoStack.pop();
    if (!e) return false;
    if (e.type === 'pixels') {
      const cel = this.doc.cel(e.f, e.l, true);
      const c = cel.getContext('2d');
      const after = c.getImageData(e.rect.x, e.rect.y, e.rect.w, e.rect.h);
      c.putImageData(e.before, e.rect.x, e.rect.y);
      this.doc.activeFrame = e.f;
      this.doc.activeLayer = e.l;
      this.redoStack.push({ type: 'pixels', f: e.f, l: e.l, rect: e.rect, before: after });
    } else {
      const after = this.structSnapshot();
      this.applyStruct(e.before);
      this.redoStack.push({ type: 'struct', before: after, after: e.before });
    }
    if (this.onchange) this.onchange();
    return true;
  };

  History.prototype.redo = function () {
    const e = this.redoStack.pop();
    if (!e) return false;
    if (e.type === 'pixels') {
      const cel = this.doc.cel(e.f, e.l, true);
      const c = cel.getContext('2d');
      const before = c.getImageData(e.rect.x, e.rect.y, e.rect.w, e.rect.h);
      c.putImageData(e.before, e.rect.x, e.rect.y);
      this.doc.activeFrame = e.f;
      this.doc.activeLayer = e.l;
      this.undoStack.push({ type: 'pixels', f: e.f, l: e.l, rect: e.rect, before: before });
    } else {
      const before = this.structSnapshot();
      this.applyStruct(e.after || e.before);
      this.undoStack.push({ type: 'struct', before: before, after: e.after || e.before });
    }
    if (this.onchange) this.onchange();
    return true;
  };

  History.prototype.clear = function () {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    if (this.onchange) this.onchange();
  };

  /* ── document ────────────────────────────────────────────── */

  function Doc(opts) {
    opts = opts || {};
    this.id = opts.id || Q.uid();
    this.name = opts.name || 'Untitled';
    this.width = opts.width || 2048;
    this.height = opts.height || 2048;
    this.fps = opts.fps || 12;
    this.bg = opts.bg || '#ffffff';
    this.layers = [makeLayer('Layer 1')];
    this.frames = [{ cels: [null] }];
    this.activeFrame = 0;
    this.activeLayer = 0;
    this.onion = !!opts.onion;
    this.onionAlpha = 0.32;
    this.history = new History(this);
    this.dirty = true;
  }

  Doc.prototype.cel = function (f, l, create) {
    const frame = this.frames[f];
    if (!frame) return null;
    let c = frame.cels[l];
    if (!c && create) {
      c = Q.canvas(this.width, this.height);
      frame.cels[l] = c;
    }
    return c || null;
  };

  Doc.prototype.activeCel = function (create) {
    return this.cel(this.activeFrame, this.activeLayer, create);
  };

  Doc.prototype.layer = function (i) {
    return this.layers[i == null ? this.activeLayer : i] || null;
  };

  Doc.prototype.frameCount = function () { return this.frames.length; };

  Doc.prototype.blankCels = function () {
    const n = this.layers.length, a = [];
    for (let i = 0; i < n; i++) a.push(null);
    return a;
  };

  Doc.prototype.cloneCels = function (cels) {
    return cels.map(function (c) { return c ? Q.copyCanvas(c) : null; });
  };

  /* layer operations (all undoable as structural changes) */

  Doc.prototype.addLayer = function (copyFrom) {
    return this.history.struct(function () {
      const at = this.activeLayer + 1;
      const src = (copyFrom != null) ? this.layers[copyFrom] : null;
      const lay = makeLayer(src ? src.name + ' copy' : null);
      if (src) { lay.opacity = src.opacity; lay.blend = src.blend; }
      this.layers.splice(at, 0, lay);
      for (let i = 0; i < this.frames.length; i++) {
        const c = src ? this.frames[i].cels[copyFrom] : null;
        this.frames[i].cels.splice(at, 0, c ? Q.copyCanvas(c) : null);
      }
      this.activeLayer = at;
      return at;
    });
  };

  Doc.prototype.deleteLayer = function (i) {
    if (this.layers.length < 2) { Q.toast('A canvas needs at least one layer'); return; }
    return this.history.struct(function () {
      this.layers.splice(i, 1);
      for (const f of this.frames) f.cels.splice(i, 1);
      this.activeLayer = Q.clamp(this.activeLayer, 0, this.layers.length - 1);
    });
  };

  Doc.prototype.moveLayer = function (i, dir) {
    const j = i + dir;
    if (j < 0 || j >= this.layers.length) return;
    return this.history.struct(function () {
      const l = this.layers.splice(i, 1)[0];
      this.layers.splice(j, 0, l);
      for (const f of this.frames) {
        const c = f.cels.splice(i, 1)[0];
        f.cels.splice(j, 0, c);
      }
      this.activeLayer = j;
    });
  };

  Doc.prototype.mergeDown = function (i) {
    if (i <= 0) { Q.toast('Nothing below to merge into'); return; }
    return this.history.struct(function () {
      const lower = this.layers[i - 1], upper = this.layers[i];
      for (const f of this.frames) {
        const up = f.cels[i], low = f.cels[i - 1];
        if (!up) continue;
        if (!low) { f.cels[i - 1] = Q.copyCanvas(up); f.cels[i] = null; continue; }
        const c = low.getContext('2d');
        c.save();
        c.globalAlpha = upper.opacity;
        c.globalCompositeOperation = upper.blend;
        c.drawImage(up, 0, 0);
        c.restore();
        f.cels[i] = null;
      }
      this.layers.splice(i, 1);
      for (const f of this.frames) f.cels.splice(i, 1);
      this.activeLayer = Math.max(0, i - 1);
      void lower;
    });
  };

  Doc.prototype.clearLayer = function (i) {
    const self = this;
    return this.history.struct(function () {
      for (const f of self.frames) {
        const c = f.cels[i];
        if (c) c.getContext('2d').clearRect(0, 0, self.width, self.height);
      }
    });
  };

  /* frame operations */

  Doc.prototype.addFrame = function (duplicate) {
    return this.history.struct(function () {
      const at = this.activeFrame + 1;
      const src = this.frames[this.activeFrame];
      const cels = duplicate ? this.cloneCels(src.cels) : this.blankCels();
      while (cels.length < this.layers.length) cels.push(null);
      this.frames.splice(at, 0, { cels: cels });
      this.activeFrame = at;
    });
  };

  Doc.prototype.deleteFrame = function (i) {
    if (this.frames.length < 2) { Q.toast('A canvas needs at least one frame'); return; }
    return this.history.struct(function () {
      this.frames.splice(i, 1);
      this.activeFrame = Q.clamp(this.activeFrame, 0, this.frames.length - 1);
    });
  };

  Doc.prototype.moveFrame = function (i, dir) {
    const j = i + dir;
    if (j < 0 || j >= this.frames.length) return;
    return this.history.struct(function () {
      const f = this.frames.splice(i, 1)[0];
      this.frames.splice(j, 0, f);
      this.activeFrame = j;
    });
  };

  Doc.prototype.setLayerProp = function (i, key, value) {
    const self = this;
    return this.history.struct(function () {
      if (self.layers[i]) self.layers[i][key] = value;
    });
  };

  Doc.prototype.setLayerPropLive = function (i, key, value) {
    if (this.layers[i]) this.layers[i][key] = value;
  };

  /* rendering */

  Doc.prototype.composite = function (ctx, frameIdx, opts) {
    opts = opts || {};
    const alpha = opts.alpha == null ? 1 : opts.alpha;
    const ignoreOpacity = !!opts.ignoreOpacity;
    const frame = this.frames[frameIdx];
    if (!frame) return;
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (!layer.visible && !opts.includeHidden) continue;
      const cel = frame.cels[i];
      if (!cel) continue;
      ctx.save();
      ctx.globalAlpha = alpha * (ignoreOpacity ? 1 : layer.opacity);
      ctx.globalCompositeOperation = layer.blend || 'source-over';
      ctx.drawImage(cel, 0, 0);
      ctx.restore();
    }
  };

  Doc.prototype.renderFrame = function (canvas, frameIdx, opts) {
    opts = opts || {};
    const c = canvas.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (opts.background !== false) {
      c.fillStyle = opts.background || this.bg;
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.composite(c, frameIdx, opts);
    return canvas;
  };

  Doc.prototype.flatten = function (frameIdx) {
    const cv = Q.canvas(this.width, this.height);
    return this.renderFrame(cv, frameIdx, { background: null });
  };

  Doc.prototype.thumbnail = function (frameIdx, size) {
    const s = size || 160;
    const ratio = this.width / this.height;
    const w = ratio >= 1 ? s : Math.round(s * ratio);
    const h = ratio >= 1 ? Math.round(s / ratio) : s;
    const cv = Q.canvas(w, h);
    const c = cv.getContext('2d');
    c.fillStyle = this.bg;
    c.fillRect(0, 0, w, h);
    c.save();
    c.scale(w / this.width, h / this.height);
    this.composite(c, frameIdx == null ? this.activeFrame : frameIdx);
    c.restore();
    return cv;
  };

  Doc.prototype.layerThumbnail = function (layerIdx, size) {
    const s = size || 46;
    const ratio = this.width / this.height;
    const w = ratio >= 1 ? 96 : Math.round(96 * ratio);
    const h = ratio >= 1 ? Math.round(96 / ratio) : 96;
    const cv = Q.canvas(w, h);
    const c = cv.getContext('2d');
    const cel = this.cel(this.activeFrame, layerIdx, false);
    if (cel) c.drawImage(cel, 0, 0, w, h);
    void s;
    return cv;
  };

  Doc.prototype.memoryMB = function () {
    let cells = 0;
    for (const f of this.frames) {
      for (const c of f.cels) if (c) cells += 1;
    }
    return Math.round(cells * this.width * this.height * 4 / (1024 * 1024));
  };

  Q.Doc = Doc;
  Q.History = History;
  Q.makeLayer = makeLayer;
})();
