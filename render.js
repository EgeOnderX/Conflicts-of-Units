"use strict";
/* ===== RENDER ===== */
const Render={
 init(){cv=$("cv");g=cv.getContext("2d");cv.width=PW;cv.height=PH},
 cx:i=>(i%W+.5)*S,cy:i=>((i/W|0)+.5)*S,
 setV(u){const n=u.path[0],x0=(u.x+.5)*S,y0=(u.y+.5)*S;if(u.fgt==G.day){u.vx=x0-(u.fdx||0)*S*.22;u.vy=y0-(u.fdy||0)*S*.22;return}const t=n!=null&&u.mt>=0&&u.tot?Math.min(.85,(u.tot-u.mt)/u.tot):0;u.vx=n!=null?x0+(Render.cx(n)-x0)*t:x0;u.vy=n!=null?y0+(Render.cy(n)-y0)*t:y0},
 setZ(v){zm=cl(v,.3,3);cv.style.width=PW*zm+"px"},
 center(i){const w=$("cvw");w.scrollTo({left:Render.cx(i)*zm-w.clientWidth/2,top:Render.cy(i)*zm-w.clientHeight/2,behavior:"smooth"})},
 refresh(){dirty=0;if(!ov){ov=document.createElement("canvas");ov.width=PW;ov.height=PH;oid=ov.getContext("2d").createImageData(PW,PH);ID=new Uint8Array(PW*PH)}
  const ci=new Uint8Array(NC),d=oid.data;for(let c=0;c<NC;c++)ci[c]=G.ctl[G.NL[c]]+1;
  for(let i=0;i<PW*PH;i++)ID[i]=LM[i]?ci[CO[i]]:0;
  for(let py=0;py<PH-2;py++)for(let px=0;px<PW-2;px++){const i=py*PW+px,id=ID[i],o=i*4;if(!id){d[o+3]=0;continue}
   const c=CO[i],e=ID[i+2],f=ID[i+2*PW];let col=G.N[id-1].rgb,a=115;
   if((e&&e!=id)||(f&&f!=id)){col=[25,25,25];a=200}else if(G.own[G.NL[c]]!=G.ctl[G.NL[c]]&&(px+py)%12<3){col=G.N[G.own[G.NL[c]]].rgb;a=190}
   d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=a}
  ov.getContext("2d").putImageData(oid,0,0)},
 draw(){if(!base||!ov)return;g.drawImage(base,0,0);g.drawImage(ov,0,0);g.textAlign="center";g.lineJoin="round";
  if(hov>=0){g.strokeStyle="#fff9";g.lineWidth=1.5;g.strokeRect(hov%W*S,(hov/W|0)*S,S,S)}if(G.editor)Editor.draw();
  {const PS={};for(let i=0;i<NC;i++){const o=G.rail[i];if(!o)continue;const P=PS[o]||(PS[o]=new Path2D()),x=Render.cx(i),y=Render.cy(i);P.moveTo(x,y);P.lineTo(x+.01,y);if(i%W<W-1&&G.rail[i+1]==o){P.moveTo(x,y);P.lineTo(x+S,y)}if(i<NC-W&&G.rail[i+W]==o){P.moveTo(x,y);P.lineTo(x,y+S)}}
   g.lineCap="round";for(const o in PS){g.lineWidth=4;g.strokeStyle="#2b2420";g.stroke(PS[o]);g.lineWidth=1.6;g.strokeStyle=G.N[o-1]?G.N[o-1].col:"#e8e0c8";g.setLineDash([3,4]);g.stroke(PS[o]);g.setLineDash([])}g.lineCap="butt"}
  G.cities.forEach(ct=>{const x=(ct.i%W+.5)*S,y=((ct.i/W|0)+.5)*S,cap=G.N.some(n=>!n.dead&&n.cap==ct.i),f=G.fort[ct.i]&&G.fhp[ct.i]>0;
   if(f){g.fillStyle="#d8d2c0";g.strokeStyle="#222";g.lineWidth=1.5;g.fillRect(x-7,y-6,14,12);g.strokeRect(x-7,y-6,14,12);for(let t=-7;t<7;t+=5)g.fillRect(x+t,y-9,3,3);g.fillStyle="#2c2";g.fillRect(x-7,y+7,14*G.fhp[ct.i]/Data.FORTHP,2)}
   if(G.dock[ct.i]){g.fillStyle="#2a6db3";g.strokeStyle="#fff";g.lineWidth=1;g.fillRect(x+4,y+2,7,6);g.strokeRect(x+4,y+2,7,6)}if(cap)return;const oc=G.N[G.ctl[ct.i]];g.fillStyle=oc?oc.col:"#ccc";g.strokeStyle="#fff";g.lineWidth=1.5;g.fillRect(x-3.5,y-3.5,7,7);g.strokeRect(x-3.5,y-3.5,7,7)});
  {const T0=G.treaty&&G.treaty.mode=="pick"?G.treaty:G.ultsel;if(T0)T0.gr.forEach((q,gi)=>{g.fillStyle=T0.pick.has(gi)?"rgba(255,210,0,.45)":"rgba(255,255,255,.18)";q.cells.forEach(c=>g.fillRect(c%W*S,(c/W|0)*S,S,S))})}
  const al=speed?Math.min(1,(performance.now()-tickT)/Data.SPD[speed]):1;
  G.U.forEach(u=>{if(u.vx==null){Render.setV(u);u.ox=u.vx;u.oy=u.vy}if(u.ox==null){u.ox=u.vx;u.oy=u.vy}u.px=u.ox+(u.vx-u.ox)*al;u.py=u.oy+(u.vy-u.oy)*al});
  g.setLineDash([6,4]);g.strokeStyle="#ffd400";g.lineWidth=2.5;
  sel.forEach(u=>{if(!u.path.length)return;g.beginPath();g.moveTo(u.px,u.py);u.path.forEach(i=>g.lineTo(Render.cx(i),Render.cy(i)));g.stroke();const e=u.path[u.path.length-1];g.setLineDash([]);g.fillStyle="#ffd400";g.beginPath();g.arc(Render.cx(e),Render.cy(e),4,0,7);g.fill();g.setLineDash([6,4])});
  if(drag&&drag.moved&&drag.box){g.strokeStyle="#7cf";g.lineWidth=2;const a=drag.i,b=drag.cur;g.strokeRect(Math.min(a%W,b%W)*S,Math.min(a/W|0,b/W|0)*S,(Math.abs(a%W-b%W)+1)*S,(Math.abs((a/W|0)-(b/W|0))+1)*S)}
  if(drag&&drag.moved&&!drag.box){g.strokeStyle="#fff";g.beginPath();const n=Input.eff(drag).length;
   if(n>1&&drag.cr){drag.raw.forEach((p,k)=>k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.setLineDash([]);g.fillStyle="#ffd400";Input.fpts(drag.raw,n).forEach(p=>{g.beginPath();g.arc(p[0],p[1],4.5,0,7);g.fill();g.stroke()});g.setLineDash([6,4])}
   else{drag.pts.forEach((i,k)=>k?g.lineTo(Render.cx(i),Render.cy(i)):g.moveTo(Render.cx(i),Render.cy(i)));g.stroke()}}
  g.setLineDash([]);const m={};G.U.forEach(u=>{if(u.ship)return;const q=(u.py/S|0)*W+(u.px/S|0)+"_"+u.k;(m[q]=m[q]||[]).push(u)});
  Render.ships(al);for(const q in m){const L=m[q],u=L[0],w=20,h=12,x=u.px-w/2,y=u.py-h/2,s=L.some(v=>sel.includes(v));
   g.shadowColor="#000a";g.shadowBlur=4;g.fillStyle=G.N[u.k].col;g.fillRect(x,y,w,h);g.shadowBlur=0;g.strokeStyle=s?"#ffd400":"#111";g.lineWidth=s?2.5:1.2;g.strokeRect(x,y,w,h);
   g.strokeStyle="#fff";g.lineWidth=1.2;g.beginPath();if(u.t=="inf"){g.moveTo(x+3,y+2);g.lineTo(x+w-3,y+h-2);g.moveTo(x+w-3,y+2);g.lineTo(x+3,y+h-2)}else g.ellipse(x+w/2,y+h/2,w/2-4,h/2-3,0,0,7);g.stroke();
   g.fillStyle="#2c2";g.fillRect(x,y+h+1,w*Math.max(0,u.hp)/100,2);if(L.length>1){g.fillStyle="#fff";g.strokeStyle="#000";g.lineWidth=2;g.font="bold 10px system-ui";g.strokeText(L.length,x+w+4,y+4);g.fillText(L.length,x+w+4,y+4)}}Render.labels()},
 ships(al){G.S.forEach(s=>{const ox=s.ox==null?s.x:s.ox,oy=s.oy==null?s.y:s.oy,x=(ox+(s.x-ox)*al+.5)*S,y=(oy+(s.y-oy)*al+.5)*S,sl=SH==s.id;
  g.shadowColor="#000a";g.shadowBlur=4;g.fillStyle=G.N[s.k].col;g.beginPath();g.moveTo(x-11,y-3);g.lineTo(x+11,y-3);g.lineTo(x+7,y+5);g.lineTo(x-7,y+5);g.closePath();g.fill();g.shadowBlur=0;g.strokeStyle=sl?"#ffd400":"#111";g.lineWidth=sl?2.5:1.2;g.stroke();
  g.strokeStyle="#fff";g.lineWidth=1.3;g.beginPath();g.moveTo(x,y-3);g.lineTo(x,y-10);g.lineTo(x+6,y-6);g.lineTo(x,y-6);g.stroke();
  if(s.cargo.length){g.fillStyle="#fff";g.strokeStyle="#000";g.lineWidth=2;g.font="bold 10px system-ui";g.textAlign="center";g.strokeText(s.cargo.length,x,y+4);g.fillText(s.cargo.length,x,y+4)}
  if(sl&&s.path.length){g.setLineDash([6,4]);g.strokeStyle="#7cf";g.lineWidth=2;g.beginPath();g.moveTo(x,y);s.path.forEach(i=>g.lineTo(Render.cx(i),Render.cy(i)));g.stroke();g.setLineDash([])}})},
 labels(){g.textAlign="center";g.lineJoin="round";
  if(zm>=.8)G.cities.forEach(ct=>{if(G.N.some(n=>!n.dead&&n.cap==ct.i))return;const x=(ct.i%W+.5)*S,y=((ct.i/W|0)+.5)*S;g.font="9px system-ui";g.fillStyle="#fff";g.strokeStyle="#000";g.lineWidth=2.5;g.strokeText(ct.name,x,y+14);g.fillText(ct.name,x,y+14)});
  G.N.forEach(n=>{if(n.dead||n.on===false||n.cap<0)return;const x=(n.cx+.5)*S,y=(n.cy+.5)*S+5;g.fillStyle="#fff";g.strokeStyle="#000";g.lineWidth=3;g.font="bold 16px system-ui";g.strokeText("★",x,y);g.fillText("★",x,y);g.font="bold 10px system-ui";g.lineWidth=2.5;g.strokeText(n.name,x,y+14);g.fillText(n.name,x,y+14)})}};
