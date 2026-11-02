"""Vector diagrams for Assignment I (all grayscale, print-safe)."""

from reportlab.graphics.shapes import (
    Drawing, Rect, String, Line, Polygon, PolyLine, Circle, Path, Group,
)
from reportlab.lib.colors import HexColor, white

INK = HexColor('#111111')
MID = HexColor('#4D4D4D')
G05 = HexColor('#F6F6F6')
G12 = HexColor('#ECECEC')
G22 = HexColor('#DCDCDC')
G38 = HexColor('#C2C2C2')
G58 = HexColor('#9E9E9E')

FR = 'Lato'
FB = 'Lato-Bold'
W = 460.0


# ---------------------------------------------------------------- primitives
def txt(d, x, y, s, size=7.4, font=FB, anchor='middle', color=INK):
    t = String(x, y, s, fontName=font, fontSize=size, fillColor=color,
               textAnchor=anchor)
    d.add(t)
    return t


def ln(d, x1, y1, x2, y2, sw=0.85, color=INK, dash=None):
    d.add(Line(x1, y1, x2, y2, strokeColor=color, strokeWidth=sw,
               strokeDashArray=dash))


def rect(d, x, y, w, h, fill=white, stroke=INK, sw=0.85, r=0, dash=None):
    d.add(Rect(x, y, w, h, rx=r, ry=r, fillColor=fill, strokeColor=stroke,
               strokeWidth=sw, strokeDashArray=dash))


def arrow(d, x1, y1, x2, y2, sw=0.9, color=INK, dash=None, hs=4.0):
    import math
    ang = math.atan2(y2 - y1, x2 - x1)
    bx, by = x2 - hs * math.cos(ang), y2 - hs * math.sin(ang)
    ln(d, x1, y1, bx, by, sw=sw, color=color, dash=dash)
    p1 = (x2, y2)
    p2 = (bx + hs * 0.42 * math.sin(ang), by - hs * 0.42 * math.cos(ang))
    p3 = (bx - hs * 0.42 * math.sin(ang), by + hs * 0.42 * math.cos(ang))
    d.add(Polygon([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]],
                  fillColor=color, strokeColor=color, strokeWidth=0.4))


def panel(d, x, y, w, h, lines, fill=white, r=3, sw=0.9, dash=None,
          stroke=INK):
    """lines: list of (text, size, font, color) tuples, centred vertically."""
    rect(d, x, y, w, h, fill=fill, stroke=stroke, sw=sw, r=r, dash=dash)
    total = sum(l[1] * 1.22 for l in lines)
    top = y + h / 2.0 + total / 2.0
    for text, size, font, color in lines:
        top -= size * 1.22
        txt(d, x + w / 2.0, top + size * 0.28, text, size, font, 'middle', color)


def badge(d, x, y, s, fill=G22):
    """small tag such as the OSI layer where a device works."""
    wdt = len(s) * 3.5 + 7
    rect(d, x, y, wdt, 10.5, fill=fill, stroke=INK, sw=0.6, r=1.5)
    txt(d, x + wdt / 2.0, y + 3.2, s, 6.3, FB, 'middle', INK)
    return wdt


def cloud(d, x, y, w, h, label='INTERNET'):
    p = Path(fillColor=G05, strokeColor=INK, strokeWidth=0.9)
    p.moveTo(x + 0.10 * w, y + 0.10 * h)
    p.curveTo(x - 0.02 * w, y + 0.14 * h, x - 0.02 * w, y + 0.62 * h,
              x + 0.16 * w, y + 0.64 * h)
    p.curveTo(x + 0.16 * w, y + 0.98 * h, x + 0.52 * w, y + 1.02 * h,
              x + 0.58 * w, y + 0.74 * h)
    p.curveTo(x + 0.70 * w, y + 0.98 * h, x + 0.98 * w, y + 0.92 * h,
              x + 0.94 * w, y + 0.58 * h)
    p.curveTo(x + 1.02 * w, y + 0.52 * h, x + 1.00 * w, y + 0.12 * h,
              x + 0.82 * w, y + 0.10 * h)
    p.closePath()
    d.add(p)
    txt(d, x + 0.53 * w, y + 0.34 * h, label, 7.6, FB)


def node(d, cx, cy, r=4.6, fill=G38):
    d.add(Circle(cx, cy, r, fillColor=fill, strokeColor=INK, strokeWidth=0.85))


def terminator(d, x, y):
    ln(d, x, y - 5, x, y + 5, sw=1.8)


def frame_title(d, cx, y, s):
    txt(d, cx, y, s, 8.0, FB)


