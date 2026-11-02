# -*- coding: utf-8 -*-
"""Build the print-ready PDF of Assignment I."""

import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.platypus import (BaseDocTemplate, Frame, Image, KeepTogether,
                                NextPageTemplate, PageBreak, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.platypus.flowables import HRFlowable

import content
import figures

_SQ = re.compile(r"(?<=[A-Za-z0-9])'(?=[A-Za-z0-9])")
_DQ = re.compile(r'"([^"<]*)"')


def smart(t):
    """typographic quotes, so the text does not look typewriter-set"""
    t = _SQ.sub('\u2019', t)
    t = _DQ.sub('\u201c\\1\u201d', t)
    return t

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'assets')
FONTS = os.path.join(ASSETS, 'fonts')

OUT = os.path.join(ROOT, 'Assignment-I_Data-Communications-and-Computer-Networks.pdf')

PAGE_W, PAGE_H = A4
ML = MR = 67.6
MT, MB = 62.0, 58.0
FRAME_W = PAGE_W - ML - MR          # 460.07
FRAME_H = PAGE_H - MT - MB

NAVY = HexColor('#1B2B6B')
YELLOW = HexColor('#F2B52C')
INK = HexColor('#111111')
MUTED = HexColor('#444444')
RULE = HexColor('#7A7A7A')

# ------------------------------------------------------------------ fonts
def register_fonts():
    pdfmetrics.registerFont(TTFont('Tinos', os.path.join(FONTS, 'Tinos-Regular.ttf')))
    pdfmetrics.registerFont(TTFont('Tinos-Bold', os.path.join(FONTS, 'Tinos-Bold.ttf')))
    pdfmetrics.registerFont(TTFont('Tinos-Italic', os.path.join(FONTS, 'Tinos-Italic.ttf')))
    pdfmetrics.registerFont(TTFont('Tinos-BoldItalic', os.path.join(FONTS, 'Tinos-BoldItalic.ttf')))
    pdfmetrics.registerFont(TTFont('Lato', os.path.join(FONTS, 'Lato-Regular.ttf')))
    pdfmetrics.registerFont(TTFont('Lato-Bold', os.path.join(FONTS, 'Lato-Bold.ttf')))
    pdfmetrics.registerFont(TTFont('Lato-Black', os.path.join(FONTS, 'Lato-Black.ttf')))
    pdfmetrics.registerFontFamily('Tinos', normal='Tinos', bold='Tinos-Bold',
                                  italic='Tinos-Italic', boldItalic='Tinos-BoldItalic')
    pdfmetrics.registerFontFamily('Lato', normal='Lato', bold='Lato-Bold',
                                  italic='Lato', boldItalic='Lato-Bold')


