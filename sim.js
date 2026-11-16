"use strict";
/* ===== SIM: rules, economy, combat, diplomacy ===== */
const Sim={
 fa:(a,b)=>G.N[a].fa==G.N[b].fa,wr:(a,b)=>G.war[a][b]>0,
 can:(k,i)=>G.land[i]&&(G.ctl[i]==k||Sim.fa(k,G.ctl[i])||Sim.wr(k,G.ctl[i])),
 mod(u){const t=G.N[u.k].tech;return 1+(t.inf2&&u.t=="inf"?.2:0)+(t.arm&&u.t=="tank"?.3:0)+(t.doc?.15:0)},
 initNation(n,cnt){n.c0=cnt;n.bonus=0;n.vas=-1;n.fac=1;n.al={inf:1,tank:0};n.eq={inf:10,tank:3};n.man=15000;n.gold=300;n.inc=0;n.gar=0;n.tech={};n.res=null;n.foc=null;n.done={}},
 bfs(k,s,goal){const pv=new Int16Array(NC).fill(-2);pv[s]=-1;const q=[s];for(let h=0;h<q.length;h++){const i=q[h];if(i!==s&&goal(i)){const p=[];for(let j=i;j!==s;j=pv[j])p.push(j);return p.reverse()}for(const j of nb(i))if(pv[j]===-2&&Sim.can(k,j)){pv[j]=i;q.push(j)}}return null},
 declare(a,b){const A=G.N.filter(n=>!n.dead&&n.fa==G.N[a].fa),Z=G.N.filter(n=>!n.dead&&n.fa==G.N[b].fa);A.forEach(x=>Z.forEach(y=>{G.war[x.id][y.id]=G.war[y.id][x.id]=G.day+1}));lg(`<b>${G.N[a].name}</b> declared war on ${G.N[b].name}!`)},
 ally(a,b){const A=G.N[a],Z=G.N[b];if(Sim.fa(a,b)||Sim.wr(a,b))return;if(!G.N.some(z=>!z.dead&&Sim.wr(a,z.id)&&Sim.wr(b,z.id))){lg(`${Z.name} declined: you share no common enemy.`);return}
  const old=Z.fa;G.N.forEach(n=>{if(n.fa==old)n.fa=A.fa});lg(`<b>${A.name}</b> and <b>${Z.name}</b> formed an alliance.`)},
 leave(a){G.N[a].fa=1000+G.day*20+a;lg(`${G.N[a].name} left its alliance.`)},
 cap:c=>10+c.cit*3+Math.floor(c.cells/45),armCap:c=>Math.floor(Sim.cap(c)*.4),
 room:(k,i)=>G.U.filter(u=>!u.dead&&u.y*W+u.x==i&&!Sim.wr(k,u.k)).length<Data.STACK,
 spot(k){const c=G.N[k],cnt=i=>G.U.filter(u=>!u.dead&&u.y*W+u.x==i).length,crowd=G.U.filter(u=>u.k==k&&!u.dead&&Math.abs(u.x-c.cx)<=2&&Math.abs(u.y-c.cy)<=2).length>=6,near=[];
  for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const X=c.cx+dx,Y=c.cy+dy,i=Y*W+X;if(X>=0&&Y>=0&&X<W&&Y<H&&G.land[i]&&G.ctl[i]==k&&Sim.room(k,i))near.push(i)}
  let b=-1,bn=9;for(const ct of G.cities){const cx=ct.i%W,cy=ct.i/W|0;if(G.ctl[ct.i]!=k||(Math.abs(cx-c.cx)<=2&&Math.abs(cy-c.cy)<=2))continue;const n=cnt(ct.i);if(n<Data.STACK&&n<bn){bn=n;b=ct.i}}
  if(crowd&&b>=0)return b;if(near.length)return near[Math.random()*near.length|0];return b},
 maxRaise(k,t,eq,man,tot,ar){const c=G.N[k],U=Data.UNIT[t];let room=Sim.cap(c)-tot;if(t=="tank")room=Math.min(room,Sim.armCap(c)-ar);return Math.max(0,Math.min(room,Math.floor(eq/U.eq),Math.floor(man/U.man)))},
 plan(k){const c=G.N[k],cnt=G.U.filter(u=>u.k==k&&!u.dead),ar=cnt.filter(u=>u.t=="tank").length,tk=Sim.maxRaise(k,"tank",c.eq.tank,c.man,cnt.length,ar);
  return{tank:tk,inf:Sim.maxRaise(k,"inf",c.eq.inf,c.man-tk*Data.UNIT.tank.man,cnt.length+tk,ar+tk),one:{tank:tk,inf:Sim.maxRaise(k,"inf",c.eq.inf,c.man,cnt.length,ar)}}},
 spawn(k,t,sp){if(sp==null)sp=Sim.spot(k);if(sp<0)return false;G.U.push({id:++G.uid,k,t,x:sp%W,y:sp/W|0,hp:100,org:100,path:[],mt:-1,tot:0});return true},
 deploy(k,t,q){const c=G.N[k],U=Data.UNIT[t],cnt=G.U.filter(u=>u.k==k&&!u.dead),no=m=>{if(k==G.me&&!q)lg(m);return false};
  if(cnt.length>=Sim.cap(c))return no("Command limit reached. Capture land and cities to raise more divisions.");
  if(t=="tank"&&cnt.filter(u=>u.t=="tank").length>=Sim.armCap(c))return no("Armor limit reached.");
  if(c.eq[t]<U.eq||c.man<U.man)return no("Not enough equipment or manpower.");
  const sp=Sim.spot(k);if(sp<0)return no("No room to deploy: every nearby cell is full.");
  c.eq[t]-=U.eq;c.man-=U.man;return Sim.spawn(k,t,sp)},
  startRes(k,t){const c=G.N[k];if(!c.res&&!c.tech[t])c.res={id:t,l:Data.TECH[t][1]}},
 startFoc(k,t){const c=G.N[k],f=Data.FOCUS[t],cost=f[3]||0;if(c.foc||c.done[t])return;if(c.gold<cost){if(k==G.me)lg(`Not enough funds: ${f[0]} costs ${cost}.`);return}c.gold-=cost;c.foc={id:t,l:f[1]}},
 econ(c){c.al.inf=Math.min(c.al.inf,c.fac);c.al.tank=c.fac-c.al.inf;const b=1+(c.tech.ind?.1:0);c.eq.inf+=c.al.inf*b/Data.UNIT.inf.fc;c.eq.tank+=c.al.tank*b/Data.UNIT.tank.fc;c.man+=20+Math.round(c.cells/10)+c.cit*3+(c.done.mob?25:0);c.gold+=c.inc;
  if(c.res&&--c.res.l<=0){c.tech[c.res.id]=1;if(c.res.id=="ind")c.bonus+=3;if(c.id==G.me)lg(`Research complete: ${Data.TECH[c.res.id][0]}`);c.res=null}
  if(c.foc&&--c.foc.l<=0){const f=c.foc.id;c.done[f]=1;if(f=="arm")c.bonus+=4;if(f=="ind")c.bonus+=3;if(f=="mob")c.man+=8000;if(c.id==G.me)lg(`Focus complete: ${Data.FOCUS[f][0]}`);c.foc=null}},
 at:(k,i)=>G.U.find(u=>!u.dead&&u.y*W+u.x==i&&Sim.wr(k,u.k)),
 retreat(v){for(const j of nb(v.y*W+v.x))if(G.land[j]&&(G.ctl[j]==v.k||Sim.fa(v.k,G.ctl[j]))&&!G.U.some(u=>!u.dead&&u.y*W+u.x==j&&Sim.wr(v.k,u.k))){v.x=j%W;v.y=j/W|0;v.path=[];v.mt=-1;v.org=15;return}v.dead=1},
 fight(a,d){a.fgt=d.fgt=G.day;a.fdx=d.x-a.x;a.fdy=d.y-a.y;d.fdx=a.x-d.x;d.fdy=a.y-d.y;const ua=Data.UNIT[a.t],ud=Data.UNIT[d.t],r=()=>.6+Math.random()*.8,A=ua.atk*Sim.mod(a)*(.5+a.org/200)*r(),D=ud.def*Sim.mod(d)*Data.TD[G.ter[d.y*W+d.x]]*(G.fort[d.y*W+d.x]&&G.fhp[d.y*W+d.x]>0?1.5:1)*(.5+d.org/200)*r();
  d.hp-=A*.5;d.org-=A*.9;a.hp-=D*.3;a.org-=D*.55;[a,d].forEach(v=>{if(v.hp<=0)v.dead=1;else if(v.org<=0)Sim.retreat(v)})},
 stats(){const cells=new Array(NN).fill(0),cit=new Array(NN).fill(0),rl=new Array(NN).fill(0);for(let i=0;i<NC;i++){if(G.rail[i]&&G.rail[i]-1==G.ctl[i])rl[G.ctl[i]]++;if(G.land[i]&&G.ctl[i]>=0){cells[G.ctl[i]]++;if(G.cityAt[i]>=0)cit[G.ctl[i]]++}}
  const occ=new Set(G.U.map(u=>u.y*W+u.x+"_"+u.k)),gar=new Array(NN).fill(0);G.cities.forEach(ct=>{const o=G.ctl[ct.i];if(occ.has(ct.i+"_"+o))gar[o]++});
  G.N.forEach(n=>{n.cells=cells[n.id];n.cit=cit[n.id];n.gar=gar[n.id];n.rl=rl[n.id];n.inc=+(n.cit*1.5+n.gar*3+n.cells/80+rl[n.id]*.08).toFixed(1);if(!n.dead)n.fac=Math.max(1,Math.round(n.cells/90)+n.cit+n.bonus)});
  G.N.forEach(n=>{if(!n.dead&&n.vas>=0&&!G.N[n.vas].dead)G.N[n.vas].fac+=Math.floor(n.fac*.3)})},
 flip(){const E=[];for(const u of G.U){if(u.dead||u.ship)continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const x=u.x+dx,y=u.y+dy;if(x<0||y<0||x>=W||y>=H)continue;const i=y*W+x;if(!G.land[i]||!Sim.wr(u.k,G.ctl[i])||(G.fort[i]&&G.fhp[i]>0))continue;
   if(G.U.some(v=>!v.dead&&!v.ship&&Sim.wr(u.k,v.k)&&Math.abs(v.x-x)<=2&&Math.abs(v.y-y)<=2))continue;E.push([i,u.k])}}
  E.forEach(([i,k])=>{if(Sim.wr(k,G.ctl[i])){G.ctl[i]=k;dirty=1;Sim.capture(i,k)}})},
 capture(i,by){G.N.forEach(c=>{if(!c.dead&&c.id!=by&&c.cap==i&&G.ctl[i]!=c.id)Sim.treaty(c.id,by)})},
 groups(x){const gr=G.cities.filter(c=>G.own[c.i]==x).map(c=>({name:c.name,i:c.i,cells:[],occ:0}));if(!gr.length)gr.push({name:"Remaining lands",i:G.N[x].cap,cells:[],occ:0});const grp={};
  for(let i=0;i<NC;i++)if(G.land[i]&&G.own[i]==x){let b=0,bd=1e9;gr.forEach((q,gi)=>{const d=(i%W-q.i%W)**2+((i/W|0)-(q.i/W|0))**2;if(d<bd){bd=d;b=gi}});gr[b].cells.push(i);grp[i]=b}return{gr,grp}},
 treaty(x,y){const{gr,grp}=Sim.groups(x);gr.forEach(q=>{q.cap=q.cells.includes(G.N[x].cap);q.occ=q.cells.filter(c=>G.ctl[c]==y||Sim.fa(y,G.ctl[c])).length/(q.cells.length||1)});
  const pick=new Set(gr.map((q,i)=>q.cap||q.occ>=.4?i:-1).filter(i=>i>=0));
  if(y==G.me&&!G.treaty){G.treaty={x,y,gr,grp,pick,mode:"pick"};speed=0;tab=7;lg(`<b>${G.N[x].name}</b>'s capital has fallen. Prepare the peace treaty!`);return}
  const tot=gr.reduce((a,q)=>a+q.cells.length,0),took=[...pick].reduce((a,i)=>a+gr[i].cells.length,0),all=pick.size>=gr.length||took>=tot*.75,nm=[...pick].map(i=>gr[i].name).join(", ");
  Sim.applyTreaty(x,y,gr,all?new Set(gr.map((q,i)=>i)):pick);
  if(x==G.me&&!G.treaty){G.treaty={x,y,mode:"info",msg:all?`${G.N[y].name} annexed all of your nation.`:`${G.N[y].name} annexed: ${nm}. Peace was signed.`};speed=0;tab=7}},
 applyTreaty(x,y,gr,pick){const all=pick.size>=gr.length;
  gr.forEach((q,gi)=>q.cells.forEach(c=>{if(pick.has(gi)){G.own[c]=G.ctl[c]=y}else if(G.ctl[c]!=x&&(G.ctl[c]==y||Sim.fa(y,G.ctl[c])))G.ctl[c]=x}));
  G.war[x][y]=G.war[y][x]=0;dirty=1;
  if(all)Sim.kill(x,y);else{if(G.own[G.N[x].cap]!=x)Sim.relocate(x);Sim.expel();lg(`Peace treaty: ${G.N[y].name} annexed ${pick.size} territories of ${G.N[x].name}.`)}
  if(y==G.me&&all){G.kills++;Sim.winCheck()}},
 vassalize(x,y){const X=G.N[x],Y=G.N[y];for(let i=0;i<NC;i++)if(G.land[i]&&G.own[i]==x&&G.ctl[i]!=x&&(G.ctl[i]==y||Sim.fa(y,G.ctl[i])))G.ctl[i]=x;
  G.N.forEach(z=>{if(Sim.fa(y,z.id))G.war[x][z.id]=G.war[z.id][x]=0});X.vas=y;X.fa=Y.fa;dirty=1;Sim.expel();lg(`<b>${X.name}</b> became a vassal of ${Y.name}.`);if(y==G.me){G.kills++;Sim.winCheck()}},
 kill(k,by){const c=G.N[k];c.dead=true;c.by=by;for(let j=0;j<NC;j++){if(G.own[j]==k)G.own[j]=by;if(G.ctl[j]==k)G.ctl[j]=by}G.U.forEach(u=>{if(u.k==k)u.dead=1});G.S=G.S.filter(s=>s.k!=k);dirty=1;lg(`<b>${c.name}</b> was annexed by ${G.N[by].name}.`);Sim.expel();
  if(k==G.me){G.over=true;speed=0;lg("<b>DEFEAT. Your nation no longer exists.</b>")}},
 relocate(x){const c=G.N[x];let b=-1;for(const ct of G.cities)if(G.own[ct.i]==x){b=ct.i;break}if(b<0)for(let i=0;i<NC;i++)if(G.land[i]&&G.own[i]==x){b=i;break}if(b<0){Sim.kill(x,G.ctl[c.cap]);return}c.cap=b;c.cx=b%W;c.cy=b/W|0},
 expel(){G.U.forEach(u=>{const i=u.y*W+u.x;if(u.dead||u.ship||G.ctl[i]==u.k||Sim.fa(u.k,G.ctl[i])||Sim.wr(u.k,G.ctl[i]))return;const pv=new Uint8Array(NC),q=[i];pv[i]=1;let f=-1;
  for(let h=0;h<q.length&&f<0;h++)for(const j of nb(q[h]))if(!pv[j]&&G.land[j]){pv[j]=1;if(G.ctl[j]==u.k||Sim.fa(u.k,G.ctl[j])){f=j;break}q.push(j)}
  if(f>=0){u.x=f%W;u.y=f/W|0}u.path=[];u.mt=-1})},
 str:k=>G.U.filter(u=>u.k==k&&!u.dead).length+G.N[k].cit*.6+G.N[k].fac/12,
 collapse(k){const n=G.N[k],c0=Math.max(1,n.c0||n.cells||1),lost=Math.min(1,Math.max(0,1-n.cells/c0)),en=G.N.filter(x=>!x.dead&&Sim.wr(k,x.id)),es=en.reduce((s,x)=>s+Sim.str(x.id),0),ms=Sim.str(k),press=en.length?es/(es+ms):0,
  capD=G.U.some(u=>!u.dead&&!u.ship&&Sim.wr(k,u.k)&&Math.abs(u.x-n.cx)<=6&&Math.abs(u.y-n.cy)<=6)?.3:0;return Math.min(1,lost*.6+press*.5+capD)},
 chance(a,b,type,gr,pick){const r=Sim.str(a)/Math.max(1,Sim.str(b)),col=Sim.collapse(b);
  if(type=="vassal")return r<.8?0:Math.min(.95,Math.min(1,Math.max(0,(r-1.5)/3))*.3+col*.85);
  if(!pick||!pick.size)return 0;const tot=gr.reduce((s,q)=>s+q.cells.length,0),took=[...pick].reduce((s,i)=>s+gr[i].cells.length,0),frac=took/Math.max(1,tot);
  let p=Math.min(1,Math.max(0,(r-1.5)/3.5))*.6*(1-frac*.8)+col*.5*(1-frac*.5);if([...pick].some(i=>gr[i].cap))p*=.25;return Math.min(.9,p)},
 ultimatum(a,b,type,keep){const Z=G.N[b];G.ult=G.ult||{};const key=a+"-"+b;
  if(Z.dead||Sim.wr(a,b)||Sim.fa(a,b)){lg("An ultimatum is not possible right now.");return}
  if((G.ult[key]||0)>G.day){lg(`${Z.name} will not hear another ultimatum yet.`);return}
  let gr=null,pick=null;if(type=="land"){gr=Sim.groups(b).gr;gr.forEach(q=>q.cap=q.cells.includes(Z.cap));pick=new Set(gr.map((q,i)=>keep&&keep.has(q.i)?i:-1).filter(i=>i>=0));if(!pick.size){lg("Select at least one territory to demand.");return}}
  G.ult[key]=G.day+60;const p=Sim.chance(a,b,type,gr,pick);
  if(Math.random()>=p){lg(`<b>${Z.name}</b> rejected your ultimatum (${Math.round(p*100)}% chance of acceptance).`);return}
  if(type=="vassal"){lg(`<b>${Z.name}</b> accepted your ultimatum and became your vassal.`);Sim.vassalize(b,a);return}
  lg(`<b>${Z.name}</b> accepted your ultimatum and ceded ${[...pick].map(i=>gr[i].name).join(", ")}.`);Sim.applyTreaty(b,a,gr,pick)},
 peaceWith(a,b){const age=G.day-(G.war[a][b]-1),my=G.U.filter(u=>u.k==a).length,th=G.U.filter(u=>u.k==b).length;
  if(age<60||th>my*1.5){lg(`${G.N[b].name} refuses peace${age<60?" (the war is too young)":""}.`);return}
  G.N.forEach(x=>{if(Sim.fa(a,x.id))G.N.forEach(y=>{if(Sim.fa(b,y.id))G.war[x.id][y.id]=G.war[y.id][x.id]=0})});Sim.expel();dirty=1;lg(`Peace signed between ${G.N[a].name} and ${G.N[b].name}.`)},
 winCheck(){if(G.won||G.N[G.me].dead)return;if(G.kills>=3||G.N.every(n=>n.id==G.me||n.dead||n.vas==G.me)){G.won=true;lg("<b>VICTORY! The known world bows to you. You may keep playing.</b>")}},
 sweep(){G.N.forEach(d=>{if(!d.dead)return;let t=d.by;while(t>=0&&G.N[t].dead)t=G.N[t].by;if(t<0)return;for(let i=0;i<NC;i++){if(G.own[i]==d.id){G.own[i]=t;dirty=1}if(G.ctl[i]==d.id){G.ctl[i]=t;dirty=1}}})},
 rail2:(k,i)=>{const o=G.rail[i]-1;return o>=0&&(o==k||Sim.fa(k,o))&&(G.ctl[i]==k||Sim.fa(k,G.ctl[i]))},
 rail:(u,i)=>Sim.rail2(u.k,i),
 pcost(k,s,p){let c=0,prev=s;for(const i of p){c+=Sim.rail2(k,prev)&&Sim.rail2(k,i)?.34:Data.MC[G.ter[i]];prev=i}return c},
 path(k,s,goal){const d=new Float64Array(NC).fill(1e9),pv=new Int16Array(NC).fill(-2),hp=[];
  const push=(c,i)=>{hp.push([c,i]);let x=hp.length-1;while(x>0){const p=x-1>>1;if(hp[p][0]<=hp[x][0])break;[hp[p],hp[x]]=[hp[x],hp[p]];x=p}},
   pop=()=>{const t=hp[0],l=hp.pop();if(hp.length){hp[0]=l;let x=0;for(;;){const a=2*x+1,b=a+1;let m=x;if(a<hp.length&&hp[a][0]<hp[m][0])m=a;if(b<hp.length&&hp[b][0]<hp[m][0])m=b;if(m==x)break;[hp[m],hp[x]]=[hp[x],hp[m]];x=m}}return t};
  d[s]=0;pv[s]=-1;push(0,s);
  while(hp.length){const[c,i]=pop();if(c>d[i])continue;if(i!==s&&goal(i)){const p=[];for(let j=i;j!==s;j=pv[j])p.push(j);return p.reverse()}
   const rl=Sim.rail2(k,i);for(const j of nb(i)){if(!Sim.can(k,j))continue;const nc=c+(rl&&Sim.rail2(k,j)?.34:Data.MC[G.ter[j]])+.01;if(nc<d[j]){d[j]=nc;pv[j]=i;push(nc,j)}}}
  return null},
 load(s,pref){const D=nb(s.y*W+s.x).filter(j=>G.land[j]&&G.dock[j]==s.k+1);if(!D.length){lg("The ship must be next to one of your docks.");return}let n=0;
  const go=pf=>{for(const d of D){const us=G.U.filter(u=>!u.dead&&!u.ship&&u.k==s.k&&u.y*W+u.x==d&&(!pf||pf.includes(u)));for(const u of us){if(s.cargo.length>=4)return;u.ship=s.id;u.x=s.x;u.y=s.y;u.path=[];u.mt=-1;s.cargo.push(u.id);n++}}};
  go(pref&&pref.length?pref:null);if(!n)go(null);sel=sel.filter(u=>!u.ship);lg(n?`Loaded ${n} divisions.`:"No divisions of yours are in the adjacent dock city.")},
 shipOrder(s,i){let goal,land=-1;if(G.land[i]){land=i;goal=j=>!G.land[j]&&nb(j).includes(i)}else goal=j=>j==i;
  const here=s.y*W+s.x;if(goal(here)){s.path=[];s.land=land;if(land>=0)Sim.unload(s);return}
  const pv=new Int16Array(NC).fill(-2),q=[here];pv[here]=-1;let hit=-1;for(let h=0;h<q.length&&hit<0;h++)for(const j of nb(q[h])){if(pv[j]!==-2||G.land[j])continue;pv[j]=q[h];if(goal(j)){hit=j;break}q.push(j)}
  if(hit<0){lg("The ship cannot reach that place by sea.");return}const p=[];for(let j=hit;j!==here;j=pv[j])p.push(j);s.path=p.reverse();s.land=land},
 shipStep(s){for(let m=0;m<2&&s.path.length;m++){const n=s.path.shift();s.x=n%W;s.y=n/W|0}s.cargo.forEach(id=>{const u=G.U.find(x=>x.id==id);if(u){u.x=s.x;u.y=s.y}});if(!s.path.length&&s.land>=0)Sim.unload(s)},
 unload(s){const T=s.land;s.land=-1;if(T<0||!s.cargo.length)return;const k=s.k;
  if(!Sim.can(k,T)){lg("Your troops cannot land there (you are not at war with that nation).");return}
  if(Sim.at(k,T)||(G.fort[T]&&G.fhp[T]>0&&Sim.wr(k,G.ctl[T]))){lg("The beach is defended: landing failed.");return}
  const us=s.cargo.map(id=>G.U.find(u=>u.id==id)).filter(Boolean);if(G.U.filter(u=>!u.dead&&!u.ship&&u.y*W+u.x==T&&!Sim.wr(k,u.k)).length+us.length>Data.STACK){lg("Not enough room on that beach.");return}
  us.forEach(u=>{u.ship=null;u.x=T%W;u.y=T/W|0;u.path=[];u.mt=-1});s.cargo=[];if(G.ctl[T]!=k&&Sim.wr(k,G.ctl[T])){G.ctl[T]=k;dirty=1;Sim.capture(T,k)}lg(`Landed ${us.length} divisions.`)},
 fortHold(u,m){if(!(G.fort[m]&&G.fhp[m]>0&&Sim.wr(u.k,G.ctl[m])))return false;u.fgt=G.day;u.fdx=m%W-u.x;u.fdy=(m/W|0)-u.y;return true},
 step(u){if(u.ship)return;const p=u.path;if(!p.length){u.hp=Math.min(100,u.hp+.4);u.org=Math.min(100,u.org+2);return}
  const n=p[0],rl=Sim.rail(u,u.y*W+u.x)&&Sim.rail(u,n);if(u.mt<0)u.mt=u.tot=rl?1:Data.MC[G.ter[n]];if(u.mt>0){u.mt--;if(u.mt>0)return}
  for(let s=0;s<(rl?3:1)&&u.path.length;s++){const m=u.path[0],e=Sim.at(u.k,m);if(e){Sim.fight(u,e);return}if(!Sim.can(u.k,m)){u.path=[];u.mt=-1;return}
   if(Sim.fortHold(u,m))return;if(!Sim.room(u.k,m)){u.fgt=G.day;u.fdx=0;u.fdy=0;u.wait=(u.wait||0)+1;if(u.wait>8){u.path=[];u.mt=-1;u.wait=0}return}
   if(G.ctl[m]!=u.k&&Sim.wr(u.k,G.ctl[m])){G.ctl[m]=u.k;dirty=1;Sim.capture(m,u.k)}
   u.x=m%W;u.y=m/W|0;u.path.shift();u.mt=-1;u.wait=0;u.org=Math.min(100,u.org+.3);
   if(!(u.path.length&&Sim.rail(u,m)&&Sim.rail(u,u.path[0])))break}},
 tick(){G.U.forEach(u=>{u.ox=u.vx;u.oy=u.vy});G.S.forEach(s=>{s.ox=s.x;s.oy=s.y});G.day++;
  if(G.day==420&&G.diff==2&&!G.war.some(r=>r.some(x=>x))){const o=G.N.filter(n=>n.id!=G.me&&!n.dead&&!Sim.fa(n.id,G.me));if(o.length)Sim.declare(o[Math.random()*o.length|0].id,G.me)}
  if(G.day%40==0)AI.aggress();if(G.day%20==0)AI.peace();
  Sim.stats();G.N.forEach(c=>{if(c.dead)return;Sim.econ(c);if(c.id!=G.me)AI.macro(c)});Build.tick();
  G.U.forEach(Sim.step);G.S.forEach(Sim.shipStep);Sim.flip();if(G.day%2==0)AI.orders();if(G.day%5==0)Sim.sweep();if(G.day%90==0)Save.write("auto");
  G.U=G.U.filter(u=>!u.dead);sel=sel.filter(u=>!u.dead);G.U.forEach(Render.setV)}};