# ---------------------------------------------------------------- figure 1
def fig_components_system():
    """Five components of a data communication system."""
    H = 172
    d = Drawing(W, H)

    # message label above the medium
    txt(d, 230, 141, 'MESSAGE  (the data being sent)', 7.6, FB)
    ln(d, 230, 137, 230, 132, sw=0.6, dash=[2, 2])

    # sender
    panel(d, 14, 70, 112, 62, [
        ('SENDER', 8.6, FB, INK),
        ('source device', 6.9, FR, MID),
        ('e.g. a PC or a phone', 6.9, FR, MID),
    ], fill=G12)

    # receiver
    panel(d, 334, 70, 112, 62, [
        ('RECEIVER', 8.6, FB, INK),
        ('destination device', 6.9, FR, MID),
        ('e.g. a server or a printer', 6.9, FR, MID),
    ], fill=G12)

    # medium band
    rect(d, 152, 64, 156, 68, fill=G05, r=3)
    txt(d, 230, 120, 'TRANSMISSION', 7.8, FB)
    txt(d, 230, 111, 'MEDIUM', 7.8, FB)
    txt(d, 230, 72, 'copper cable, optical fibre or free space', 6.6, FR, 'middle', MID)

    # signal arrow across the medium
    arrow(d, 126, 92, 334, 92, sw=1.0)

    # protocol bracket
    ln(d, 14, 52, 446, 52, sw=0.9)
    ln(d, 14, 52, 14, 66, sw=0.9)
    ln(d, 446, 52, 446, 66, sw=0.9)
    ln(d, 230, 52, 230, 46, sw=0.9)
    txt(d, 230, 36, 'PROTOCOL  (the rules both sides follow: encoding, framing,',
        7.6, FB)
    txt(d, 230, 26, 'error control, speed, and how to start and end the exchange)',
        7.6, FB)
    return d


# ---------------------------------------------------------------- figure 2
def fig_osi():
    """OSI seven-layer stack with PDU column."""
    H = 326
    d = Drawing(W, H)
    x0, bw, bh, gap = 18, 250, 40, 2.5
    top = H - 14
    layers = [
        ('7', 'Application', 'HTTP, SMTP, FTP'),
        ('6', 'Presentation', 'TLS, JPEG, ASCII'),
        ('5', 'Session', 'RPC, NetBIOS'),
        ('4', 'Transport', 'TCP, UDP'),
        ('3', 'Network', 'IP, ICMP  (router)'),
        ('2', 'Data link', 'Ethernet, PPP  (switch)'),
        ('1', 'Physical', 'UTP, fibre, radio  (hub)'),
    ]
    ys = []
    for i, (num, name, ex) in enumerate(layers):
        y = top - (i + 1) * bh - i * gap
        ys.append((y, y + bh))
        rect(d, x0, y, bw, bh, fill=G12 if i % 2 == 0 else white, sw=0.9)
        rect(d, x0, y, 26, bh, fill=G38, sw=0.9)
        txt(d, x0 + 13, y + bh / 2 - 3.6, num, 11, FB)
        txt(d, x0 + 36, y + bh / 2 + 3.2, name, 9.4, FB, 'start')
        txt(d, x0 + 36, y + bh / 2 - 9.5, ex, 7.0, FR, 'start', MID)

    # PDU brackets on the right
    px = 288
    txt(d, px + 22, top + 2, 'PDU', 8.0, FB)
    groups = [((0, 2), 'Data'), ((3, 3), 'Segment'),
              ((4, 4), 'Packet'), ((5, 5), 'Frame'), ((6, 6), 'Bit')]
    for (a, b), name in groups:
        ytop, ybot = ys[a][1], ys[b][0]
        ln(d, px, ybot + 3, px, ytop - 3, sw=0.9)
        ln(d, px, ybot + 3, px + 7, ybot + 3, sw=0.9)
        ln(d, px, ytop - 3, px + 7, ytop - 3, sw=0.9)
        txt(d, px + 12, (ytop + ybot) / 2 - 2.4, name, 8.0, FB, 'start')
    txt(d, 143, top + 12, 'OSI reference model', 8.6, FB)
    return d