# ------------------------------------------------------------------ styles
def make_styles():
    s = {}
    s['body'] = ParagraphStyle(
        'Body', fontName='Tinos', fontSize=12, leading=13.8, alignment=TA_JUSTIFY,
        textColor=black, spaceAfter=6.5, firstLineIndent=0)
    s['h1'] = ParagraphStyle(
        'H1', fontName='Lato-Bold', fontSize=12.5, leading=15, textColor=black,
        spaceBefore=16, spaceAfter=2, keepWithNext=1)
    s['h2'] = ParagraphStyle(
        'H2', fontName='Tinos-Bold', fontSize=12, leading=14, textColor=black,
        spaceBefore=12, spaceAfter=3.5, keepWithNext=1)
    s['fig'] = ParagraphStyle(
        'FigCap', fontName='Lato', fontSize=8.7, leading=11, alignment=TA_CENTER,
        textColor=MUTED, spaceBefore=5, spaceAfter=13)
    s['tabcap'] = ParagraphStyle(
        'TabCap', fontName='Lato', fontSize=8.7, leading=11, alignment=TA_LEFT,
        textColor=MUTED, spaceBefore=2, spaceAfter=4)
    s['cell'] = ParagraphStyle(
        'Cell', fontName='Tinos', fontSize=9.6, leading=12, textColor=black)
    s['cellb'] = ParagraphStyle(
        'CellB', fontName='Tinos-Bold', fontSize=9.6, leading=12, textColor=black)
    s['th'] = ParagraphStyle(
        'TH', fontName='Lato-Bold', fontSize=8.7, leading=11, textColor=black)
    s['ref'] = ParagraphStyle(
        'Ref', fontName='Tinos', fontSize=11, leading=13.6, textColor=black,
        leftIndent=20, firstLineIndent=-20, spaceAfter=6, alignment=TA_LEFT)
    s['toc0'] = ParagraphStyle(
        'TOC0', fontName='Lato-Bold', fontSize=10.5, leading=15, textColor=black,
        spaceBefore=7, dotsMinLevel=0)
    s['toc1'] = ParagraphStyle(
        'TOC1', fontName='Tinos', fontSize=10.5, leading=14.6, textColor=black,
        leftIndent=16, firstLineIndent=0, dotsMinLevel=1)
    s['toctitle'] = ParagraphStyle(
        'TOCTitle', fontName='Lato-Bold', fontSize=13, leading=16, textColor=black,
        spaceAfter=12)
    return s


STYLES = make_styles()


# ------------------------------------------------------------------ page furniture
def draw_header_footer(canv, doc, header=True):
    if header and doc.page > 2:
        canv.setFillColor(MUTED)
        canv.setFont('Lato', 8.2)
        canv.drawString(ML, PAGE_H - 40,
                        'Data Communications and Computer Networking  -  Assignment I')
        canv.drawRightString(PAGE_W - MR, PAGE_H - 40,
                             'Mubarek Seid  |  UUR00703/17  |  CCS7')
        canv.setStrokeColor(HexColor('#BFBFBF'))
        canv.setLineWidth(0.6)
        canv.line(ML, PAGE_H - 46, PAGE_W - MR, PAGE_H - 46)
    # footer rule
    canv.setStrokeColor(HexColor('#BFBFBF'))
    canv.setLineWidth(0.6)
    canv.line(ML, 44, PAGE_W - MR, 44)


def on_body(canv, doc):
    draw_header_footer(canv, doc, header=True)


def on_toc(canv, doc):
    draw_header_footer(canv, doc, header=False)


