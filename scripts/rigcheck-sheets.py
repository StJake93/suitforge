# Builds one contact sheet per slot from rigcheck.mjs output (rows = items, cols = body extremes).
import json, sys
from PIL import Image, ImageDraw
out = sys.argv[1]
m = json.load(open(f'{out}/manifest.json'))
W, H = 300, 240
for slot in sorted({e['slot'] for e in m}):
    ids = []
    for e in m:
        if e['slot'] == slot and e['id'] not in ids: ids.append(e['id'])
    tags = ['m11', 'f00', 'f11']
    sheet = Image.new('RGB', (W * 3 + 160, H * len(ids) + 24), (20, 24, 32))
    d = ImageDraw.Draw(sheet)
    for j, t in enumerate(tags): d.text((160 + j * W + 8, 6), t, fill=(200, 200, 200))
    for i, id_ in enumerate(ids):
        d.text((6, 24 + i * H + H // 2), id_.split('.')[1][:22], fill=(230, 230, 230))
        for j, t in enumerate(tags):
            f = next(e['file'] for e in m if e['id'] == id_ and e['tag'] == t)
            im = Image.open(f).resize((W, H), Image.LANCZOS)
            sheet.paste(im, (160 + j * W, 24 + i * H))
    sheet.save(f'{out}/sheet_{slot}.png')
    print('sheet', slot, len(ids))
