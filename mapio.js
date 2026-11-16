"use strict";
/* ===== MAPIO: custom map files ===== */
const MapIO={key:s=>"ironrealms_map_"+s,mem:{},
 pack(){return{v:1,t:Date.now(),land:G.land.map(x=>x?1:0).join(""),ter:G.ter.join(""),own:[...G.own].map(v=>v<0?"x":v).join(""),cities:G.cities.map(c=>[c.i,c.name]),
  N:G.N.map(n=>({name:n.name,rgb:n.rgb,cap:n.cap,on:n.on===false?0:1})),units:G.editor?G.U.filter(u=>!u.dead&&!u.ship).map(u=>[u.y*W+u.x,u.k,u.t]):[]}},
 parse(t){try{const c=typeof t=="string"?JSON.parse(t):t;if(c&&c.v==1&&c.land.length==NC&&c.ter.length==NC&&c.own.length==NC&&c.N&&c.N.length==NN)return c}catch(e){}return null},
 save(s,cm){const o=cm||MapIO.pack();MapIO.mem[s]=o;try{localStorage.setItem(MapIO.key(s),JSON.stringify(o))}catch(e){}return true},
 get(s){try{const c=MapIO.parse(localStorage.getItem(MapIO.key(s)));if(c)return c}catch(e){}return MapIO.parse(MapIO.mem[s])},
 meta(s){const c=MapIO.get(s);return c?`${new Date(c.t).toLocaleString()} · ${c.land.split("1").length-1} land cells`:null},
 blank(){const N=[];for(let i=0;i<NN;i++)N.push({name:"",rgb:World.hsl(i*137.5%360,.55,.46),cap:-1,on:0});return{v:1,t:Date.now(),land:"1".repeat(NC),ter:"0".repeat(NC),own:"x".repeat(NC),cities:[],N,units:[]}},
 nl(land){const NL=new Int16Array(NC).fill(-1),q=[];for(let i=0;i<NC;i++)if(land[i]){NL[i]=i;q.push(i)}for(let h=0;h<q.length;h++)for(const j of nb(q[h]))if(NL[j]<0){NL[j]=NL[q[h]];q.push(j)}return NL},
 world(cm,edit){cm=MapIO.parse(cm);if(!cm)return null;const land=[...cm.land].map(c=>c=="1"),ter=[...cm.ter].map(Number),own=Int8Array.from([...cm.own].map(c=>c=="x"?-1:Number(c))),cities=[],cityAt=new Int16Array(NC).fill(-1),cnt=new Array(NN).fill(0),
  N=cm.N.map((n,i)=>({id:i,name:n.name||"",rgb:n.rgb,col:`rgb(${n.rgb})`,cap:n.cap,cx:n.cap>=0?n.cap%W:0,cy:n.cap>=0?n.cap/W|0:0,w:1,fa:i,dead:false,by:-1,on:n.on!==0}));
  cm.cities.forEach(([i,nm])=>{if(land[i]&&cityAt[i]<0){cityAt[i]=cities.length;cities.push({i,name:nm})}});
  for(let i=0;i<NC;i++){if(own[i]>=0&&!N[own[i]].on)own[i]=-1;if(land[i]&&own[i]>=0)cnt[own[i]]++}
  if(!edit){
   N.forEach(n=>{if(!n.on||!cnt[n.id]){n.dead=true;return}
    if(n.cap<0||!land[n.cap]||own[n.cap]!=n.id){let b=-1;for(const c of cities)if(own[c.i]==n.id){b=c.i;break}if(b<0)for(let i=0;i<NC;i++)if(land[i]&&own[i]==n.id){b=i;break}n.cap=b;n.cx=b%W;n.cy=b/W|0}
    if(cityAt[n.cap]<0){cityAt[n.cap]=cities.length;cities.push({i:n.cap,name:n.name+" City"})}});
   const al=N.filter(n=>!n.dead);if(al.length<2)return null;
   for(let i=0;i<NC;i++)if(own[i]<0||N[own[i]].dead){let b=0,bd=1e9;al.forEach(n=>{const d=(i%W-n.cx)**2+((i/W|0)-n.cy)**2;if(d<bd){bd=d;b=n.id}});own[i]=b}
   cnt.fill(0);for(let i=0;i<NC;i++)if(land[i])cnt[own[i]]++}
  const units=(cm.units||[]).filter(([i,k,t])=>land[i]&&N[k]&&N[k].on&&(edit||(own[i]==k&&!N[k].dead)));
  return{seed:0,land,ter,own,ctl:Int8Array.from(own),NL:MapIO.nl(land),N,cnt,cities,cityAt,units}}};
