"""Panel art pipeline (2026-10-15): resize / cut the approved batch-1 files into public/assets/panels/."""
import os, subprocess, json
from imgtool import *

SRC = '/Users/shohjahon/Development/Portfolio website/art-source/07-panels'
OUT = '/Users/shohjahon/Development/Portfolio website/public/assets/panels'
for d in ('shared', 'about', 'laptop', 'library', 'art', 'journal', 'contact', 'cinema'):
    os.makedirs(f'{OUT}/{d}', exist_ok=True)
meta = {}
lum = lambda p: (p[0]*3 + p[1]*6 + p[2]) // 10

def jpg(name, dst, width, q=80, crop=None):
    """Optionally crop (x,y,w,h in source px), then resize + save as jpeg."""
    src = f'{SRC}/raw-{name}.jpg'; out = f'{OUT}/{dst}'
    args = ['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', str(q)]
    if crop:
        x, y, w, h = crop
        tmp = 'tmp_crop.jpg'
        subprocess.run(['sips', '-c', str(h), str(w), '--cropOffset', str(y), str(x), src, '--out', tmp], check=True, capture_output=True)
        src = tmp
    subprocess.run(args + ['--resampleWidth', str(width), src, '--out', out], check=True, capture_output=True)
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', out], capture_output=True, text=True).stdout.split()
    meta[dst] = (int(r[-3]), int(r[-1]))

def png_path(name, width):
    """Decode a raw to a working PNG at `width` (returns W,H,rows and keeps scale factor)."""
    return to_png(f'{SRC}/raw-{name}.jpg', f'tmp_{name}.png', width=width)

def save_png(dst, W, H, rows, width=None):
    p = f'{OUT}/{dst}'
    save_rgba(p, W, H, rows)
    if width and width < W: subprocess.run(['sips', '--resampleWidth', str(width), p], check=True, capture_output=True)
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', p], capture_output=True, text=True).stdout.split()
    meta[dst] = (int(r[-3]), int(r[-1]))

def dilate(M, W, H, n=1):
    for _ in range(n):
        N = [bytearray(r) for r in M]
        for y in range(1, H-1):
            for x in range(1, W-1):
                if not M[y][x] and (M[y-1][x] or M[y+1][x] or M[y][x-1] or M[y][x+1]): N[y][x] = 255
        M = N
    return M

# ---------------------------------------------------------------- plain resizes
jpg('P1-parchment', 'shared/parchment.jpg', 1400, 78)
jpg('A1-portrait', 'about/portrait.jpg', 480, 84)
jpg('L1-laptop-wallpaper', 'laptop/wallpaper.jpg', 1600, 80)
jpg('J1-diary-page', 'journal/diary-page.jpg', 760, 82, crop=(48, 40, 790, 1120))
jpg('K1-address-book', 'contact/address-book.jpg', 1500, 80)
jpg('B1-two-tier-bookcase', 'library/bookcase.jpg', 1500, 82, crop=(60, 62, 1262, 656))

# velvet comes from art-source/07-panels/raw-C2-velvet.jpg
jpg('C2-velvet', 'cinema/velvet.jpg', 900, 78)

