import subprocess
from imgtool import *
PUB='/Users/shohjahon/Development/Portfolio website/public/assets/scene'
def cut(src,name,width,lo,hi,ymax=None,largest=False):
    W,H,R=load(src); A=flood_alpha(R,W,H,px(R,3,3),lo,hi); drop_specks(A,W,H,60)
    if ymax:
        for y in range(ymax,H): A[y]=bytearray(W)
    if largest: keep_largest(A,W,H)
    b=bbox(A,W,H); save_rgba(f'{PUB}/{name}',b[2]-b[0]+1,b[3]-b[1]+1,rgba_rows(R,A,*b))
    subprocess.run(['sips','--resampleWidth',str(width),f'{PUB}/{name}'],check=True,capture_output=True); print(name,b)
# saucer bottom: find last row with a wide opaque run above the cord
W,H,R=load('w25.png'); A=flood_alpha(R,W,H,px(R,3,3),10,30)
rows=[sum(1 for x in range(W) if A[y][x]>128) for y in range(H)]
saucer_end=max(y for y in range(H) if rows[y]>W*0.3)
print('saucer bottom row',saucer_end)
cut('w25.png','desk/coffee-cup.png',260,10,30,ymax=saucer_end+6,largest=True)
cut('w16.png','art/art-wall.png',400,24,44)
cut('w19.png','decor/movie-poster.png',340,24,44)
