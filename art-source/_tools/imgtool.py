"""Minimal pure-Python PNG IO + keying helpers (no Pillow available)."""
import struct, zlib, subprocess, os

def load(path):
    d = open(path, 'rb').read(); i = 8; idat = b''
    while i < len(d):
        n, t = struct.unpack('>I4s', d[i:i+8]); c = d[i+8:i+8+n]
        if t == b'IHDR': w, h, bd, ct = struct.unpack('>IIBB', c[:10])
        if t == b'IDAT': idat += c
        i += 12 + n
    bpp = {2: 3, 6: 4}[ct]; raw = zlib.decompress(idat); st = w * bpp
    rows = []; prev = bytearray(st); o = 0
    for y in range(h):
        f = raw[o]; o += 1; l = bytearray(raw[o:o+st]); o += st
        if f == 1:
            for x in range(bpp, st): l[x] = (l[x] + l[x-bpp]) & 255
        elif f == 2:
            for x in range(st): l[x] = (l[x] + prev[x]) & 255
        elif f == 3:
            for x in range(st): l[x] = (l[x] + ((l[x-bpp] if x >= bpp else 0) + prev[x]) // 2) & 255
        elif f == 4:
            for x in range(st):
                a = l[x-bpp] if x >= bpp else 0; b = prev[x]; c = prev[x-bpp] if x >= bpp else 0
                pa, pb, pc = abs(b-c), abs(a-c), abs(a+b-2*c)
                l[x] = (l[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(l); prev = l
    # normalize to RGB rows
    if bpp == 4:
        rows = [bytearray(b for x in range(w) for b in r[x*4:x*4+3]) for r in rows]
    return w, h, rows

def save_rgba(path, w, h, rgba_rows):
    raw = b''.join(b'\x00' + bytes(r) for r in rgba_rows)
    def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    open(path, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
                           + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))

def to_png(src, dst, width=None, height=None):
    args = ['sips', '-s', 'format', 'png']
    if width and height: args += ['-z', str(height), str(width)]
    elif width: args += ['--resampleWidth', str(width)]
    subprocess.run(args + [src, '--out', dst], check=True, capture_output=True)
    return load(dst)

def px(rows, x, y): r = rows[y]; return r[x*3], r[x*3+1], r[x*3+2]

def dist(p, q): return max(abs(p[0]-q[0]), abs(p[1]-q[1]), abs(p[2]-q[2]))

def key_alpha(rows, w, h, bg, lo, hi):
    """Alpha from max-channel distance to a flat background color, soft ramp lo..hi."""
    A = []
    for y in range(h):
        a = bytearray(w); r = rows[y]
        for x in range(w):
            d = max(abs(r[x*3]-bg[0]), abs(r[x*3+1]-bg[1]), abs(r[x*3+2]-bg[2]))
            a[x] = 0 if d <= lo else 255 if d >= hi else (d - lo) * 255 // (hi - lo)
        A.append(a)
    return A

def drop_specks(A, w, h, min_area):
    """Zero alpha components smaller than min_area (floating sparkles on the background)."""
    seen = [bytearray(w) for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if A[y][x] and not seen[y][x]:
                comp = []; stack = [(x, y)]; seen[y][x] = 1
                while stack:
                    cx, cy = stack.pop(); comp.append((cx, cy))
                    for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                        if 0 <= nx < w and 0 <= ny < h and A[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = 1; stack.append((nx, ny))
                if len(comp) < min_area:
                    for cx, cy in comp: A[cy][cx] = 0

def bbox(A, w, h, thr=8):
    xs = [x for y in range(h) for x in range(w) if A[y][x] > thr]
    ys = [y for y in range(h) if any(v > thr for v in A[y])]
    return min(xs), min(ys), max(xs), max(ys)

def rgba_rows(rows, A, x0, y0, x1, y1, despill=None):
    out = []
    for y in range(y0, y1 + 1):
        r = rows[y]; a = A[y]; o = bytearray()
        for x in range(x0, x1 + 1):
            R, G, B = r[x*3], r[x*3+1], r[x*3+2]
            if despill == 'green' and a[x] < 255:
                G = min(G, max(R, B))
            o += bytes((R, G, B, a[x]))
        out.append(o)
    return out

def flood_alpha(rows, w, h, bg, lo, hi):
    """Background = region connected to the image border whose color is within `hi` of bg.
    Inside that region alpha ramps lo..hi; everything not reached is fully opaque."""
    A = [bytearray(b'\xff' * w) for _ in range(h)]
    seen = [bytearray(w) for _ in range(h)]
    stack = [(x, y) for x in range(w) for y in (0, h-1)] + [(x, y) for y in range(h) for x in (0, w-1)]
    while stack:
        x, y = stack.pop()
        if seen[y][x]: continue
        seen[y][x] = 1
        r = rows[y]; d = max(abs(r[x*3]-bg[0]), abs(r[x*3+1]-bg[1]), abs(r[x*3+2]-bg[2]))
        if d >= hi: continue
        A[y][x] = 0 if d <= lo else (d - lo) * 255 // (hi - lo)
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx]: stack.append((nx, ny))
    return A

def keep_largest(A, w, h, n=1):
    seen = [bytearray(w) for _ in range(h)]; comps = []
    for y in range(h):
        for x in range(w):
            if A[y][x] and not seen[y][x]:
                comp = []; st = [(x, y)]; seen[y][x] = 1
                while st:
                    cx, cy = st.pop(); comp.append((cx, cy))
                    for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                        if 0 <= nx < w and 0 <= ny < h and A[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = 1; st.append((nx, ny))
                comps.append(comp)
    comps.sort(key=len, reverse=True)
    for comp in comps[n:]:
        for cx, cy in comp: A[cy][cx] = 0
