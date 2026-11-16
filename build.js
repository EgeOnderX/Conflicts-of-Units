"use strict";
/* ===== BUILD: finance, railways, fortresses ===== */
const Build={
 rail(k,cells){const c=G.N[k];let n=0;for(const i of cells){if(!G.land[i]||G.rail[i]==k+1||G.ctl[i]!=k)continue;if(c.gold<Data.RAILC)break;c.gold-=Data.RAILC;G.rail[i]=k+1;n++}return n},
 connect(k){const c=G.N[k];let n=Build.rail(k,[c.cap]);
  for(let it=0;it<30&&c.gold>=Data.RAILC;it++){const net=new Set([c.cap]),q=[c.cap];for(let h=0;h<q.length;h++)for(const j of nb(q[h]))if(!net.has(j)&&G.rail[j]==k+1&&G.ctl[j]==k){net.add(j);q.push(j)}
   const tg=new Set(G.cities.filter(ct=>G.ctl[ct.i]==k&&!net.has(ct.i)).map(ct=>ct.i));if(!tg.size)break;
   const pv=new Int16Array(NC).fill(-2),qq=[];net.forEach(i=>{pv[i]=-1;qq.push(i)});let best=-1;
   for(let h=0;h<qq.length&&best<0;h++)for(const j of nb(qq[h])){if(pv[j]!==-2||!G.land[j]||G.ctl[j]!=k)continue;pv[j]=qq[h];qq.push(j);if(tg.has(j)){best=j;break}}
   if(best<0)break;const p=[];for(let j=best;pv[j]!==-1;j=pv[j])p.push(j);const b=Build.rail(k,p.reverse());if(!b)break;n+=b}
  return n},
 fort(k,i){const c=G.N[k];if(G.cityAt[i]<0||G.ctl[i]!=k||G.fort[i]||G.cons.some(x=>x.i==i&&x.t!="dock"))return false;if(c.gold<Data.FORTC){if(k==G.me)lg("Not enough funds for a fortress.");return false}c.gold-=Data.FORTC;G.cons.push({k,i,l:Data.FORTT});return true},
 dock(k,i){const c=G.N[k];if(G.cityAt[i]<0||G.ctl[i]!=k||G.dock[i]||!nb(i).some(j=>!G.land[j])||G.cons.some(x=>x.i==i&&x.t=="dock"))return false;if(c.gold<Data.DOCKC){if(k==G.me)lg("Not enough funds for a dock.");return false}c.gold-=Data.DOCKC;G.cons.push({k,i,l:Data.DOCKT,t:"dock"});return true},
 ship(k,i){const c=G.N[k];if(G.dock[i]!=k+1||G.ctl[i]!=k)return false;if(G.S.filter(s=>s.k==k).length>=Data.SHIPN){if(k==G.me)lg("Ship limit reached.");return false}if(c.gold<Data.SHIPC){if(k==G.me)lg("Not enough funds for a ship.");return false}
  const w=nb(i).find(j=>!G.land[j]);if(w==null)return false;c.gold-=Data.SHIPC;G.S.push({id:++G.sid,k,x:w%W,y:w/W|0,path:[],cargo:[],land:-1});return true},
 tick(){G.cons=G.cons.filter(x=>{if(--x.l>0)return true;if(G.U.some(u=>!u.dead&&u.y*W+u.x==x.i&&Sim.wr(x.k,u.k))){x.l=1;return true}if(G.ctl[x.i]==x.k){if(x.t=="dock"){G.dock[x.i]=x.k+1;if(x.k==G.me)lg(`Dock completed in ${G.cities[G.cityAt[x.i]].name}.`)}else{G.fort[x.i]=1;G.fhp[x.i]=Data.FORTHP;if(x.k==G.me)lg(`Fortress completed in ${G.cities[G.cityAt[x.i]].name}.`)}}return false});
  for(let i=0;i<NC;i++){if(!G.fort[i])continue;const o=G.ctl[i];let dmg=0,inv=o==G.me;
   for(const u of G.U){if(u.dead||Math.abs(u.x-i%W)>1||Math.abs(u.y-(i/W|0))>1||!Sim.wr(u.k,o))continue;dmg+=Data.UNIT[u.t].atk*Sim.mod(u)*.4;if(u.k==G.me)inv=true}
   if(dmg>0){G.fhp[i]=Math.max(0,G.fhp[i]-dmg);if(G.fhp[i]<=0){G.fort[i]=0;if(inv)lg(`The fortress of ${G.cities[G.cityAt[i]].name} has fallen!`)}}else if(G.fhp[i]<Data.FORTHP)G.fhp[i]=Math.min(Data.FORTHP,G.fhp[i]+.3)}
  if(G.day%10==0)G.N.forEach(c=>{if(!c.dead&&c.id!=G.me)Build.ai(c)})},
 ai(c){if(c.gold<220)return;const k=c.id,hot=i=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const X=i%W+dx,Y=(i/W|0)+dy;if(X<0||Y<0||X>=W||Y>=H)continue;const j=Y*W+X;if(G.land[j]&&G.ctl[j]!=k&&!Sim.fa(k,G.ctl[j]))return true}return false};
  if(Build.fort(k,c.cap))return;for(const ct of G.cities)if(G.ctl[ct.i]==k&&hot(ct.i)&&Build.fort(k,ct.i))return;Build.connect(k)}};
