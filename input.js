"use strict";
/* ===== INPUT: selection, routes, line formations ===== */
const Input={
 cell(e){const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*PW/r.width/S|0,y=(e.clientY-r.top)*PH/r.height/S|0;return x<0||y<0||x>=W||y>=H?-1:y*W+x},
 px(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*PW/r.width,(e.clientY-r.top)*PH/r.height]},
 mine:i=>G.U.filter(u=>u.k==G.me&&u.y*W+u.x==i),
  railPath(pts){const cells=[pts[0]];let last=pts[0];for(const t of pts.slice(1)){if(t==last)continue;const adj=Math.abs(t%W-last%W)+Math.abs((t/W|0)-(last/W|0))==1,seg=adj?[t]:Sim.bfs(G.me,last,j=>j==t);if(!seg)break;cells.push(...seg);last=t}
  const n=Build.rail(G.me,cells);lg(n?`Built ${n} railway cells.`:"No railway built (not enough funds, or not your land).")},
 guard(t){const us=sel.length?sel:G.U.filter(u=>u.k==G.me&&!u.path.length);if(!us.length){lg("No units available to guard.");return}spent=1;sel=us.slice();const c=G.N[G.me];AI.guard({id:G.me,cx:c.cx,cy:c.cy},us,[t]);lg(`${us.length} divisions deployed along the ${G.N[t].name} border.`)},
 order(i){spent=1;let n=0;sel.forEach(u=>{const p=Sim.path(G.me,u.y*W+u.x,j=>j==i);if(p){u.path=p;u.mt=-1;n++}});if(!n)lg("Cannot reach that location.")},
 route(pts){spent=1;let ok=0;sel.forEach(u=>{let last=u.y*W+u.x;const out=[];let a=0;
  for(let q=0;q<pts.length;q++){if(q%5!=4&&q!=pts.length-1)continue;const tg=pts[q],raw=pts.slice(a,q+1);a=q+1;if(tg==last)continue;
   let dseg=[],cur=last,fail=false;for(const c of raw){if(c==cur)continue;const ad=Math.abs(c%W-cur%W)+Math.abs((c/W|0)-(cur/W|0))==1&&Sim.can(G.me,c)?[c]:Sim.path(G.me,cur,j=>j==c);if(!ad){fail=true;break}dseg.push(...ad);cur=c}
   const fast=Sim.path(G.me,last,j=>j==tg);let seg=fail?fast:dseg;if(fast&&!fail&&Sim.pcost(G.me,last,fast)<Sim.pcost(G.me,last,dseg)*.85)seg=fast;if(!seg)break;out.push(...seg);last=tg}
  if(out.length){u.path=out;u.mt=-1;ok++}});if(!ok)lg("The drawn route is not passable.")},
 fpts(P,n){if(!P.length)return[];if(P.length==1)return Array(n).fill(P[0]);const L=[0];for(let k=1;k<P.length;k++)L[k]=L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);const T=L[L.length-1],out=[];
  for(let q=0;q<n;q++){const d=n==1?T/2:T*q/(n-1);let k=1;while(k<P.length-1&&L[k]<d)k++;const a=P[k-1],b=P[k],t=cl((d-L[k-1])/(L[k]-L[k-1]||1),0,1);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}return out},
 eff(d){const m=Input.mine(d.i);return m.length&&!m.every(u=>sel.includes(u))?(d.ad?[...new Set([...sel,...m])]:m):sel},
 form(d){spent=1;const us=sel.slice(),F=Input.fpts(d.raw,us.length);if(!F.length)return;const a=F[0],b=F[F.length-1],dx=b[0]-a[0],dy=b[1]-a[1],pr=u=>((u.x+.5)*S-a[0])*dx+((u.y+.5)*S-a[1])*dy;us.sort((u,v)=>pr(u)-pr(v));let ok=0;const cntc={};
  us.forEach((u,q)=>{let c=(F[q][1]/S|0)*W+(F[q][0]/S|0);if(!G.land[c]||!Sim.can(G.me,c)){let bd=1e9,bc=-1;d.pts.forEach(j=>{if(j>=0&&G.land[j]&&Sim.can(G.me,j)){const dd=(Render.cx(j)-F[q][0])**2+(Render.cy(j)-F[q][1])**2;if(dd<bd){bd=dd;bc=j}}});c=bc}
   if(c<0)return;if((cntc[c]||0)>=Data.STACK){let bd2=1e9,bc2=-1;d.pts.forEach(j=>{if(j>=0&&G.land[j]&&Sim.can(G.me,j)&&(cntc[j]||0)<Data.STACK){const dd=(Render.cx(j)-F[q][0])**2+(Render.cy(j)-F[q][1])**2;if(dd<bd2){bd2=dd;bc2=j}}});if(bc2<0)return;c=bc2}cntc[c]=(cntc[c]||0)+1;const from=u.y*W+u.x,p=c==from?[]:Sim.path(G.me,from,j=>j==c);if(p){u.path=p;u.mt=-1;ok++}});if(!ok)lg("Could not line up along that line.")},
 mass(t){spent=1;let cx=0,cy=0;sel.forEach(u=>{cx+=u.x;cy+=u.y});cx/=sel.length;cy/=sel.length;let best=-1,bd=1e9;const bl=[];
  for(let i=0;i<NC;i++){if(!G.land[i]||!(G.ctl[i]==G.me||Sim.fa(G.me,G.ctl[i]))||G.ctl[i]==t)continue;if(!nb(i).some(j=>G.land[j]&&G.ctl[j]==t))continue;const d=(i%W-cx)**2+((i/W|0)-cy)**2;bl.push([d,i]);if(d<bd){bd=d;best=i}}
  if(best<0){lg("Cannot reach that nation's border.");return}let n=0;bl.sort((a,b)=>a[0]-b[0]);sel.forEach((u,q)=>{const tg=(bl[Math.floor(q/Data.STACK)]||bl[bl.length-1])[1],p=u.y*W+u.x==tg?[]:Sim.path(G.me,u.y*W+u.x,j=>j==tg);if(p){u.path=p;u.mt=-1;n++}});lg(`${n} divisions massing on the ${G.N[t].name} border.`)},
 click(i,add,cr){if(i<0)return;const mine=Input.mine(i),sh=G.S.find(s=>s.k==G.me&&s.y*W+s.x==i);if(sh){SH=sh.id;sel=[];return}if(SH>=0&&!mine.length){const s0=G.S.find(s=>s.id==SH);if(s0){Sim.shipOrder(s0,i);return}SH=-1}
  if(mine.length){SH=-1;spent=0;if(add){const all=mine.every(u=>sel.includes(u));sel=all?sel.filter(u=>!mine.includes(u)):[...new Set([...sel,...mine])]}else sel=mine;return}
  if(!sel.length||!G.land[i]){if(!add)sel=[];return}const t=G.ctl[i];if(cr&&t!=G.me&&!Sim.fa(G.me,t))Input.mass(t);else Input.order(i)},
 down(e){if(e.button==2){cv.setPointerCapture(e.pointerId);const w=$("cvw");pan={x:e.clientX,y:e.clientY,l:w.scrollLeft,t:w.scrollTop};return}if(e.button!=0)return;if(G.editor)return Editor.down(e);cv.setPointerCapture(e.pointerId);const i=Input.cell(e),on=Input.mine(i).length>0,mod=e.shiftKey||e.ctrlKey||e.metaKey;if(RM&&!G.treaty){drag={rail:1,pts:[i],moved:1};return}
  drag={x:e.clientX,y:e.clientY,i,cur:i,pts:[i],raw:[Input.px(e)],moved:0,ad:mod&&!spent,cr:e.ctrlKey||e.metaKey,alt:e.altKey,box:!on&&(e.shiftKey||!sel.length)}},
 move(e){if(pan){const w=$("cvw");w.scrollLeft=pan.l-(e.clientX-pan.x);w.scrollTop=pan.t-(e.clientY-pan.y);return}if(G.editor)return Editor.move(e);const i=Input.cell(e);hov=i;if(!drag)return;if(drag.rail){if(i>=0&&i!=drag.pts[drag.pts.length-1])drag.pts.push(i);return}if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8)drag.moved=1;
  if(drag.moved){const p=Input.px(e),q=drag.raw[drag.raw.length-1];if(Math.hypot(p[0]-q[0],p[1]-q[1])>3)drag.raw.push(p);if(i>=0){drag.cur=i;if(i!=drag.pts[drag.pts.length-1])drag.pts.push(i)}}},
 up(e){if(pan){pan=null;return}if(G.editor)return Editor.up();if(!drag)return;const d=drag;drag=null;if(d.rail){Input.railPath(d.pts.filter(x=>x>=0));UI.render(1);return}if(G.ultsel&&!d.moved&&G.ultsel.grp[d.i]!=null){UI.act("utg",G.ultsel.grp[d.i]);return}if(G.treaty){if(!d.moved&&G.treaty.mode=="pick"&&G.treaty.grp[d.i]!=null)UI.act("tg",G.treaty.grp[d.i]);return}
  if(d.moved&&d.box){if(d.i>=0&&d.cur>=0){const x0=Math.min(d.i%W,d.cur%W),x1=Math.max(d.i%W,d.cur%W),y0=Math.min(d.i/W|0,d.cur/W|0),y1=Math.max(d.i/W|0,d.cur/W|0),m=G.U.filter(u=>u.k==G.me&&u.x>=x0&&u.x<=x1&&u.y>=y0&&u.y<=y1);sel=d.ad?[...new Set([...sel,...m])]:m;spent=0}}
  else if(d.moved){sel=Input.eff(d);if(sel.length){if(sel.length>1&&d.cr)Input.form(d);else Input.route(d.pts.filter(x=>x>=0))}}
  else Input.click(d.i,d.ad,d.cr);UI.render(1)},
 init(){cv.onpointerdown=Input.down;cv.onpointermove=Input.move;cv.onpointerup=Input.up;
  cv.oncontextmenu=e=>e.preventDefault();
  cv.ondblclick=e=>{if(Input.mine(Input.cell(e)).length){sel=G.U.filter(u=>u.k==G.me);spent=0;UI.render(1)}}}};
