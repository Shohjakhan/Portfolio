"""Cut out the approved art and export it into public/assets/scene/."""
import json, subprocess
from imgtool import *

IMG = '../images'
PUB = '/Users/shohjahon/Development/Portfolio website/public/assets/scene'
meta = {}

def export(name, w, h, rows):
    save_rgba(f'{PUB}/{name}', w, h, rows)
    meta[name] = (w, h)

# ---------------------------------------------------------------- bookshelf
W, H, R7 = load('h7.png')            # books only, grey, 671x1000
_, _, R4 = load('h4.png')            # full, cat awake, navy (aligned with 7)
_, _, R8 = load('h8.png')            # full, cat asleep, navy (upscaled to 671x1000)
A7 = flood_alpha(R7, W, H, px(R7, 3, 3), 10, 30)
A4 = flood_alpha(R4, W, H, px(R4, 3, 3), 8, 24)
A8 = flood_alpha(R8, W, H, px(R8, 3, 3), 8, 24)
drop_specks(A7, W, H, 60)

SX0, SY0, SX1, SY1 = 101, 165, 588, 991          # shelf bbox
IN_L, IN_R = 152, 538                             # inner side panels
ROWS = [(215, 322), (337, 455), (470, 628), (645, 800), (815, 945)]
BACKING = (22, 18, 16)

# frame = books-only with every compartment interior filled dark (backing for the tilting rows)
frame_src = [bytearray(r) for r in R7]
for (t, b) in ROWS:
    for y in range(t, b):
        for x in range(IN_L, IN_R):
            frame_src[y][x*3:x*3+3] = bytes(BACKING)
export('bookshelf/bookshelf-frame.png', SX1-SX0+1, SY1-SY0+1, rgba_rows(frame_src, A7, SX0, SY0, SX1, SY1))
full_alpha = [bytearray(b'\xff' * W) for _ in range(H)]
for i, (t, b) in enumerate(ROWS, 1):
    export(f'bookshelf/bookshelf-books-{i}.png', IN_R-IN_L, b-t, rgba_rows(R7, full_alpha, IN_L, t, IN_R-1, b-1))

def companion_mask(Rsrc, Asrc, region, vines=False):
    """Pixels of a full composite that sit outside the bare shelf's silhouette
    (cat, pot, leaves above/left of it), plus -- for the plant -- green vine
    pixels hanging in front of the shelf."""
    x0, y0, x1, y1 = region
    M = [bytearray(W) for _ in range(H)]
    for y in range(y0, y1):
        for x in range(x0, x1):
            a = Asrc[y][x]
            if not a: continue
            if A7[y][x] < 20:
                M[y][x] = a
            elif vines and x < 340 and y < 440:
                r, g, b = px(Rsrc, x, y)
                if g > r + 10 and g >= b + 4 and dist((r, g, b), px(R7, x, y)) > 18:
                    M[y][x] = 255
    drop_specks(M, W, H, 40)
    return M

def export_cut(name, Rsrc, M, box=None):
    bx = box or bbox(M, W, H)
    export(name, bx[2]-bx[0]+1, bx[3]-bx[1]+1, rgba_rows(Rsrc, M, *bx))
    return bx

cat_awake_m = companion_mask(R4, A4, (290, 40, 600, 200)); keep_largest(cat_awake_m, W, H)
cat_sleep_m = companion_mask(R8, A8, (290, 40, 600, 200)); keep_largest(cat_sleep_m, W, H)
ba, bs = bbox(cat_awake_m, W, H), bbox(cat_sleep_m, W, H)
plant_m = companion_mask(R4, A4, (60, 20, 340, 440), vines=True)
for y in range(H):
    for x in range(W):
        if cat_awake_m[y][x] or (x >= 296 and y < SY0): plant_m[y][x] = 0
drop_specks(plant_m, W, H, 70)
plant_box = export_cut('bookshelf/plants.png', R4, plant_m)
cat_box = (min(ba[0], bs[0]), min(ba[1], bs[1]), max(ba[2], bs[2]), max(ba[3], bs[3]))
export_cut('bookshelf/cat-awake.png', R4, cat_awake_m, cat_box)
export_cut('bookshelf/cat-sleeping.png', R8, cat_sleep_m, cat_box)
meta['_bookshelf_group'] = dict(composite=(75, 31, 588, 990), shelf=(SX0, SY0, SX1, SY1), plant=plant_box,
                                cat=cat_box, rows=ROWS, inner=(IN_L, IN_R))

# ---------------------------------------------------------------- lamp
W2, H2, RL = load('h9.png')
AL = flood_alpha(RL, W2, H2, px(RL, 3, 3), 10, 30); drop_specks(AL, W2, H2, 60)
lb = bbox(AL, W2, H2)
export('decor/lamp.png', lb[2]-lb[0]+1, lb[3]-lb[1]+1, rgba_rows(RL, AL, *lb))
meta['_lamp_bbox'] = lb

# ---------------------------------------------------------------- easel (full image + canvas overlay)
W3, H3, RE = load('h10.png')
AE = flood_alpha(RE, W3, H3, px(RE, 3, 3), 10, 30); drop_specks(AE, W3, H3, 60)
eb = bbox(AE, W3, H3)
export('art/easel.png', eb[2]-eb[0]+1, eb[3]-eb[1]+1, rgba_rows(RE, AE, *eb))
# canvas quad (half-scale coords): TL, TR, BR, BL
quad = [(107, 211), (421, 219), (421, 603), (107, 627)]
def inside(x, y, poly):
    c = False; n = len(poly)
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i+1) % n]
        if (y1 > y) != (y2 > y) and x < (x2-x1)*(y-y1)/(y2-y1)+x1: c = not c
    return c
AC = [bytearray(W3) for _ in range(H3)]
for y in range(205, 632):
    for x in range(100, 428):
        if inside(x, y, quad): AC[y][x] = AE[y][x]
cb = bbox(AC, W3, H3)
export('art/easel-canvas.png', cb[2]-cb[0]+1, cb[3]-cb[1]+1, rgba_rows(RE, AC, *cb))
meta['_easel'] = dict(bbox=eb, canvas=cb)

# ---------------------------------------------------------------- window frame (green screen)
W4, H4, RW = load('h11.png')
AW = key_alpha(RW, W4, H4, (3, 194, 87), 70, 130)
wb = bbox(AW, W4, H4)
export('window/window-frame.png', wb[2]-wb[0]+1, wb[3]-wb[1]+1, rgba_rows(RW, AW, *wb, despill='green'))
meta['_window'] = dict(bbox=wb, glass=(183, 241, 561, 801))

json.dump(meta, open('meta.json', 'w'), indent=1)
print(json.dumps(meta, indent=1))
