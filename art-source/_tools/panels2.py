"""Panel art, round 4 (2026-10-16): tall bookcase, spines, decor x4, filmstrip, charm, ticket, gallery wall, desk."""
import os, subprocess, json
from imgtool import *
SRC='/Users/shohjahon/Development/Portfolio website/art-source/07-panels'
PUB='/Users/shohjahon/Development/Portfolio website/public/assets'
OUT=f'{PUB}/panels'
for d in ('library','art','memories','fandom','cinema'): os.makedirs(f'{OUT}/{d}',exist_ok=True)
meta={}
lum=lambda p:(p[0]*3+p[1]*6+p[2])//10
def dims(p):
    r=subprocess.run(['sips','-g','pixelWidth','-g','pixelHeight',p],capture_output=True,text=True).stdout.split(); return int(r[-3]),int(r[-1])
def save(path,W,H,rows,width=None,height=None):
    save_rgba(path,W,H,rows)
    if width and width<W: subprocess.run(['sips','--resampleWidth',str(width),path],check=True,capture_output=True)
    if height and not width: subprocess.run(['sips','--resampleHeight',str(height),path],check=True,capture_output=True)
    meta[path.split('/assets/')[1]]=dims(path)
def dilate(M,W,H,n=1):
    for _ in range(n):
        N=[bytearray(r) for r in M]
        for y in range(1,H-1):
            for x in range(1,W-1):
                if not M[y][x] and (M[y-1][x] or M[y+1][x] or M[y][x-1] or M[y][x+1]): N[y][x]=255
        M=N
    return M
def jpg(src,dst,width,q=80,crop=None):
    s=src
    if crop:
        x,y,w,h=crop; subprocess.run(['sips','-c',str(h),str(w),'--cropOffset',str(y),str(x),src,'--out','tmp_c.jpg'],check=True,capture_output=True); s='tmp_c.jpg'
    subprocess.run(['sips','-s','format','jpeg','-s','formatOptions',str(q),'--resampleWidth',str(width),s,'--out',dst],check=True,capture_output=True)
    meta[dst.split('/assets/')[1]]=dims(dst)

# ---- tall bookcase (crop at the cabinet outline), gallery wall, desk
jpg(f'{SRC}/raw-B1-tall-bookcase.jpg',f'{OUT}/library/bookcase-tall.jpg',1100,82,crop=(110,64,1282,1836))
jpg(f'{SRC}/raw-G1-gallery-wall.jpg',f'{OUT}/art/gallery-wall.jpg',1600,78)
jpg(f'{SRC}/raw-2b-desk-v2.jpg',f'{PUB}/scene/background/desk-surface.jpg',1800,80,crop=(200,100,1600,648))