# ---------------------------------------------------------------- figure 3
def fig_tcpip():
    """TCP/IP layers mapped onto the OSI layers."""
    H = 268
    d = Drawing(W, H)
    bh, gap = 30, 2.5
    ox, ow = 18, 142
    tx, tw = 300, 142
    top = H - 30
    osi = ['Application', 'Presentation', 'Session', 'Transport', 'Network',
           'Data link', 'Physical']
    txt(d, ox + ow / 2, H - 12, 'OSI (7 layers)', 8.6, FB)
    txt(d, tx + tw / 2, H - 12, 'TCP/IP (4 layers)', 8.6, FB)

    oy = []
    for i, name in enumerate(osi):
        y = top - (i + 1) * bh - i * gap
        oy.append((y, y + bh))
        rect(d, ox, y, ow, bh, fill=G12 if i % 2 == 0 else white, sw=0.9)
        txt(d, ox + 8, y + bh / 2 - 2.6, '%d  %s' % (7 - i, name), 8.6, FB, 'start')

    bottom = oy[6][0]
    spans = [
        ('Application', oy[0][1], oy[2][0], '(OSI 5, 6, 7)'),
        ('Transport', oy[3][0], oy[3][1], '(OSI 4)'),
        ('Internet', oy[4][0], oy[4][1], '(OSI 3)'),
        ('Network access', bottom, oy[5][1], '(OSI 1, 2)'),
    ]
    for name, ybot, ytop, note in spans:
        rect(d, tx, ybot, tw, ytop - ybot, fill=G22, sw=0.9)
        cy = (ytop + ybot) / 2
        txt(d, tx + tw / 2, cy + 2.5, name, 8.8, FB)
        txt(d, tx + tw / 2, cy - 8.5, note, 6.9, FR, 'middle', MID)

    # mapping connectors
    for k, (ybot, ytop) in enumerate(oy):
        ln(d, ox + ow + 4, (ybot + ytop) / 2, tx - 4, (ybot + ytop) / 2,
           sw=0.7, dash=[2.2, 2.2], color=MID)
    return d


# ---------------------------------------------------------------- figure 4
def fig_components_network():
    """A small network showing end devices, intermediaries and media."""
    H = 322
    d = Drawing(W, H)

    # cloud + router + switch (vertical spine)
    cloud(d, 172, 274, 116, 46, 'INTERNET')
    rect(d, 185, 228, 92, 38, fill=G22, r=2)
    txt(d, 231, 250, 'ROUTER', 8.6, FB)
    txt(d, 231, 240, 'layer 3, routes by IP', 6.6, FR, 'middle', MID)
    txt(d, 231, 232, 'intermediary device', 6.4, FR, 'middle', MID)

    rect(d, 185, 170, 92, 38, fill=G22, r=2)
    txt(d, 231, 192, 'SWITCH', 8.6, FB)
    txt(d, 231, 182, 'layer 2, switches by MAC', 6.6, FR, 'middle', MID)
    txt(d, 231, 174, 'intermediary device', 6.4, FR, 'middle', MID)

    ln(d, 231, 228, 231, 208)
    txt(d, 236, 216, 'fibre', 6.4, FR, 'start', MID)
    ln(d, 231, 170, 231, 148)
    txt(d, 236, 158, 'UTP Cat 5e', 6.4, FR, 'start', MID)

    # devices row
    row_y, row_h = 92, 42
    devs = [
        (14, 92, 'SERVER', 'layer 7, shared files'),
        (118, 86, 'PC 1', 'end device'),
        (216, 86, 'PC 2', 'end device'),
        (314, 128, 'ACCESS POINT', 'layer 2, radio link'),
    ]
    for x, w, name, note in devs:
        rect(d, x, row_y, w, row_h, fill=G12, r=2.5)
        txt(d, x + w / 2, row_y + row_h - 16, name, 8.5, FB)
        txt(d, x + w / 2, row_y + row_h - 27, note, 6.8, FR, 'middle', MID)
        txt(d, x + w / 2, row_y + 7, 'OSI 1 to 7 end device', 6.2, FR,
            'middle', MID)
        ln(d, x + w / 2, row_y + row_h, 231, 148, sw=0.85)

    # wireless client
    rect(d, 350, 22, 72, 40, fill=white, r=2.5)
    txt(d, 386, 48, 'LAPTOP', 8.2, FB)
    txt(d, 386, 38, 'wireless client', 6.8, FR, 'middle', MID)
    txt(d, 386, 28, 'OSI 1 to 7', 6.2, FR, 'middle', MID)
    for rr in (8, 14, 20):
        p = Path(fillColor=None, strokeColor=INK, strokeWidth=0.85)
        p.moveTo(386 - rr * 0.72, 64)
        p.curveTo(386 - rr * 0.45, 64 + rr * 0.75, 386 + rr * 0.45, 64 + rr * 0.75,
                  386 + rr * 0.72, 64)
        p.fillColor = None
        p.strokeDashArray = [2, 2]
        d.add(p)

    # legend
    ln(d, 14, 8, 40, 8, sw=0.9)
    txt(d, 45, 5.6, 'cabled link (UTP or fibre)', 6.8, FR, 'start', MID)
    ln(d, 190, 8, 216, 8, sw=0.9, dash=[2.2, 2])
    txt(d, 221, 5.6, 'wireless link', 6.8, FR, 'start', MID)
    return d


