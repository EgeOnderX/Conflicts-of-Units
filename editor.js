"use strict";
/* ===== EDITOR: paint terrain, borders, cities, capitals and start units ===== */
const Editor={TOOLS:[["plain","🟩 Plains"],["sea","🌊 Water"],["forest","🌲 Forest"],["mount","⛰️ Mountains"],["own","✏️ Draw border"],["erase","🧽 Erase"],["city","🏙️ City"],["cap","⭐ Capital"]],
 TC:{plain:"#b5c283",sea:"#2f6f9a",forest:"#4d7a3a",mount:"#8a8272",erase:"#dddddd",city:"#fff",cap:"#ffd400",unit:"#fff",uerase:"#f66"},
 isCap:i=>G.N.some(n=>n.on!==false&&n.cap==i),
 cells(i){const r=ED.brush-1,x=i%W,y=i/W|0,o=[];for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<W&&Y<H&&dx*dx+dy*dy<=r*r+r)o.push(Y*W+X)}return o},
 name(){const u=new Set(G.cities.map(c=>c.name));let t,n=0;do{t=Data.CP[Math.random()*20|0]+Data.CS[Math.random()*8|0]}while(u.has(t)&&++n<50);return t},
 addCity(c){if(!G.land[c]||G.cityAt[c]>=0)return;G.cityAt[c]=G.cities.length;G.cities.push({i:c,name:Editor.name()})},
 rmCity(c){const k=G.cityAt[c];if(k<0||Editor.isCap(c))return;G.cities.splice(k,1);G.cityAt.fill(-1);G.cities.forEach((ct,j)=>G.cityAt[ct.i]=j)},
 unit(i,rm){const k=ED.nat;if(rm){G.U=G.U.filter(u=>u.y*W+u.x!=i);return}
  if(!G.land[i]||G.own[i]!=k){lg("Place units on land owned by the selected nation.");return}
  const have=G.U.filter(u=>u.y*W+u.x==i).length;for(let q=0;q<ED.unitN&&have+q<Data.STACK;q++)Sim.spawn(k,ED.unitT,i)},
 paint(i,first){const t=ED.tool,n=G.N[ED.nat];
  if(["own","cap","unit"].includes(t)&&n.on===false){if(first)lg("Add a nation first.");return}
  if(t=="city"){if(first)G.cityAt[i]>=0?Editor.rmCity(i):Editor.addCity(i);return}
  if(t=="cap"){if(first&&G.land[i]&&!Editor.isCap(i)){G.own[i]=G.ctl[i]=n.id;n.cap=i;n.cx=i%W;n.cy=i/W|0;Editor.addCity(i)}return}
  if(t=="unit"||t=="uerase"){if(first)Editor.unit(i,t=="uerase");return}
  Editor.cells(i).forEach(c=>{
   if(t=="plain"){G.land[c]=true;G.ter[c]=0}
   else if(t=="sea"){if(!Editor.isCap(c)){G.land[c]=false;Editor.rmCity(c);G.U=G.U.filter(u=>u.y*W+u.x!=c)}}
   else if(t=="forest"){G.land[c]=true;G.ter[c]=1}else if(t=="mount"){G.land[c]=true;G.ter[c]=2}
   else if(t=="own"){if(!Editor.isCap(c)&&G.land[c])G.own[c]=G.ctl[c]=ED.nat}
   else if(t=="erase"){if(!Editor.isCap(c))G.own[c]=G.ctl[c]=-1}
   ED.stroke.add(c)})},
 addNation(nm){const n=G.N.find(x=>x.on===false);if(!n){lg("All 10 nation slots are in use.");return}n.on=true;n.name=nm||"Nation "+(n.id+1);n.cap=-1;n.cx=0;n.cy=0;ED.nat=G.me=n.id;lg(`Nation ${n.name} added. Draw its borders, then place its capital.`)},
 delNation(k){const n=G.N[k];if(n.on===false)return;for(let i=0;i<NC;i++)if(G.own[i]==k)G.own[i]=G.ctl[i]=-1;G.U=G.U.filter(u=>u.k!=k);n.on=false;n.name="";n.cap=-1;const f=G.N.find(x=>x.on!==false);ED.nat=G.me=f?f.id:0;dirty=1},
 down(e){cv.setPointerCapture(e.pointerId);const i=Input.cell(e);if(i<0)return;drag={ed:1};ED.stroke=new Set();Editor.paint(i,1)},
 move(e){const i=Input.cell(e);hov=i;if(drag&&drag.ed&&i>=0)Editor.paint(i,0)},
 up(){if(!drag)return;drag=null;if(["plain","sea","forest","mount"].includes(ED.tool))Editor.commit();else{dirty=1;ED.stroke=new Set();UI.render(1)}},
 commit(){G.NL=MapIO.nl(G.land);World.paint();dirty=1;ED.stroke=new Set();UI.render(1)},
 draw(){g.fillStyle=ED.tool=="own"?G.N[ED.nat].col:Editor.TC[ED.tool]||"#fff";g.globalAlpha=.45;ED.stroke.forEach(c=>g.fillRect(c%W*S,(c/W|0)*S,S,S));g.globalAlpha=1;
  if(hov>=0){g.strokeStyle="#fff";g.lineWidth=1.5;(["unit","uerase","city","cap"].includes(ED.tool)?[hov]:Editor.cells(hov)).forEach(c=>g.strokeRect(c%W*S,(c/W|0)*S,S,S))}}};
