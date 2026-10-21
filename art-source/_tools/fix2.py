import subprocess
from imgtool import *
PUB='/Users/shohjahon/Development/Portfolio website/public/assets/scene'
lum=lambda p:(p[0]*3+p[1]*6+p[2])//10
def inside(x,y,poly):
    c=False
    for i in range(len(poly)):
        (x1,y1),(x2,y2)=poly[i],poly[(i+1)%len(poly)]
        if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1)+x1: c=not c
    return c
# --- memory wall: union of the five photo quads (1000x805 working coords), 4x supersampled edges
W,H,R=load('w23.png')
quads=[[(113,230),(434,162),(479,386),(158,455)],
       [(449,126),(657,158),(644,447),(438,432)],
       [(598,250),(895,296),(862,496),(572,455)],
       [(202,443),(502,369),(553,582),(252,668)],
       [(479,452),(782,488),(754,675),(462,628)]]
A=[bytearray(W) for _ in range(H)]
for y in range(110,690):
    for x in range(100,905):
        n=sum(1 for sy in (0.25,0.75) for sx in (0.25,0.75) if any(inside(x+sx,y+sy,q) for q in quads))
        A[y][x]=n*255//4
b=bbox(A,W,H,0)
save_rgba(f'{PUB}/decor/memory-wall.png',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(R,A,*b))
subprocess.run(['sips','--resampleWidth','560',f'{PUB}/decor/memory-wall.png'],check=True,capture_output=True)
print('memory bbox',b)
# --- journal pen: black body + saturated gold only (parchment is excluded)
W,H,J1=load('w27.png')
(ax,ay),(bx,by)=(600,372),(830,204)
def near(x,y,r=19):
    dx,dy=bx-ax,by-ay;t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)))
    return (x-ax-t*dx)**2+(y-ay-t*dy)**2<=r*r
PM=[bytearray(W) for _ in range(H)]
for y in range(190,390):
    for x in range(585,845):
        if near(x,y):
            r,g,b2=px(J1,x,y)
            if lum((r,g,b2))<80 or (r-b2>95 and r>150): PM[y][x]=255
keep_largest(PM,W,H)
pb=bbox(PM,W,H,0)
save_rgba(f'{PUB}/desk/journal-pen.png',pb[2]-pb[0]+1,pb[3]-pb[1]+1,rgba_rows(J1,PM,*pb))
print('pen bbox',pb)
