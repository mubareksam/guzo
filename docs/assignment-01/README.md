# Assignment I — Data Communications and Computer Networking

Print-ready submission package for **Mubarek Seid** (ID UUR00703/17, Section CCS7),
Unity University, Department of Computer Science. Submission date 31 October 2026
(the 17 October deadline plus two weeks).

## Deliverable

`Assignment-I_Data-Communications-and-Computer-Networks.pdf` — 17 pages, A4.

| Page | Content |
| --- | --- |
| 1 | Cover with the university logo, name, ID, section, submission date (the only colour page) |
| 2 | Contents |
| 3–17 | Introduction, Sections A–H (Q1–Q16), references |

Everything after the cover is black and white only, so it prints cleanly on a
mono laser printer: the eight diagrams are vector drawings in black with light
tints, and no meaning depends on colour.

## Formatting choices

- Body text: 12 pt serif (Tinos, metric-compatible with Times New Roman), 1.15 line spacing, justified.
- Headings carry the question numbers (`Q1.` … `Q16.`) and follow the assignment's section titles.
- Tables are used only where the question asks for one (Q6, Q9, Q11); every other answer is prose with a diagram.
- Six sources are listed and cited in the text with square brackets.

## Rebuilding

The PDF is generated from `build/content.py` (the text) and `build/figures.py`
(the diagrams, drawn with ReportLab's vector primitives).

```bash
python3 -m venv /tmp/venv
/tmp/venv/bin/pip install reportlab
/tmp/venv/bin/python build/build.py
```

Fonts (Tinos, Lato) are in `assets/fonts`; the logo is `assets/unity-logo.png`.
