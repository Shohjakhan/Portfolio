"""Second batch: the remaining landing-page objects (2026-10-15)."""
import json, subprocess
from imgtool import *

I = '../images'
PUB = '/Users/shohjahon/Development/Portfolio website/public/assets/scene'
meta = {}
lum = lambda p: (p[0]*3 + p[1]*6 + p[2]) // 10

def dims(path):
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path], capture_output=True, text=True).stdout.split()
    return int(r[-3]), int(r[-1])

def out(name, w, h, rows, width=None):
    path = f'{PUB}/{name}'
    save_rgba(path, w, h, rows)
    if width and width < w:
        subprocess.run(['sips', '--resampleWidth', str(width), path], check=True, capture_output=True)
    meta[name] = dims(path)

def work(n, w, h=None):
    return to_png(f'{I}/{n}.jpg', f'w{n}.png', width=w, height=h)

def cut(n, name, wwork, width, lo=10, hi=30, largest=False, specks=60, bg=None):
    W, H, R = work(n, wwork)
    A = flood_alpha(R, W, H, bg or px(R, 3, 3), lo, hi)
    drop_specks(A, W, H, specks)
    if largest: keep_largest(A, W, H)
    b = bbox(A, W, H)
    out(name, b[2]-b[0]+1, b[3]-b[1]+1, rgba_rows(R, A, *b), width)
    return W, H, R, A, b

def rel(box, inner):
    bx0, by0, bx1, by1 = box; ix0, iy0, ix1, iy1 = inner
    BW, BH = bx1-bx0+1, by1-by0+1
    return dict(left=round(100*(ix0-bx0)/BW, 2), top=round(100*(iy0-by0)/BH, 2),
                width=round(100*(ix1-ix0+1)/BW, 2), height=round(100*(iy1-iy0+1)/BH, 2))

# ---- laptop: screen = the large near-black rectangle
W, H, R, A, b = cut(15, 'desk/laptop.png', 1000, 600)
dark = [(x, y) for y in range(b[1], b[3]) for x in range(b[0], b[2]) if lum(px(R, x, y)) < 40 and y < H*0.6]
xs = sorted(p[0] for p in dark); ys = sorted(p[1] for p in dark)
k = len(xs)//200
screen = (xs[k], ys[k], xs[-k-1], ys[-k-1])
meta['_laptop'] = dict(bbox=b, screen=screen, screen_rel=rel(b, screen))

# ---- art wall cluster, movie poster, plushie, phone, coffee
meta['_artwall'] = cut(16, 'art/art-wall.png', 746, 400)[4]
meta['_poster'] = cut(19, 'decor/movie-poster.png', 671, 340)[4]
meta['_plushie'] = cut(24, 'decor/plushie.png', 600, 300)[4]
meta['_phone'] = cut(34, 'desk/phone.png', 700, 380, largest=True)[4]
meta['_coffee'] = cut(25, 'desk/coffee-cup.png', 700, 260, largest=True)[4]

# ---- curtains: one painting of both panels on a rod; split at the gap
W, H, R = work(18, 1000)
A = flood_alpha(R, W, H, px(R, 3, 3), 10, 30); drop_specks(A, W, H, 60)
b = bbox(A, W, H)
cols = [sum(1 for y in range(int(H*0.15), b[3]) if A[y][x] > 128) for x in range(W)]
mid_lo, mid_hi = int(W*0.35), int(W*0.65)
gap_x = min(range(mid_lo, mid_hi), key=lambda x: cols[x])
out('window/curtain-left.png', gap_x-b[0], b[3]-b[1]+1, rgba_rows(R, A, b[0], b[1], gap_x-1, b[3]), 500)
out('window/curtain-right.png', b[2]-gap_x+1, b[3]-b[1]+1, rgba_rows(R, A, gap_x, b[1], b[2], b[3]), 500)
meta['_curtains'] = dict(bbox=b, gap_x=gap_x)

# ---- fairy lights + glow (glow is pre-aligned, screen-blended)
W, H, R = work(21, 1400)
A = flood_alpha(R, W, H, px(R, 3, 3), 10, 28); drop_specks(A, W, H, 30)
out('decor/fairy-lights.png', W, H, rgba_rows(R, A, 0, 0, W-1, H-1))
subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-z', str(H), str(W), f'{I}/32.jpg', '--out', f'{PUB}/decor/fairy-glow.jpg'], check=True, capture_output=True)
meta['decor/fairy-glow.jpg'] = (W, H)

