"use strict";
/* ===== AI ===== */
const AI={
 macro(c){Object.keys(Data.TECH).forEach(t=>Sim.startRes(c.id,t));Object.keys(Data.FOCUS).forEach(t=>Sim.startFoc(c.id,t));if(!Sim.deploy(c.id,"inf"))Sim.deploy(c.id,"tank")},
 orders(){G.N.forEach(c=>{if(!c.dead&&c.id!=G.me)AI.plan(c)})},
 go(u,i){const s=u.y*W+u.x;if(u.path.length&&u.path[u.path.length-1]==i)return;const p=s==i?[]:Sim.path(u.k,s,j=>j==i);if(!p)return;const keep=u.path.length&&p.length&&u.path[0]==p[0];u.path=p;if(!keep)u.mt=-1},
 border(k,hs){const o=[];for(let i=0;i<NC;i++)if(G.land[i]&&G.ctl[i]==k&&nb(i).some(j=>G.land[j]&&hs.includes(G.ctl[j])))o.push(i);return o},
 guard(c,gd,hs){if(!gd.length)return;const k=c.id,en=hs||G.N.filter(n=>!n.dead&&Sim.wr(k,n.id)).map(n=>n.id),oth=G.N.filter(n=>!n.dead&&n.id!=k&&!Sim.fa(k,n.id)).map(n=>n.id);
  let bc=AI.border(k,en);if(!bc.length&&!hs)bc=AI.border(k,oth);if(!bc.length){if(hs)lg("No shared border with that nation.");return}
  const an=i=>Math.atan2((i/W|0)-c.cy,i%W-c.cx);bc.sort((a,b)=>an(a)-an(b));const m=gd.length,slots=[];for(let j=0;j<m;j++)slots.push(bc[Math.floor((j+.5)*bc.length/m)]);
  const set=new Set(bc),left=gd.filter(u=>!(set.has(u.y*W+u.x)&&!u.path.length&&Math.random()>.1)),fs=slots.filter(q=>!gd.some(u=>u.y*W+u.x==q&&!u.path.length));
  fs.forEach(q=>{if(!left.length)return;let bi=0,bd=1e9;left.forEach((u,ui)=>{const d=Math.abs(u.x-q%W)+Math.abs(u.y-(q/W|0));if(d<bd){bd=d;bi=ui}});AI.go(left[bi],q);left.splice(bi,1)})},
 plan(c){const k=c.id,mine=i=>G.ctl[i]==k||Sim.fa(k,G.ctl[i]),pos=u=>u.y*W+u.x,us=G.U.filter(u=>u.k==k&&!u.dead);if(!us.length)return;
  const en=G.N.filter(n=>!n.dead&&Sim.wr(k,n.id)).map(n=>n.id),eu=G.U.filter(u=>!u.dead&&en.includes(u.k)),free=[],taken=new Set();
  us.forEach(u=>{if(!u.rest&&(u.hp<40||u.org<30)){u.rest=1;u.path=[];u.mt=-1}else if(u.rest&&u.hp>85&&u.org>75)u.rest=0;
   if(u.rest){if(!u.path.length&&!(G.cityAt[pos(u)]>=0&&mine(pos(u)))){const p=Sim.bfs(k,pos(u),i=>G.cityAt[i]>=0&&mine(i));if(p){u.path=p;u.mt=-1}}}else free.push(u)});
  eu.forEach(e=>{const ei=pos(e);if(!mine(ei)&&!nb(ei).some(mine))return;free.filter(u=>!taken.has(u)).sort((a,b)=>Math.abs(a.x-e.x)+Math.abs(a.y-e.y)-Math.abs(b.x-e.x)-Math.abs(b.y-e.y)).slice(0,2).forEach(u=>{if(Math.abs(u.x-e.x)+Math.abs(u.y-e.y)<=10){AI.go(u,ei);taken.add(u)}})});
  const rest=free.filter(u=>!taken.has(u)),tg=G.cities.filter(ct=>en.includes(G.ctl[ct.i])).map(ct=>({i:ct.i,cap:G.N[G.ctl[ct.i]].cap==ct.i})),ratio=us.length/Math.max(1,eu.length);let off=[],gd=rest;
  if(en.length&&tg.length&&ratio>=Data.DF[G.diff].or&&rest.length>1){const nG=Math.floor(rest.length*.25);gd=rest.slice(0,nG);off=rest.slice(nG);
   if(!c.plan||!tg.some(t=>t.i==c.plan.tgt)){c.plan=null;const ax=off.reduce((a,u)=>a+u.x,0)/off.length,ay=off.reduce((a,u)=>a+u.y,0)/off.length,sc=t=>Math.abs(t.i%W-ax)+Math.abs((t.i/W|0)-ay)-(t.cap?12:0);tg.sort((a,b)=>sc(a)-sc(b));
    for(const t of tg.slice(0,3)){const u0=off[0],p=Sim.bfs(k,pos(u0),i=>i==t.i);if(!p)continue;let st=pos(u0);for(const j of p){if(!mine(j))break;st=j}c.plan={tgt:t.i,stage:st,t0:G.day,ph:0};break}}
   const P=c.plan;if(P){const sx=P.stage%W,sy=P.stage/W|0,near=off.filter(u=>Math.abs(u.x-sx)+Math.abs(u.y-sy)<=4).length;if(P.ph==0&&(near>=Math.ceil(off.length*.6)||G.day-P.t0>16))P.ph=1;off.forEach(u=>AI.go(u,P.ph?P.tgt:P.stage))}else gd=rest}
  else c.plan=null;
  AI.guard(c,gd)},
 aggress(){const D=Data.DF[G.diff];if(G.day<D.s)return;let wars=0;G.war.forEach((r,i)=>r.forEach((x,j)=>{if(x&&j>i)wars++}));if(wars>=D.w)return;
  const adj=G.N.map(()=>new Set()),cnt=k=>G.U.filter(u=>u.k==k).length;
  for(let i=0;i<NC;i++)if(G.land[i])for(const j of nb(i))if(G.land[j]&&G.own[j]!=G.own[i])adj[G.own[i]].add(G.own[j]);
  G.N.forEach(a=>{if(wars>=D.w||a.dead||a.id==G.me||a.vas>=0||G.war[a.id].some(x=>x)||Math.random()>D.p)return;let t=null,tv=1e9;
   [...adj[a.id]].filter(b=>!G.N[b].dead&&!Sim.fa(a.id,b)&&!(b==G.me&&G.day<D.pt)).forEach(b=>{const v=cnt(b);if(v<tv){tv=v;t=b}});if(t!=null&&cnt(a.id)>=tv*D.r+1){Sim.declare(a.id,t);wars++}})},
 peace(){let any=0;G.war.forEach((r,i)=>r.forEach((x,j)=>{if(j<=i||!x||i==G.me||j==G.me||G.day-(x-1)<90||Math.random()>.35)return;G.war[i][j]=G.war[j][i]=0;any=1;lg(`${G.N[i].name} and ${G.N[j].name} signed a white peace.`)}));if(any){Sim.expel();dirty=1}}};
