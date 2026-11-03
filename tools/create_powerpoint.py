#!/usr/bin/env python3
"""從場景資料製作可編輯的 PowerPoint 手動提示版；不會匯出網頁動畫。"""
import json
import subprocess
import io
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
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

def add_emoji(slide, x, y):
    # 將兩個表情繪成圖形，避免 PowerPoint 缺少表情字體而顯示方框。
    im = Image.new('RGBA', (128, 64), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle((27, 49, 37, 60), fill='#9a633d')
    d.polygon([(32, 7),(13,31),(21,31),(9,48),(55,48),(43,31),(51,31)], fill='#258a57')
    d.ellipse((27, 2, 37, 12), fill='#f4cb62')
    d.ellipse((19, 35, 23, 39), fill='#f6d68a'); d.ellipse((39, 32, 43, 36), fill='#eaa4a4')
    d.ellipse((70, 13, 96, 39), fill='#d45a59'); d.ellipse((90, 13, 116, 39), fill='#d45a59')
    d.polygon([(70,28),(116,28),(93,56)], fill='#d45a59')
    buf=io.BytesIO(); im.save(buf,format='PNG'); buf.seek(0)
    slide.shapes.add_picture(buf, Inches(x), Inches(y), Inches(.65), Inches(.325))

def add_phone(slide, scene, count=None):
    # 投影優先：放大手機與文字，逐條顯示時最多保留最近兩則。
    x, y, w, h = 4.18, .18, 4.98, 7.12
    shape(slide, x, y, w, h, '626B70', True)
    shape(slide, x+.06, y+.06, w-.12, h-.12, '080B0E', True)
    shape(slide, x+.12, y+.12, w-.24, h-.24, '1C303E', True)
    shape(slide, 6.10, .33, 1.18, .22, '050709', True)
    textbox(slide, scene.get('clock',''), 4.52, .41, .85, .25, 13, bold=True)
    textbox(slide, '◢  ◕  ▰', 8.13, .41, .68, .25, 11, align=PP_ALIGN.RIGHT)
    if scene['type'] == 'social':
        shape(slide, 4.46, .88, 4.42, 5.85, 'E8EBE8', True)
        textbox(slide, '朋友的近況', 4.65, 1.02, 4.03, .48, 23, '1B2224', bold=True)
        picture_cover(slide, ROOT / scene['photo'], 4.48, 1.62, 4.38, 3.4)
        textbox(slide, '和喜歡的人，一起迎接聖誕。', 4.65, 5.18, 4.02, 1.00, 22, '1B2224')
    elif scene['type'] == 'draft':
        shape(slide, 4.46, .88, 4.42, 5.85, 'E7ECE8', True)
        textbox(slide, '‹　朋友', 4.65, 1.02, 4, .46, 22, '1B2928', bold=True)
        textbox(slide, '今天', 4.65, 1.70, 4, .35, 16, '77827F', align=PP_ALIGN.CENTER)
        shape(slide, 4.63, 5.48, 4.09, 1.05, 'FFFFFF', True)
        textbox(slide, scene['draft'] if count == 1 else '', 4.78, 5.56, 3.80, .9, 22, '182320')
    elif scene['type'] == 'chat':
        shape(slide, 4.46, .88, 4.42, 5.85, 'D9DFD7', True)
        shape(slide, 4.46, .88, 4.42, .79, '145E52')
        textbox(slide, '‹　朋友群組', 4.63, .98, 3.9, .42, 22, 'F2F7F3', bold=True)
        textbox(slide, 'WhatsApp', 5.06, 1.39, 2.2, .2, 12, 'D9E8E1')
        for i, message in enumerate(scene['messages'][:count][-2:]):
            cy = 1.92 + i * 1.87
            shape(slide, 4.62, cy, 4.06, 1.70, 'F6F7F3', True)
            textbox(slide, message['sender'], 4.80, cy+.10, 3.70, .32, 17, '367C70', bold=True)
            message_text = message['message']
            if '🎄❤️' in message_text:
                message_text = message_text.replace('🎄❤️', '')
                textbox(slide, message_text, 4.80, cy+.48, 2.82, 1.05, 22, '192421', vertical=MSO_ANCHOR.TOP)
                add_emoji(slide, 7.63, cy+.52)
            else:
                textbox(slide, message_text, 4.80, cy+.48, 3.70, 1.05, 22, '192421', vertical=MSO_ANCHOR.TOP)
    elif scene['type'] == 'call':
        textbox(slide, '來電', 4.64, 1.40, 4.05, .46, 22, 'CBD5D8', align=PP_ALIGN.CENTER)
        textbox(slide, scene['caller'], 4.64, 1.95, 4.05, .85, 48, align=PP_ALIGN.CENTER)
        shape(slide, 6.26, 5.75, .82, .82, '3C9873', True)
        textbox(slide, '☎', 6.28, 5.84, .78, .55, 24, align=PP_ALIGN.CENTER)
    else:
        textbox(slide, scene.get('date',''), 4.64, 1.03, 4.05, .35, 18, align=PP_ALIGN.CENTER)
        textbox(slide, scene.get('clock',''), 4.64, 1.36, 4.05, .80, 52, align=PP_ALIGN.CENTER)
        cards = list(reversed(scene.get('notifications', [])[:count][-2:]))
        for i, card in enumerate(cards):
            cy = 2.42 + i * 1.82
            shape(slide, 4.50, cy, 4.35, 1.67, 'D7E0E1', True)
            shape(slide, 4.68, cy+.16, .28, .28, '718C7C', True)
            textbox(slide, card['sender'], 5.02, cy+.12, 3.55, .35, 18, '192026', bold=True)
            textbox(slide, card['message'], 4.69, cy+.52, 3.95, 1.00, 21, '192026', vertical=MSO_ANCHOR.TOP)
    shape(slide, 6.18, 7.07, .99, .04, 'DEE5E4', True)

def wrap_caption(text, max_chars=17):
    # 在標點附近斷行，避免長句超出投影畫面。
    import re
    chunks = [c for c in re.split(r'(?<=[，。？！])', text) if c]
    lines = []
    for chunk in chunks:
        while len(chunk) > max_chars:
            lines.append(chunk[:max_chars]); chunk = chunk[max_chars:]
        if lines and len(lines[-1]) + len(chunk) <= max_chars:
            lines[-1] += chunk
        elif chunk:
            lines.append(chunk)
    return '\n'.join(lines)

def static_fireworks(slide):
    # 提示版為靜態形狀／圖層；網頁才有連續煙花動畫。
    im = Image.new('RGBA', (1360, 765), (0, 0, 0, 0)); draw = ImageDraw.Draw(im)
    for cx, cy, radius in [(520, 140, 85), (825, 100, 105), (655, 245, 64)]:
        for i in range(48):
            angle = 2 * math.pi * i / 48; r = radius * (.72 + (i % 4) * .09)
            x = cx + math.cos(angle) * r; y = cy + math.sin(angle) * r
            draw.line((cx + math.cos(angle) * r * .45, cy + math.sin(angle) * r * .45, x, y), fill=(255, 207, 152, 190), width=2)
    glow = im.filter(ImageFilter.GaussianBlur(9)); glow.alpha_composite(im)
    buf = io.BytesIO(); glow.save(buf, format='PNG'); buf.seek(0)
    slide.shapes.add_picture(buf, Inches(0), Inches(0), Inches(13.333333), Inches(7.5))

def add_scene(scene, notification_count=None):
    slide = prs.slides.add_slide(blank)
    picture_cover(slide, ROOT / (scene.get('overlayBackground') or scene['background']), 0, 0, 13.333333, 7.5)
    shape(slide, 0, 0, 13.333333, 7.5, '03080B', opacity=.28 if scene['type'] != 'closing' else .34)
    if scene.get('motion', {}).get('preset') == 'fireworks': static_fireworks(slide)
    if scene.get('warmth'):
        shape(slide, 0, 0, 13.333333, 7.5, 'F5A85B', opacity=scene['warmth'] * .09)
    if scene['type'] in ('phone', 'social', 'draft', 'chat', 'call'):
        add_phone(slide, scene, notification_count)
    if scene.get('caption'):
        shape(slide, .36, 2.10, 12.61, 3.30, '080B0C', opacity=.48)
        caption = wrap_caption(scene['caption'])
        fontsize = 44 if len(scene['caption']) > 34 else 50
        textbox(slide, caption, .65, 2.19, 12.03, 3.12, fontsize, align=PP_ALIGN.CENTER, bold=True)
    fade(slide)
    extra = ''
    if notification_count is not None and len(scene.get('notifications', [])) > 1:
        extra = f'\n訊息 {notification_count}／{len(scene["notifications"])}：按下一頁出現下一則。'
    if scene['type'] == 'chat': extra = f'\n群組訊息 {notification_count}／{len(scene["messages"])}：按下一頁出現下一則。'
    if scene['type'] == 'draft': extra = '\n草稿示範：先輸入，再按下一頁顯示刪除後的空白。'
    audio_sources = [item['src'] for item in scene.get('audio', {}).get('effects', []) if item.get('src')]
    audio_note = ('\n預錄檔（未嵌入）：' + '、'.join(audio_sources) + '；請在 PowerPoint 中自行插入並設定播放。') if audio_sources else ''
    notes(slide, f"{scene['act']}｜{scene['title']}\n{scene['description']}\n操作提示：{scene['cue']}{extra}{audio_note}\n手動推進；本提示版為靜態畫面，無內嵌音效。")

# Start/end black are deliberate handoff points when inserting into the shared presentation.
slide=prs.slides.add_slide(blank); shape(slide, 0, 0, 13.333333, 7.5, '000000'); fade(slide)
notes(slide, '演出開始前黑場。等第四組結束、舞台準備好後，再手動進入第一幕。')
for scene in scenes:
    count = len(scene.get('notifications', [])) or len(scene.get('messages', [])) or (2 if scene['type'] == 'draft' else 0)
    for i in range(1, count + 1) if count > 1 else [count if count else None]:
        add_scene(scene, i)
slide=prs.slides.add_slide(blank); shape(slide, 0, 0, 13.333333, 7.5, '000000'); fade(slide)
notes(slide, '演出結束黑場。等交接準備好後，再進入第六組的投影片。')
OUTPUT.parent.mkdir(parents=True, exist_ok=True); prs.save(OUTPUT)
print(f'已建立 {OUTPUT}，共 {len(prs.slides)} 頁（包含前後黑場）。')