# ---- lamp + glow, cropped to the same box
W, H, R = work(28, 896, 1200)
_, _, G = work(33, 896, 1200)
A = flood_alpha(R, W, H, px(R, 3, 3), 10, 30); drop_specks(A, W, H, 60)
lb = bbox(A, W, H)
box = (max(0, lb[0]-60), max(0, lb[1]-40), min(W-1, lb[2]+60), lb[3])
out('decor/lamp.png', box[2]-box[0]+1, box[3]-box[1]+1, rgba_rows(R, A, *box), 400)
opaque = [bytearray(b'\xff'*W) for _ in range(H)]
save_rgba('glow-crop.png', box[2]-box[0]+1, box[3]-box[1]+1, rgba_rows(G, opaque, *box))
subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '--resampleWidth', '400', 'glow-crop.png', '--out', f'{PUB}/decor/lamp-glow.jpg'], check=True, capture_output=True)
meta['decor/lamp-glow.jpg'] = dims(f'{PUB}/decor/lamp-glow.jpg')
meta['_lamp'] = dict(box=box, lamp_bbox=lb)

# ---- coffee steam (screen-blended, no alpha needed)
subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '--resampleWidth', '300', f'{I}/29.jpg', '--out', f'{PUB}/desk/coffee-steam.jpg'], check=True, capture_output=True)
meta['desk/coffee-steam.jpg'] = dims(f'{PUB}/desk/coffee-steam.jpg')

# ---- easel (painterly version) + canvas overlay
W, H, R, A, b = cut(31, 'art/easel.png', 558, 360)
quad = [(92, 316), (470, 315), (470, 599), (95, 601)]
def inside(x, y, poly):
    c = False
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[(i+1) % len(poly)]
        if (y1 > y) != (y2 > y) and x < (x2-x1)*(y-y1)/(y2-y1)+x1: c = not c
    return c
AC = [bytearray(W) for _ in range(H)]
for y in range(305, 610):
    for x in range(85, 478):
        if inside(x, y, quad): AC[y][x] = A[y][x]
cb = bbox(AC, W, H)
out('art/easel-canvas.png', cb[2]-cb[0]+1, cb[3]-cb[1]+1, rgba_rows(R, AC, *cb), round(360*(cb[2]-cb[0]+1)/(b[2]-b[0]+1)))
meta['_easel'] = dict(bbox=b, canvas=cb, canvas_rel=rel(b, cb))

# ---- journal: base without pen (30) + pen cut from 27
W, H, J0 = work(30, 1000, 558)
_, _, J1 = work(27, 1000, 558)
A0 = flood_alpha(J0, W, H, px(J0, 3, 3), 12, 32); drop_specks(A0, W, H, 60)
jb = bbox(A0, W, H)
out('desk/journal-pages.png', jb[2]-jb[0]+1, jb[3]-jb[1]+1, rgba_rows(J0, A0, *jb), 600)
# pen: dark or gold pixels near the pen's axis (nib ~ (607,368), cap end ~ (826,207) at 1000 wide)
(ax, ay), (bx2, by2) = (600, 372), (830, 204)
def near_axis(x, y, r=20):
    dx, dy = bx2-ax, by2-ay; t = max(0, min(1, ((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)))
    return (x-ax-t*dx)**2 + (y-ay-t*dy)**2 <= r*r
PM = [bytearray(W) for _ in range(H)]
for y in range(190, 390):
    for x in range(585, 845):
        if near_axis(x, y):
            r, g, bb = px(J1, x, y)
            if lum((r, g, bb)) < 85 or (r > 140 and r - bb > 50 and g > 100):
                PM[y][x] = 255
keep_largest(PM, W, H)
pb = bbox(PM, W, H, 0)
out('desk/journal-pen.png', pb[2]-pb[0]+1, pb[3]-pb[1]+1, rgba_rows(J1, PM, *pb), round(600*(pb[2]-pb[0]+1)/(jb[2]-jb[0]+1)))
meta['_journal'] = dict(bbox=jb, pen=pb, pen_rel=rel(jb, pb))

# ---- memory wall: photos only (the source has a desk + UI strip baked into its lower half)
W, H, R = work(23, 1000)
cream = lambda p: p[0] > 150 and p[1] > 138 and p[2] > 105 and p[0] - p[2] < 75
A = [bytearray(b'\xff'*W) for _ in range(H)]
seen = [bytearray(W) for _ in range(H)]
st = [(x, y) for x in range(W) for y in (0, H-1)] + [(x, y) for y in range(H) for x in (0, W-1)]
while st:
    x, y = st.pop()
    if seen[y][x]: continue
    seen[y][x] = 1
    if cream(px(R, x, y)): continue
    A[y][x] = 0
    for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
        if 0 <= nx < W and 0 <= ny < H and not seen[ny][nx]: st.append((nx, ny))
keep_largest(A, W, H)
mb = bbox(A, W, H)
out('decor/memory-wall.png', mb[2]-mb[0]+1, mb[3]-mb[1]+1, rgba_rows(R, A, *mb), 560)
meta['_memory'] = mb

json.dump(meta, open('meta2.json', 'w'), indent=1)
print(json.dumps(meta, indent=1))
