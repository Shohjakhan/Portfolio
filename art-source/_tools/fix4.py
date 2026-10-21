import subprocess
from imgtool import *
PUB='/Users/shohjahon/Development/Portfolio website/public/assets/scene'
I='../images'
def both_keys(R,W,H,lo,hi,tlo,thi):
    bg=px(R,3,3); F=flood_alpha(R,W,H,bg,lo,hi); K=key_alpha(R,W,H,bg,tlo,thi)
    return [bytearray(min(a,b) for a,b in zip(F[y],K[y])) for y in range(H)]
def save(name,R,A,box,width=None):
    save_rgba(f'{PUB}/{name}',box[2]-box[0]+1,box[3]-box[1]+1,rgba_rows(R,A,*box))
    if width: subprocess.run(['sips','--resampleWidth',str(width),f'{PUB}/{name}'],check=True,capture_output=True)
# phone: enclosed background inside the cord loops
W,H,R=load('w34.png'); A=both_keys(R,W,H,10,30,6,18); drop_specks(A,W,H,60); keep_largest(A,W,H)
save('desk/phone.png',R,A,bbox(A,W,H),380); print('phone',bbox(A,W,H))
# easel: enclosed gaps between legs/bars (same bbox as before so the canvas overlay box stays valid)
W,H,R=load('w31.png'); A=both_keys(R,W,H,10,30,6,18); drop_specks(A,W,H,60)
save('art/easel.png',R,A,(92,169,509,824),360)
# fairy string: enclosed grey between the three strands; keep full canvas so the glow stays aligned
W,H,R=load('w21.png'); A=both_keys(R,W,H,10,28,6,16); drop_specks(A,W,H,30)
save('decor/fairy-lights.png',R,A,(0,0,W-1,H-1))
# glows/steam painted on black -> alpha from brightness (un-premultiplied), so no blend mode is needed
def lum_alpha(src,name,w=None,h=None,crop=None):
    W,H,R=to_png(src,'tmp_glow.png',width=w,height=h)
    x0,y0,x1,y1=crop or (0,0,W-1,H-1); rows=[]
    for y in range(y0,y1+1):
        o=bytearray(); r=R[y]
        for x in range(x0,x1+1):
            c=(r[x*3],r[x*3+1],r[x*3+2]); a=max(c)
            if a<6: o+=b'\x00\x00\x00\x00'; continue
            o+=bytes((min(255,c[0]*255//a),min(255,c[1]*255//a),min(255,c[2]*255//a),a))
        rows.append(o)
    save_rgba(f'{PUB}/{name}',x1-x0+1,y1-y0+1,rows); print(name,x1-x0+1,y1-y0+1)
lum_alpha(f'{I}/32.jpg','decor/fairy-glow.png',1400,594)
lum_alpha(f'{I}/33.jpg','decor/lamp-glow.png',896,1200,(113,129,786,1031))
subprocess.run(['sips','--resampleWidth','400',f'{PUB}/decor/lamp-glow.png'],check=True,capture_output=True)
lum_alpha(f'{I}/29.jpg','desk/coffee-steam.png',300)