# ---------------------------------------------------------------- figure 5
def _cell(d, x, y, w, h, title):
    rect(d, x, y, w, h, fill=white, stroke=G58, sw=0.7, r=2)
    txt(d, x + w / 2, y + h - 12, title, 8.4, FB)


def _bus(d, cx, cy):
    ln(d, cx - 52, cy, cx + 52, cy, sw=1.6)
    terminator(d, cx - 52, cy)
    terminator(d, cx + 52, cy)
    for i in range(4):
        x = cx - 39 + i * 26
        ln(d, x, cy, x, cy + 12, sw=0.85)
        node(d, x, cy + 16, 4.2)


def _star(d, cx, cy):
    rect(d, cx - 6, cy - 5, 12, 10, fill=G38, sw=0.85)
    for dx, dy in [(-1, 1), (1, 1), (-1, -1), (1, -1)]:
        x, y = cx + dx * 34, cy + dy * 15
        ln(d, cx + dx * 6.5, cy + dy * 5, x, y, sw=0.85)
        node(d, x, y, 4.2)


def _ring(d, cx, cy):
    r = 24
    d.add(Circle(cx, cy, r, fillColor=None, strokeColor=INK, strokeWidth=1.0))
    for a in (90, 0, 270, 180):
        import math
        x = cx + r * math.cos(math.radians(a))
        y = cy + r * math.sin(math.radians(a))
        node(d, x, y, 4.2)


def _mesh(d, cx, cy):
    pts = [(cx - 30, cy + 16), (cx + 30, cy + 16), (cx + 30, cy - 16),
           (cx - 30, cy - 16)]
    for i in range(4):
        for j in range(i + 1, 4):
            ln(d, pts[i][0], pts[i][1], pts[j][0], pts[j][1], sw=0.7)
    for x, y in pts:
        node(d, x, y, 4.2)


def _hybrid(d, cx, cy):
    node(d, cx, cy, 4.6, fill=G22)
    for sx in (-1, 1):
        hx, hy = cx + sx * 30, cy
        ln(d, cx + sx * 4.5, cy, hx, hy, sw=0.85)
        rect(d, hx - 5, hy - 4.5, 10, 9, fill=G38, sw=0.85)
        for dy in (13, -13):
            x, y = hx + sx * 20, cy + dy
            ln(d, hx + sx * 5, hy + dy * 0.3, x, y, sw=0.85)
            node(d, x, y, 4.0)


def fig_topologies():
    H = 232
    d = Drawing(W, H)
    cw, ch, gx = 145, 98, 12.5
    xs = [0, cw + gx, 2 * (cw + gx)]
    _cell(d, xs[0], H - ch, cw, ch, 'Bus')
    _cell(d, xs[1], H - ch, cw, ch, 'Star')
    _cell(d, xs[2], H - ch, cw, ch, 'Ring')
    _bus(d, xs[0] + cw / 2, H - ch + 36)
    _star(d, xs[1] + cw / 2, H - ch + 38)
    _ring(d, xs[2] + cw / 2, H - ch + 38)

    y2 = H - 2 * ch - 10
    _cell(d, xs[0] + 3, y2, cw, ch, 'Mesh (full)')
    _cell(d, xs[1] + 3, y2, cw, ch, 'Hybrid')
    _mesh(d, xs[0] + 3 + cw / 2, y2 + 38)
    _hybrid(d, xs[1] + 3 + cw / 2, y2 + 38)
    return d