# ---------------------------------------------------------------- book covers (crop by scanning the cover edge)
def cover(name, dst, width, thr=55):
    W, H, R = png_path(name, 671)
    mid = H // 2
    def first(seq):
        for i, v in enumerate(seq):
            if v: return i
    row = [lum(px(R, x, mid)) > thr for x in range(W)]
    left = first(row); right = W - 1 - first(row[::-1])
    col = [lum(px(R, W // 2, y)) > thr for y in range(H)]
    top = first(col); bottom = H - 1 - first(col[::-1])
    pad = 6   # stay just inside the cover so no dark background shows
    box = (left + pad, top + pad, right - pad, bottom - pad)
    s = 2000 / H
    x0, y0, x1, y1 = [round(v * s) for v in box]
    print(name, 'cover box (2000px frame)', x0, y0, x1, y1)
    jpg(name, dst, width, 84, crop=(x0, y0, x1 - x0, y1 - y0))
cover('B2-my-writings-cover', 'library/cover-writings.jpg', 520)
cover('B3-warkinless-cover', 'library/cover-warkinless.jpg', 520)

# ---------------------------------------------------------------- launcher icons (2x2 sheet, flat grey)
W, H, R = png_path('L2-folder-icons', 1000)
quads = {'projects': (60, 120, 520, 470), 'experience': (540, 120, 960, 470),
         'achievements': (60, 530, 500, 900), 'events': (540, 500, 960, 900)}
for key, (x0, y0, x1, y1) in quads.items():
    sub = [bytearray(R[y][x0*3:x1*3]) for y in range(y0, y1)]
    w, h = x1 - x0, y1 - y0
    bgc = px(sub, 3, 3)
    F = flood_alpha(sub, w, h, bgc, 12, 34); K = key_alpha(sub, w, h, bgc, 8, 22)
    A = [bytearray(min(p, q) for p, q in zip(F[y], K[y])) for y in range(h)]
    drop_specks(A, w, h, 40); keep_largest(A, w, h)
    b = bbox(A, w, h)
    save_png(f'laptop/icon-{key}.png', b[2]-b[0]+1, b[3]-b[1]+1, rgba_rows(sub, A, *b), 200)

# ---------------------------------------------------------------- doodles (alpha from darkness against local paper)
W, H, R = png_path('A3-doodles', 1000)
doodles = {'compass': (50, 130, 360, 440), 'quill': (390, 120, 610, 430), 'mountains': (610, 160, 960, 430),
           'moon': (90, 540, 320, 790), 'plane': (370, 560, 640, 770), 'seedling': (680, 540, 880, 810)}
for key, (x0, y0, x1, y1) in doodles.items():
    sub = [bytearray(R[y][x0*3:x1*3]) for y in range(y0, y1)]
    w, h = x1 - x0, y1 - y0
    ls = sorted(lum(px(sub, x, y)) for y in range(0, h, 3) for x in range(0, w, 3))
    paper = ls[int(len(ls) * 0.88)]
    rows = []
    for y in range(h):
        o = bytearray()
        for x in range(w):
            c = px(sub, x, y); d = paper - lum(c)
            a = 0 if d < 26 else min(255, int((d - 26) * 255 / 60))
            o += bytes((c[0], c[1], c[2], a))
        rows.append(o)
    save_png(f'about/doodle-{key}.png', w, h, rows, 240)

# ---------------------------------------------------------------- stamp
# Top/left/right cream edges are detectable; the bottom one sits on a dark blur and isn't. The stamp is
# symmetric, so the bottom edge is placed from the hole's margins and its scallops mirrored from the top.
W, H, R = png_path('J2-stamp', 700)
cream = lambda p: lum(p) > 150
M = [bytearray(W) for _ in range(H)]
for y in range(H):
    for x in range(W):
        if cream(px(R, x, y)): M[y][x] = 255
keep_largest(M, W, H)
b0 = bbox(M, W, H)
G = [bytearray(W) for _ in range(H)]
for y in range(b0[1], min(H, b0[3] + 40)):
    for x in range(b0[0], b0[2]):
        c = px(R, x, y)
        if c[1] > c[0] + 50 and c[1] > c[2] + 40 and c[1] > 135: G[y][x] = 255
keep_largest(G, W, H)
gb = bbox(G, W, H)
ybot = gb[3] + (gb[1] - b0[1])
x0, y0, x1, y1 = b0[0], b0[1], b0[2], ybot + 1
Wd, Ht = x1 - x0 + 1, y1 - y0 + 1
RING = 22
Md = dilate(M, W, H, 1)
A = [bytearray(W) for _ in range(H)]
for y in range(y0, y1 + 1):
    v = y - y0; vf = min(v, Ht - 1 - v)
    for x in range(x0, x1 + 1):
        u = x - x0; uf = min(u, Wd - 1 - u)
        if uf >= RING and vf >= RING: A[y][x] = 255
        else: A[y][x] = Md[y0 + vf][x0 + uf]     # fold onto the top-left quadrant, where the scallops are detectable
GD = dilate(G, W, H, 2)
for y in range(H):
    for x in range(W):
        if GD[y][x]: A[y][x] = 0
b = bbox(A, W, H)
save_png('journal/stamp.png', b[2]-b[0]+1, b[3]-b[1]+1, rgba_rows(R, A, *b), 360)
BW, BH = b[2]-b[0]+1, b[3]-b[1]+1
meta['_stamp_hole'] = dict(left=round(100*(gb[0]-b[0])/BW, 2), top=round(100*(gb[1]-b[1])/BH, 2),
                           width=round(100*(gb[2]-gb[0]+1)/BW, 2), height=round(100*(gb[3]-gb[1]+1)/BH, 2), aspect=f'{BW} / {BH}')

# ---------------------------------------------------------------- envelope
W, H, R = png_path('K2-envelope', 900)
A = flood_alpha(R, W, H, px(R, 20, H//2), 14, 40); drop_specks(A, W, H, 60); keep_largest(A, W, H)
b = bbox(A, W, H)
save_png('contact/envelope.png', b[2]-b[0]+1, b[3]-b[1]+1, rgba_rows(R, A, *b), 560)

# ---------------------------------------------------------------- gallery frames: crop at the outer edge, key the green hole
def frame(name, dst, width, bgcol=None):
    W, H, R = png_path(name, 800)
    G = [bytearray(W) for _ in range(H)]
    for y in range(H):
        for x in range(W):
            c = px(R, x, y)
            if c[1] > c[0] + 60 and c[1] > c[2] + 45 and c[1] > 120: G[y][x] = 255
    keep_largest(G, W, H)
    hb = bbox(G, W, H)
    G = dilate(G, W, H, 3)
    cy, cx = (hb[1] + hb[3]) // 2, (hb[0] + hb[2]) // 2
    def edge(seq, rng):
        base = None
        for i in rng:
            v = seq(i)
            if base is None: base = v; continue
            if abs(v - base) > 22: return i
            base = base * 0.7 + v * 0.3
        return None
    ol = edge(lambda x: lum(px(R, x, cy)), range(0, hb[0]))
    orr = W - 1 - edge(lambda x: lum(px(R, W-1-x, cy)), range(0, W - 1 - hb[2]))
    ot = edge(lambda y: lum(px(R, cx, y)), range(0, hb[1]))
    ob = H - 1 - edge(lambda y: lum(px(R, cx, H-1-y)), range(0, H - 1 - hb[3]))
    box = (ol, ot, orr, ob)
    A = [bytearray(b'\xff' * W) for _ in range(H)]
    for y in range(H):
        for x in range(W):
            if G[y][x]: A[y][x] = 0
    BW, BH = box[2]-box[0]+1, box[3]-box[1]+1
    save_png(dst, BW, BH, rgba_rows(R, A, *box), width)
    # border thickness (px of the saved image) on each side
    s = meta[dst][0] / BW
    th = dict(top=round((hb[1]-box[1])*s), right=round((box[2]-hb[2])*s), bottom=round((box[3]-hb[3])*s), left=round((hb[0]-box[0])*s))
    meta['_' + dst] = dict(box=box, hole=hb, border=th)
frame('G2-frame-gold-baroque', 'art/frame-gold.png', 520)
frame('G2-frame-black', 'art/frame-black.png', 420)
frame('G2-frame-walnut', 'art/frame-wood.png', 420)

# ---------------------------------------------------------------- gallery decor: bust + monstera (bottoms fade into the gallery floor)
def decor(name, dst, region, ycut, fade, width, bgpt, chroma=(12, 30), dark=0):
    W, H, R = png_path(name, 1000)
    x0, y0, x1, y1 = region
    sub = [bytearray(R[y][x0*3:x1*3]) for y in range(y0, min(y1, ycut))]
    w, h = x1 - x0, len(sub)
    bgc = px(R, *bgpt)
    F = flood_alpha(sub, w, h, bgc, 12, 36); K = key_alpha(sub, w, h, bgc, 8, 26)
    A = [bytearray(min(p, q) for p, q in zip(F[y], K[y])) for y in range(h)]
    # neutral-grey haze (the baked-in blurred table) has almost no chroma; the objects do, or are dark
    for y in range(h):
        for x in range(w):
            c = px(sub, x, y); ch = max(c) - min(c)
            keep = 255 if (ch >= chroma[1] or lum(c) < dark) else max(0, min(255, int((ch - chroma[0]) * 255 / max(1, chroma[1] - chroma[0]))))
            if keep < A[y][x]: A[y][x] = keep
    drop_specks(A, w, h, 80); keep_largest(A, w, h)
    for y in range(h - fade, h):
        f = (h - 1 - y) / fade
        A[y] = bytearray(int(v * f) for v in A[y])
    b = bbox(A, w, h)
    save_png(dst, b[2]-b[0]+1, b[3]-b[1]+1, rgba_rows(sub, A, *b), width)
decor('G3-bust-fig', 'art/decor-bust.png', (150, 340, 360, 700), 668, 30, 240, (20, 20), chroma=(14, 34))
decor('G3-alt-ballerina-monstera', 'art/decor-plant.png', (500, 130, 960, 800), 765, 40, 320, (20, 20), chroma=(10, 22), dark=80)

json.dump(meta, open('meta_panels.json', 'w'), indent=1)
print(json.dumps(meta, indent=1))
