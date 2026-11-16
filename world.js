"use strict";
/* ===== NOISE ===== */
const hs=(x,y)=>{const s=Math.sin(x*127.1+y*311.7+SD)*43758.5453;return s-Math.floor(s)};
const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),a=x-i,b=y-j,u=a*a*(3-2*a),v=b*b*(3-2*b);return hs(i,j)*(1-u)*(1-v)+hs(i+1,j)*u*(1-v)+hs(i,j+1)*(1-u)*v+hs(i+1,j+1)*u*v};
const fb=(x,y,o)=>{let a=0,m=1,f=1,t=0;for(let k=0;k<o;k++){a+=vn(x*f+k*7.3,y*f+k*3.1)*m;t+=m;m*=.5;f*=2}return a/t};
const bg=(i,j)=>B[cl(j,0,H-1)*W+cl(i,0,W-1)];
function hgt(gx,gy){const a=gx-.5,b=gy-.5,i=Math.floor(a),j=Math.floor(b),u=a-i,v=b-j;return fb(gx*.08,gy*.08,4)+Math.min(Math.min(gx,gy,W-gx,H-gy)/8,1)*.35+bg(i,j)*(1-u)*(1-v)+bg(i+1,j)*u*(1-v)+bg(i,j+1)*(1-u)*v+bg(i+1,j+1)*u*v}
const mtn=(gx,gy)=>fb(gx*.2+50,gy*.2,3);
/* ===== WORLD: procedural fictional map + nations ===== */
const World={cache:null,
 hsl(h,s,l){const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return[f(0),f(8),f(4)]},
 build(seed){SD=seed*13.37;const R=mk(seed*7919+13);B=new Float32Array(NC);let land,lab;
  for(let pass=0;pass<2;pass++){land=[];for(let i=0;i<NC;i++)land[i]=hgt(i%W+.5,(i/W|0)+.5)>THR;lab=new Int16Array(NC).fill(-1);let c=0,best=0,bs=0;
   for(let i=0;i<NC;i++)if(land[i]&&lab[i]<0){const q=[i];lab[i]=c;for(let h=0;h<q.length;h++)for(const j of nb(q[h]))if(land[j]&&lab[j]<0){lab[j]=c;q.push(j)}if(q.length>bs){bs=q.length;best=c}c++}
   for(let i=0;i<NC;i++)if(land[i]&&lab[i]!=best){B[i]=-1;if(pass)land[i]=false}}
  const ok=i=>{const x=i%W,y=i/W|0;if(x<5||y<5||x>W-6||y>H-6)return false;for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)if(!land[i+b*W+a])return false;return true},cand=[];
  for(let i=0;i<NC;i++)if(ok(i))cand.push(i);if(cand.length<NN*10)return World.build(seed+1);
  const caps=[cand[R()*cand.length|0]],d2=(a,b)=>(a%W-b%W)**2+((a/W|0)-(b/W|0))**2;
  while(caps.length<NN){let bi=-1,bd=-1;for(const i of cand){let m=1e9;for(const c of caps)m=Math.min(m,d2(i,c));if(m>bd){bd=m;bi=i}}caps.push(bi)}
  const names=new Set(),N=caps.map((c,i)=>{let nm;do{nm=Data.SYL[R()*22|0];if(R()<.5)nm+=Data.SYL[R()*22|0];nm+=Data.END[R()*8|0];nm=nm[0].toUpperCase()+nm.slice(1)}while(names.has(nm));names.add(nm);
   const rgb=World.hsl((i*137.5+R()*25)%360,.5+R()*.15,.46);return{id:i,name:nm,rgb,col:`rgb(${rgb})`,cap:c,cx:c%W,cy:c/W|0,w:.7+R()*.9,fa:i,dead:false,by:-1}});
  const own=new Int8Array(NC),cnt=new Array(NN).fill(0),ter=[];
  for(let i=0;i<NC;i++){let bk=0,bd=1e9;N.forEach(n=>{const d=d2(i,n.cap)/n.w;if(d<bd){bd=d;bk=n.id}});own[i]=bk;if(land[i])cnt[bk]++;const m=mtn(i%W+.5,(i/W|0)+.5);ter[i]=m>.63?2:m>.55?1:0}
  caps.forEach(c=>{for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)ter[c+b*W+a]=0});
  const NL=new Int16Array(NC).fill(-1),q=[];for(let i=0;i<NC;i++)if(land[i]){NL[i]=i;q.push(i)}for(let h=0;h<q.length;h++)for(const j of nb(q[h]))if(NL[j]<0){NL[j]=NL[q[h]];q.push(j)}
  const cities=[],cityAt=new Int16Array(NC).fill(-1),used=new Set(),cname=()=>{let t;do{t=Data.CP[R()*20|0]+Data.CS[R()*8|0]}while(used.has(t));used.add(t);return t},addC=(i)=>{cityAt[i]=cities.length;cities.push({i,name:cname()})};
  N.forEach(n=>addC(n.cap));const want=NN+Math.round(land.filter(Boolean).length/75);
  for(let t=0;t<4000&&cities.length<want;t++){const i=R()*NC|0;if(land[i]&&cityAt[i]<0&&!cities.some(c=>d2(c.i,i)<30))addC(i)}
  return{seed,land,ter,own,ctl:Int8Array.from(own),NL,N,cnt,cities,cityAt}},
 bil(f,gx,gy){const a=gx-.5,b=gy-.5,i=Math.floor(a),j=Math.floor(b),u=a-i,v=b-j,q=(x,y)=>f(cl(x,0,W-1)+cl(y,0,H-1)*W);return q(i,j)*(1-u)*(1-v)+q(i+1,j)*u*(1-v)+q(i,j+1)*(1-u)*v+q(i+1,j+1)*u*v},
 ch(gx,gy){return World.bil(k=>G.land[k]?.95:.25,gx,gy)+(fb(gx*.3,gy*.3,2)-.5)*.16},
 ct(gx,gy){return World.bil(k=>[.4,.55,.72][G.ter[k]],gx,gy)+(fb(gx*.5+9,gy*.5,2)-.5)*.1},
 paint(){if(!G.cm&&World.cache===G.seed&&base)return;SD=G.cm?7.7:G.seed*13.37;const N_=PW*PH;HH=new Float32Array(N_);PM=new Float32Array(N_);LM=new Uint8Array(N_);CO=new Uint16Array(N_);
  for(let py=0;py<PH;py++)for(let px=0;px<PW;px++){const i=py*PW+px,gx=(px+.5)/S,gy=(py+.5)/S;HH[i]=G.cm?World.ch(gx,gy):hgt(gx,gy);PM[i]=G.cm?World.ct(gx,gy):mtn(gx,gy);LM[i]=HH[i]>THR?1:0;
   const wx=px+7*Math.sin(py*.045+px*.01),wy=py+7*Math.sin(px*.05);CO[i]=cl(wy/S|0,0,H-1)*W+cl(wx/S|0,0,W-1)}
  const bc=document.createElement("canvas");bc.width=PW;bc.height=PH;const bx=bc.getContext("2d"),im=bx.createImageData(PW,PH),d=im.data;
  for(let i=0;i<N_;i++){const h=HH[i];let r,gg,b;
   if(h>THR){const m=PM[i],f1=cl((m-.47)/.15,0,1),f2=cl((m-.6)/.1,0,1);r=168-64*f1;gg=184-44*f1;b=120-34*f1;r+=(150-r)*f2;gg+=(138-gg)*f2;b+=(120-b)*f2;
    const s=i>PW&&i<N_-PW-1?(HH[i-1]+HH[i-PW]-HH[i+1]-HH[i+PW])*70:0;r+=s;gg+=s;b+=s;if(h<THR+.025){r+=25;gg+=22;b+=10}}
   else{const t=cl((THR-h)*3.5,0,1);r=78-40*t;gg=140-70*t;b=182-70*t}
   d[i*4]=r;d[i*4+1]=gg;d[i*4+2]=b;d[i*4+3]=255}
  bx.putImageData(im,0,0);base=bc;World.cache=G.seed}};