# ---------------------------------------------------------------- figure 6
def fig_relationship():
    H = 148
    d = Drawing(W, H)
    cw, gap = 215, 30
    for i, title in enumerate(['Peer-to-peer', 'Client-server']):
        x = i * (cw + gap)
        rect(d, x, 0, cw, H, fill=white, stroke=G58, sw=0.7, r=2)
        txt(d, x + cw / 2, H - 13, title, 8.4, FB)

    # peer to peer: 4 nodes, all equal, joined
    cx, cy = 107, 62
    pts = [(cx - 62, cy + 26), (cx + 62, cy + 26), (cx - 62, cy - 26),
           (cx + 62, cy - 26)]
    for i in range(4):
        for j in range(i + 1, 4):
            ln(d, pts[i][0], pts[i][1], pts[j][0], pts[j][1], sw=0.7)
    for x, y in pts:
        node(d, x, y, 5.2, fill=G38)
    txt(d, cx, 8, 'all peers equal, no central server', 6.6, FR, 'middle', MID)

    # client server
    cx = cw + gap + 107
    rect(d, cx - 24, cy - 12, 48, 26, fill=G22, r=2)
    txt(d, cx, cy + 1, 'SERVER', 7.2, FB)
    for sx, sy in [(-78, 30), (78, 30), (-78, -30), (78, -30)]:
        ln(d, cx + (sx / 3.0), cy + (sy / 3.0), cx + sx, cy + sy, sw=0.85)
        node(d, cx + sx, cy + sy, 5.2, fill=G38)
    txt(d, cx, 8, 'clients request, the server answers', 6.6, FR, 'middle', MID)
    return d


# ---------------------------------------------------------------- figure 7
def fig_modes():
    H = 168
    d = Drawing(W, H)
    rows = [
        ('Simplex', 'one direction only', [(1, 0)], 'keyboard to computer'),
        ('Half-duplex', 'both ways, one at a time', [(1, 0), (0, 1)],
         'walkie-talkie'),
        ('Full-duplex', 'both ways at once', [(1, 0), (0, 1)],
         'telephone call'),
    ]
    top = H - 8
    for i, (name, note, dirs, ex) in enumerate(rows):
        base = top - i * 52 - 40
        txt(d, 8, base + 26, name, 8.6, FB, 'start')
        txt(d, 8, base + 15, note, 6.9, FR, 'start', MID)
        txt(d, 8, base + 5, 'e.g. ' + ex, 6.7, FR, 'start', MID)
        for ax, bx in [(150, 404)]:
            rect(d, ax - 26, base + 12, 26, 20, fill=G12, r=2)
            txt(d, ax - 13, base + 18, 'A', 8.2, FB)
            rect(d, bx, base + 12, 26, 20, fill=G12, r=2)
            txt(d, bx + 13, base + 18, 'B', 8.2, FB)
        if len(dirs) == 1:
            arrow(d, 150, base + 22, 404, base + 22, sw=1.0)
        else:
            arrow(d, 150, base + 27, 404, base + 27, sw=1.0)
            arrow(d, 404, base + 16, 150, base + 16, sw=1.0)
    return d


# ---------------------------------------------------------------- figure 8
def fig_frame():
    H = 132
    d = Drawing(W, H)
    y, h = 56, 40
    # header
    rect(d, 0, y, 150, h, fill=G22)
    txt(d, 75, y + 26, 'Frame header', 8.2, FB)
    txt(d, 75, y + 15, 'destination MAC, source MAC,', 6.6, FR, 'middle', MID)
    txt(d, 75, y + 6, 'length or type', 6.6, FR, 'middle', MID)
    # payload
    rect(d, 150, y, 186, h, fill=G05)
    txt(d, 243, y + 26, 'Data (payload)', 8.2, FB)
    txt(d, 243, y + 15, 'the packet handed down', 6.6, FR, 'middle', MID)
    txt(d, 243, y + 6, 'by the network layer', 6.6, FR, 'middle', MID)
    # trailer
    rect(d, 336, y, 124, h, fill=G22)
    txt(d, 398, y + 26, 'Trailer', 8.2, FB)
    txt(d, 398, y + 15, 'error-detecting code', 6.6, FR, 'middle', MID)
    txt(d, 398, y + 6, '(FCS / CRC)', 6.6, FR, 'middle', MID)

    # braces
    ln(d, 0, y - 8, 460, y - 8, sw=0.85)
    ln(d, 0, y - 8, 0, y - 14, sw=0.85)
    ln(d, 460, y - 8, 460, y - 14, sw=0.85)
    txt(d, 230, y - 20, 'FRAME  =  the PDU of the data link layer', 8.0, FB)

    # bit ruler
    ln(d, 0, y + h + 8, 460, y + h + 8, sw=0.7, dash=[2, 2])
    for x in (0, 150, 336, 460):
        ln(d, x, y + h + 4, x, y + h + 12, sw=0.7)
    txt(d, 230, y + h + 15, 'bits on the medium, sent one after another', 6.6,
        FR, 'middle', MID)
    return d


FIGURES = {
    'system': fig_components_system,
    'osi': fig_osi,
    'tcpip': fig_tcpip,
    'network': fig_components_network,
    'topologies': fig_topologies,
    'relationship': fig_relationship,
    'modes': fig_modes,
    'frame': fig_frame,
}