# ---- five painted spines
W,H,R=to_png(f'{SRC}/raw-B5-book-spines.jpg','tmp_sp.png',width=1000)
bg=px(R,5,5)
F=flood_alpha(R,W,H,bg,10,30); K=key_alpha(R,W,H,bg,8,22)
A=[bytearray(min(a,b) for a,b in zip(F[y],K[y])) for y in range(H)]; drop_specks(A,W,H,60)
rngs=[(70,250),(250,425),(425,590),(590,760),(760,950)]
for i,(x0,x1) in enumerate(rngs,1):
    sub=[bytearray(R[y][x0*3:x1*3]) for y in range(H)]; sa=[bytearray(A[y][x0:x1]) for y in range(H)]
    keep_largest(sa,x1-x0,H); b=bbox(sa,x1-x0,H)
    save(f'{OUT}/library/spine-{i}.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(sub,sa,*b),height=420)

# ---- gallery decor: new clean bust + fig, and the ballerina from the earlier sheet
def cutobj(R,W,H,region,bgpt,lo=10,hi=30,fade=0,ycut=None,chroma=None,dark=0,largest=True):
    x0,y0,x1,y1=region; y1=min(y1,ycut or y1)
    sub=[bytearray(R[y][x0*3:x1*3]) for y in range(y0,y1)]; w,h=x1-x0,y1-y0
    bgc=px(R,*bgpt); F=flood_alpha(sub,w,h,bgc,lo,hi); K=key_alpha(sub,w,h,bgc,max(6,lo-2),hi-6)
    Aa=[bytearray(min(a,b) for a,b in zip(F[y],K[y])) for y in range(h)]
    if chroma:
        for y in range(h):
            for x in range(w):
                c=px(sub,x,y); ch=max(c)-min(c)
                keep=255 if (ch>=chroma[1] or lum(c)<dark) else max(0,min(255,int((ch-chroma[0])*255/max(1,chroma[1]-chroma[0]))))
                if keep<Aa[y][x]: Aa[y][x]=keep
    drop_specks(Aa,w,h,80)
    if largest: keep_largest(Aa,w,h)
    for y in range(h-fade,h):
        f=(h-1-y)/max(1,fade); Aa[y]=bytearray(int(v*f) for v in Aa[y])
    b=bbox(Aa,w,h); return sub,Aa,w,h,b
W,H,R=to_png(f'{SRC}/raw-G3-bust-fig-clean.png','tmp_bf.png',width=1000)
sub,Aa,w,h,b=cutobj(R,W,H,(120,370,400,900),(20,20)); save(f'{OUT}/art/decor-bust.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(sub,Aa,*b),height=360)
sub,Aa,w,h,b=cutobj(R,W,H,(580,100,950,900),(20,20)); save(f'{OUT}/art/decor-fig.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(sub,Aa,*b),height=420)
W,H,R=to_png(f'{SRC}/raw-G3-alt-ballerina-monstera.jpg','tmp_bm.png',width=1000)
sub,Aa,w,h,b=cutobj(R,W,H,(100,300,325,900),(20,20),lo=14,hi=36,fade=36,ycut=775)
save(f'{OUT}/art/decor-ballerina.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(sub,Aa,*b),height=420)

# ---- ticket (flat grey)
W,H,R=to_png(f'{SRC}/raw-C1-ticket.jpg','tmp_tk.png',width=1584)
bg=px(R,40,40); F=flood_alpha(R,W,H,bg,10,26); K=key_alpha(R,W,H,bg,8,18)
A=[bytearray(min(a,b) for a,b in zip(F[y],K[y])) for y in range(H)]; drop_specks(A,W,H,60); keep_largest(A,W,H)
b=bbox(A,W,H); save(f'{OUT}/cinema/ticket.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(R,A,*b),width=700)
meta['_ticket']=dict(bbox=b,aspect=f'{b[2]-b[0]+1} / {b[3]-b[1]+1}')

# ---- filmstrip: silhouette alpha, green frames + sprocket holes transparent
W,H,R=to_png(f'{SRC}/raw-M3-filmstrip-5frames.png','tmp_fs.png',width=1024)
isg=lambda c: c[1]>c[0]+50 and c[1]>c[2]+40 and c[1]>120
bg=px(R,10,10); G=[bytearray(W) for _ in range(H)]
for y in range(H):
    for x in range(W):
        if isg(px(R,x,y)): G[y][x]=255
Fm=flood_alpha(R,W,H,bg,10,26); Km=key_alpha(R,W,H,bg,8,20)
A=[bytearray(min(a,b) for a,b in zip(Fm[y],Km[y])) for y in range(H)]
Gd=dilate(G,W,H,2)
for y in range(H):
    for x in range(W):
        if Gd[y][x]: A[y][x]=0
b=bbox(A,W,H)
save(f'{OUT}/memories/filmstrip.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(R,A,*b))
# frame boxes (percent of the strip) from the green regions
cols=[x for x in range(W) if any(G[y][x] for y in range(H))]
runs=[];s=cols[0];p=cols[0]
for x in cols[1:]:
    if x!=p+1: runs.append((s,p)); s=x
    p=x
runs.append((s,p))
ys=[y for y in range(H) if any(G[y][x] for x in range(W))]
BW,BH=b[2]-b[0]+1,b[3]-b[1]+1
meta['_filmstrip']=dict(aspect=f'{BW} / {BH}',frames=[dict(left=round(100*(a-b[0])/BW,2),width=round(100*(c-a+1)/BW,2)) for a,c in runs],top=round(100*(ys[0]-b[1])/BH,2),height=round(100*(ys[-1]-ys[0]+1)/BH,2))

# ---- acrylic charm: semi-transparent body (alpha from difference to the grey), neon hole -> transparent
W,H,R=to_png(f'{SRC}/raw-F2-acrylic-charm.jpg','tmp_ch.png',width=900)
bg=px(R,20,20); isn=lambda c: c[1]>200 and c[0]<120 and c[2]<120
G=[bytearray(W) for _ in range(H)]
for y in range(H):
    for x in range(W):
        if isn(px(R,x,y)): G[y][x]=255
keep_largest(G,W,H); gb=bbox(G,W,H); Gd=dilate(G,W,H,2)
A=[bytearray(W) for _ in range(H)]
for y in range(H):
    for x in range(W):
        c=px(R,x,y); d=max(abs(c[0]-bg[0]),abs(c[1]-bg[1]),abs(c[2]-bg[2]))
        A[y][x]=min(255,max(0,(d-5)*6))
for y in range(H):
    for x in range(W):
        if Gd[y][x]: A[y][x]=0
b=bbox(A,W,H,12); BW,BH=b[2]-b[0]+1,b[3]-b[1]+1
save(f'{OUT}/fandom/charm.png',BW,BH,rgba_rows(R,A,*b),width=420)
meta['_charm']=dict(aspect=f'{BW} / {BH}',hole=dict(left=round(100*(gb[0]-b[0])/BW,2),top=round(100*(gb[1]-b[1])/BH,2),width=round(100*(gb[2]-gb[0]+1)/BW,2),height=round(100*(gb[3]-gb[1]+1)/BH,2)))

json.dump(meta,open('meta4.json','w'),indent=1); print(json.dumps(meta,indent=1))