def draw_cover(canv, doc):
    c = canv
    top = PAGE_H

    # top bands
    c.setFillColor(NAVY)
    c.rect(0, top - 26, PAGE_W, 26, stroke=0, fill=1)
    c.setFillColor(YELLOW)
    c.rect(0, top - 32, PAGE_W, 6, stroke=0, fill=1)

    # logo
    size = 128
    logo = os.path.join(ASSETS, 'unity-logo.png')
    c.drawImage(logo, (PAGE_W - size) / 2.0, top - 32 - 20 - size, size, size,
                mask='auto')

    y = top - 32 - 20 - size - 26
    c.setFillColor(NAVY)
    c.setFont('Lato-Black', 24)
    c.drawCentredString(PAGE_W / 2.0, y, 'UNITY UNIVERSITY')
    y -= 20
    c.setFillColor(MUTED)
    c.setFont('Lato', 10.5)
    c.drawCentredString(PAGE_W / 2.0, y, 'Department of Computer Science')

    y -= 18
    c.setStrokeColor(YELLOW)
    c.setLineWidth(2.2)
    c.line(PAGE_W / 2.0 - 62, y, PAGE_W / 2.0 + 62, y)

    # course title block
    y -= 46
    c.setFillColor(black)
    c.setFont('Tinos-Bold', 19)
    c.drawCentredString(PAGE_W / 2.0, y, 'Data Communications and Computer Networking')
    y -= 30
    c.setFillColor(NAVY)
    c.setFont('Lato-Bold', 13)
    c.drawCentredString(PAGE_W / 2.0, y, 'A S S I G N M E N T   I')
    y -= 15
    c.setFillColor(MUTED)
    c.setFont('Lato', 9.5)
    c.drawCentredString(PAGE_W / 2.0, y, 'Section A to Section H  |  15% of the course mark')

    # details card
    card_w, card_h = 344, 176
    cx = (PAGE_W - card_w) / 2.0
    cy = 258
    c.setFillColor(HexColor('#F4F4F7'))
    c.setStrokeColor(HexColor('#D3D3DC'))
    c.setLineWidth(0.8)
    c.roundRect(cx, cy, card_w, card_h, 4, stroke=1, fill=1)
    c.setFillColor(NAVY)
    c.rect(cx, cy, 5, card_h, stroke=0, fill=1)

    rows = [
        ('Submitted by', 'Mubarek Seid'),
        ('ID number', 'UUR00703/17'),
        ('Section', 'CCS7'),
        ('Submitted to', '_________________________'),
        ('Submission date', '31 October 2026'),
    ]
    ry = cy + card_h - 26
    for label, value in rows:
        c.setFillColor(HexColor('#5A5A66'))
        c.setFont('Lato-Bold', 9)
        c.drawRightString(cx + 118, ry, label.upper())
        c.setFillColor(black)
        c.setFont('Tinos' if value.strip('_') else 'Lato', 12)
        c.drawString(cx + 132, ry - 0.6, value)
        if label != rows[-1][0]:
            c.setStrokeColor(HexColor('#E1E1E8'))
            c.setLineWidth(0.5)
            c.line(cx + 18, ry - 9, cx + card_w - 18, ry - 9)
        ry -= 30

    # bottom line
    c.setStrokeColor(HexColor('#D3D3DC'))
    c.setLineWidth(0.8)
    c.line(cx, 150, cx + card_w, 150)
    c.setFillColor(MUTED)
    c.setFont('Lato', 9.5)
    c.drawCentredString(PAGE_W / 2.0, 128, 'Addis Ababa, Ethiopia  |  October 2026')

    # bottom bands
    c.setFillColor(YELLOW)
    c.rect(0, 32, PAGE_W, 6, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, 32, stroke=0, fill=1)


# ------------------------------------------------------------------ doc template
class Assignment(BaseDocTemplate):
    def __init__(self, filename, **kw):
        BaseDocTemplate.__init__(self, filename, pagesize=A4,
                                 leftMargin=ML, rightMargin=MR,
                                 topMargin=MT, bottomMargin=MB,
                                 title='Assignment I - Data Communications and Computer '
                                       'Networking',
                                 author='Mubarek Seid',
                                 subject='Data Communications and Computer Networking',
                                 creator='Mubarek Seid', **kw)
        cover_frame = Frame(PAGE_W / 2.0, PAGE_H / 2.0, 10, 10, id='cover')
        body_frame = Frame(ML, MB, FRAME_W, FRAME_H, id='body',
                           leftPadding=0, rightPadding=0, topPadding=0,
                           bottomPadding=0)
        self.addPageTemplates([
            PageTemplate(id='cover', frames=[cover_frame], onPage=draw_cover),
            PageTemplate(id='toc', frames=[body_frame], onPage=on_toc),
            PageTemplate(id='body', frames=[body_frame], onPage=on_body),
        ])

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            name = flowable.style.name
            if name == 'H1':
                self.notify('TOCEntry', (0, flowable.getPlainText(), self.page))
            elif name == 'H2':
                self.notify('TOCEntry', (1, flowable.getPlainText(), self.page))


