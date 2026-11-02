#!/usr/bin/env python3
"""從場景資料製作可編輯的 PowerPoint 手動提示版；不會匯出網頁動畫。"""
import json
import subprocess
from pathlib import Path
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.xmlchemy import OxmlElement
from pptx.util import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'deliverables' / 'stage-cues.pptx'
scenes = json.loads(subprocess.check_output([
    'node', '--experimental-default-type=module', '-e',
    "import {scenes} from './scenes/index.js'; console.log(JSON.stringify(scenes));"
], cwd=ROOT, text=True))
prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333333), Inches(7.5)
blank = prs.slide_layouts[6]

def shape(slide, x, y, w, h, color, rounded=False, opacity=1):
    obj = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,
                                 Inches(x), Inches(y), Inches(w), Inches(h))
    obj.fill.solid(); obj.fill.fore_color.rgb = RGBColor.from_string(color)
    obj.line.fill.background()
    if opacity < 1:
        srgb = obj.fill._xPr.solidFill.srgbClr
        alpha = OxmlElement('a:alpha'); alpha.set('val', str(round(opacity * 100000))); srgb.append(alpha)
    return obj

def textbox(slide, text, x, y, w, h, size=20, color='F4F5F3', align=PP_ALIGN.LEFT, bold=False, vertical=MSO_ANCHOR.MIDDLE):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame; tf.clear(); tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(.03); tf.margin_top = tf.margin_bottom = Inches(.02)
    tf.vertical_anchor = vertical
    p = tf.paragraphs[0]; p.alignment = align; p.text = text
    p.font.name = 'Microsoft JhengHei'; p.font.size = Pt(size); p.font.bold = bold; p.font.color.rgb = RGBColor.from_string(color)
    return box

def picture_cover(slide, path, x, y, w, h):
    with Image.open(path) as img: image_ratio = img.width / img.height
    pic = slide.shapes.add_picture(str(path), Inches(x), Inches(y), Inches(w), Inches(h))
    box_ratio = w / h
    if image_ratio > box_ratio:
        crop = (1 - box_ratio / image_ratio) / 2
        pic.crop_left = pic.crop_right = crop
    else:
        crop = (1 - image_ratio / box_ratio) / 2
        pic.crop_top = pic.crop_bottom = crop
    return pic

def fade(slide):
    transition = OxmlElement('p:transition'); transition.set('spd', 'slow'); transition.set('advClick', '1')
    transition.append(OxmlElement('p:fade')); slide._element.append(transition)

def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text

def add_phone(slide, scene, count=None):
    # Editable PowerPoint shapes: the full animation remains available in the web version.
    x, y, w, h = 4.75, .18, 3.84, 7.12
    shape(slide, x, y, w, h, '626B70', True)
    shape(slide, x+.06, y+.06, w-.12, h-.12, '080B0E', True)
    shape(slide, x+.12, y+.12, w-.24, h-.24, '1C303E', True)
    shape(slide, 6.10, .33, 1.18, .22, '050709', True)
    textbox(slide, scene.get('clock',''), 5.02, .41, .65, .25, 10, bold=True)
    textbox(slide, '◢  ◕  ▰', 7.64, .41, .58, .25, 9, align=PP_ALIGN.RIGHT)
    if scene['type'] == 'social':
        shape(slide, 5.00, .88, 3.34, 5.85, 'E8EBE8', True)
        textbox(slide, '朋友的近況', 5.18, 1.02, 2.9, .40, 16, '1B2224', bold=True)
        picture_cover(slide, ROOT / scene['photo'], 5.02, 1.55, 3.30, 3.4)
        textbox(slide, '和喜歡的人，一起迎接聖誕。', 5.18, 5.14, 2.95, .75, 15, '1B2224')
    else:
        textbox(slide, scene.get('date',''), 5.15, 1.03, 3.08, .32, 13, align=PP_ALIGN.CENTER)
        textbox(slide, scene.get('clock',''), 5.15, 1.36, 3.08, .80, 48, align=PP_ALIGN.CENTER)
        cards = scene.get('notifications', [])[:count]
        cards = list(reversed(cards[-4:]))
        for i, card in enumerate(cards):
            cy = 2.45 + i * .98
            shape(slide, 5.02, cy, 3.31, .91, 'D7E0E1', True)
            shape(slide, 5.16, cy+.12, .23, .23, '718C7C', True)
            textbox(slide, card['sender'], 5.44, cy+.10, 2.10, .24, 12, '192026', bold=True)
            textbox(slide, '現在', 7.75, cy+.10, .40, .24, 9, '5A6468', align=PP_ALIGN.RIGHT)
            textbox(slide, card['message'], 5.17, cy+.37, 3.00, .48, 13.5, '192026', vertical=MSO_ANCHOR.TOP)
    shape(slide, 6.18, 7.07, .99, .04, 'DEE5E4', True)

def add_scene(scene, notification_count=None):
    slide = prs.slides.add_slide(blank)
    picture_cover(slide, ROOT / scene['background'], 0, 0, 13.333333, 7.5)
    shape(slide, 0, 0, 13.333333, 7.5, '03080B', opacity=.28 if scene['type'] != 'closing' else .7)
    if scene.get('warmth'):
        shape(slide, 0, 0, 13.333333, 7.5, 'F5A85B', opacity=scene['warmth'] * .09)
    if scene['type'] in ('phone', 'social'):
        add_phone(slide, scene, notification_count)
    if scene.get('caption'):
        if scene['type'] == 'closing':
            shape(slide, 0, 2.55, 13.333333, 2.3, '080B0C', opacity=.32)
            textbox(slide, scene['caption'], 1.05, 2.92, 11.23, 1.5, 27, align=PP_ALIGN.CENTER)
        else:
            shape(slide, .70, 6.05, 11.93, 1.15, '080B0C', opacity=.55)
            textbox(slide, scene['caption'], 1, 6.12, 11.33, 1.0, 24, align=PP_ALIGN.CENTER)
    fade(slide)
    extra = ''
    if notification_count is not None and len(scene.get('notifications', [])) > 1:
        extra = f'\n訊息 {notification_count}／{len(scene["notifications"])}：按下一頁出現下一則。'
    notes(slide, f"{scene['act']}｜{scene['title']}\n{scene['description']}\n操作提示：{scene['cue']}{extra}\n手動推進；本提示版為靜態畫面，無音效。")

# Start/end black are deliberate handoff points when inserting into the shared presentation.
slide=prs.slides.add_slide(blank); shape(slide, 0, 0, 13.333333, 7.5, '000000'); fade(slide)
notes(slide, '演出開始前黑場。等第四組結束、舞台準備好後，再手動進入第一幕。')
for scene in scenes:
    count = len(scene.get('notifications', []))
    for i in range(1, count + 1) if count > 1 else [count if count else None]:
        add_scene(scene, i)
slide=prs.slides.add_slide(blank); shape(slide, 0, 0, 13.333333, 7.5, '000000'); fade(slide)
notes(slide, '演出結束黑場。等交接準備好後，再進入第六組的投影片。')
OUTPUT.parent.mkdir(parents=True, exist_ok=True); prs.save(OUTPUT)
print(f'已建立 {OUTPUT}，共 {len(prs.slides)} 頁（包含前後黑場）。')
