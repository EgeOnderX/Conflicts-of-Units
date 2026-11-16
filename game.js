"use strict";
/* ===== GAME: lifecycle ===== */
const Game={
 new(seed,me,edit){const cm=typeof seed=="object"?seed:null,r=cm?MapIO.world(cm,edit):World.build(seed);if(!r){lg("That map file is invalid.");return false}if(r.N[me].dead)me=Math.max(0,r.N.findIndex(n=>!n.dead));G={...r,cm,editor:!!edit,me,diff:DIFF,day:0,U:[],uid:0,kills:0,over:false,war:Array.from({length:NN},()=>new Uint16Array(NN)),rail:new Uint8Array(NC),fort:new Uint8Array(NC),fhp:new Float32Array(NC),cons:[],dock:new Uint8Array(NC),S:[],sid:0};
  G.N.forEach(n=>Sim.initNation(n,r.cnt[n.id]));Sim.stats();G.N.forEach(n=>n.al.inf=Math.ceil(n.fac/2));
  const placed=new Set();(r.units||[]).forEach(([i,k,t])=>{Sim.spawn(k,t,i);if(!edit)placed.add(k)});
  G.N.forEach(n=>{if(edit||n.dead||placed.has(n.id))return;const c=r.cnt[n.id];for(let i=0;i<2+Math.round(c/150);i++)Sim.spawn(n.id,"inf");for(let i=0;i<Math.floor(c/350);i++)Sim.spawn(n.id,"tank")});
  sel=[];GRP={};speed=0;spent=0;dirty=1;if(edit&&!G.cm)G.cm=MapIO.pack();World.paint();$("log").innerHTML="";lg(`${G.cm?"Custom map":"New world (seed "+G.seed+")"}. You lead <b>${G.N[me].name}</b>. Select a division, then drag on the map to draw its route. Press a speed button to start.`);if(edit){ED.nat=G.me;ED.stroke=new Set();ED.step=1;ED.tool="plain";lg("Map editor: pick a tool in the Editor tab, then paint on the map.")}},
 loop(){if(speed&&!G.over&&!G.treaty&&!G.editor){Sim.tick();tickT=performance.now()}if(dirty&&performance.now()-lt>150){Render.refresh();lt=performance.now()}setTimeout(Game.loop,speed?Data.SPD[speed]:100)},
 frame(){Render.draw();requestAnimationFrame(Game.frame)}};