class NumberedCanvas(pdfcanvas.Canvas):
    def __init__(self, *args, **kwargs):
        pdfcanvas.Canvas.__init__(self, *args, **kwargs)
        self.setProducer('')
        self._saved = []

    def showPage(self):
        self._saved.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved)
        for state in self._saved:
            self.__dict__.update(state)
            if self._pageNumber > 1:
                self.setFillColor(MUTED)
                self.setFont('Lato', 8.4)
                self.drawCentredString(PAGE_W / 2.0, 30,
                                       'Page %d of %d' % (self._pageNumber, total))
            pdfcanvas.Canvas.showPage(self)
        pdfcanvas.Canvas.save(self)


# ------------------------------------------------------------------ story bits
def h1(text, nxt=None):
    p = Paragraph(smart(text), STYLES['h1'])
    rule = HRFlowable(width='100%', thickness=0.9, color=black,
                      spaceBefore=1, spaceAfter=9)
    if nxt is None:
        return [p, rule]
    return [KeepTogether([p, rule, Paragraph(smart(nxt), STYLES['h2'])])]


def caption(text, style='fig'):
    if ':' in text:
        head, rest = text.split(':', 1)
        text = '<b>%s:</b>%s' % (head, rest)
    return Paragraph(smart(text), STYLES[style])


def figure(key, cap):
    d = figures.FIGURES[key]()
    return KeepTogether([Spacer(1, 3), d, caption(cap), Spacer(1, 2)])


def build_table(spec):
    header = [Paragraph(h, STYLES['th']) for h in spec['header']]
    rows = [header]
    for r in spec['rows']:
        line = []
        for i, cell in enumerate(r):
            st = STYLES['cellb'] if i == 0 else STYLES['cell']
            line.append(Paragraph(smart(cell), st))
        rows.append(line)
    widths = [w * FRAME_W for w in spec['widths']]
    t = Table(rows, colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#E8E8E8')),
        ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
        ('VALIGN', (0, 1), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#8C8C8C')),
        ('BOX', (0, 0), (-1, -1), 1.0, black),
        ('LINEBELOW', (0, 0), (-1, 0), 1.0, black),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
    ]))
    cap = caption(spec['caption'], 'tabcap')
    if spec.get('split'):
        cap.keepWithNext = 1
        return [Spacer(1, 2), cap, t, Spacer(1, 13)]
    return [KeepTogether([Spacer(1, 2), cap, t, Spacer(1, 13)])]


def build_story():
    story = [NextPageTemplate('toc'), PageBreak()]

    # contents
    story.append(Paragraph('Contents', STYLES['toctitle']))
    toc = TableOfContents()
    toc.levelStyles = [STYLES['toc0'], STYLES['toc1']]
    toc.dotsMinLevel = 0
    story.append(toc)
    story.append(NextPageTemplate('body'))
    story.append(PageBreak())

    blocks = content.BLOCKS
    for idx, block in enumerate(blocks):
        kind = block[0]
        if kind == 'h1':
            nxt = None
            if idx + 1 < len(blocks) and blocks[idx + 1][0] == 'h2':
                nxt = blocks[idx + 1][1]
            story.extend(h1(block[1], nxt))
        elif kind == 'h2':
            if idx > 0 and blocks[idx - 1][0] == 'h1':
                continue          # already emitted with the section heading
            story.append(Paragraph(smart(block[1]), STYLES['h2']))
        elif kind == 'p':
            story.append(Paragraph(smart(block[1]), STYLES['body']))
        elif kind == 'fig':
            story.append(figure(block[1], block[2]))
        elif kind == 'tbl':
            story.extend(build_table(block[1]))
        elif kind == 'refs':
            for i, ref in enumerate(block[1], 1):
                story.append(Paragraph('[%d]&nbsp;&nbsp;%s' % (i, smart(ref)),
                                       STYLES['ref']))
    return story


def main():
    register_fonts()
    doc = Assignment(OUT)
    doc.producer = 'Unity University'
    doc.multiBuild(build_story(), canvasmaker=NumberedCanvas)
    print('written:', OUT)


if __name__ == '__main__':
    main()
