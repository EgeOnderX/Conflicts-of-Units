"use strict";
/* ===== SAVE: localStorage slots (3 manual + autosave) ===== */
const Save={key:s=>"ironrealms_"+s,
 pack(){return JSON.stringify({v:2,t:Date.now(),seed:G.seed,me:G.me,day:G.day,kills:G.kills,over:G.over,uid:G.uid,diff:G.diff,cm:G.cm||null,N:G.N,own:[...G.own],ctl:[...G.ctl],war:G.war.map(r=>[...r]),rail:[...G.rail],railv:2,dock:[...G.dock],S:G.S,sid:G.sid,fort:[...G.fort],fhp:[...G.fhp].map(x=>Math.round(x)),cons:G.cons,U:G.U.map(u=>({id:u.id,k:u.k,t:u.t,x:u.x,y:u.y,hp:u.hp,org:u.org,path:u.path,mt:u.mt,tot:u.tot,ship:u.ship}))})},
 write(s){try{localStorage.setItem(Save.key(s),Save.pack());return true}catch(e){return false}},
 meta(s){try{const d=JSON.parse(localStorage.getItem(Save.key(s)));return d&&d.v==2?`Day ${d.day} · ${d.N[d.me].name} · ${new Date(d.t).toLocaleString()}`:null}catch(e){return null}},
 read(s){try{const d=JSON.parse(localStorage.getItem(Save.key(s)));if(!d||d.v!=2)return false;if(Game.new(d.cm||d.seed,d.me)===false)return false;
  Object.assign(G,{diff:d.diff==null?1:d.diff,N:d.N,day:d.day,kills:d.kills,over:d.over,uid:d.uid,own:Int8Array.from(d.own),ctl:Int8Array.from(d.ctl),war:d.war.map(r=>Uint16Array.from(r)),rail:d.rail?Uint8Array.from(d.rail):G.rail,fort:d.fort?Uint8Array.from(d.fort):G.fort,fhp:d.fhp?Float32Array.from(d.fhp):G.fhp,cons:d.cons||[],dock:d.dock?Uint8Array.from(d.dock):G.dock,S:d.S||[],sid:d.sid||0,U:d.U});if(d.rail&&!d.railv)for(let i=0;i<NC;i++)if(G.rail[i])G.rail[i]=Math.max(0,G.ctl[i])+1;Sim.stats();dirty=1;UI.fill();lg("Game loaded.");return true}catch(e){return false}}};
