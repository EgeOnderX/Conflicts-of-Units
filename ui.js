"use strict";
/* ===== UI: tabbed sidebar, top bar ===== */
const UI={
 TABS:[["Map","🗺️"],["Army","🪖"],["Equipment","🏭"],["Research","🔬"],["Focus","🎯"],["Diplomacy","🤝"],["System","⚙️"],["Treaty","📜"],["Editor","✏️"]],
 fill(){$("cs").innerHTML=G.N.filter(n=>G.editor?n.on!==false:!n.dead).map(n=>`<option value="${n.id}" ${n.id==G.me?"selected":""}>${n.name}</option>`).join("")},
 top(){const c=G.N[G.me];$("dt").textContent=`Year ${1+(G.day/365|0)} · Day ${G.day%365+1}`;$("st").textContent=`Funds ${c.gold|0} (+${c.inc}) · Factories ${c.fac} · Cities ${c.cit} · Land ${c.cells} · Manpower ${c.man|0} · Inf eq ${c.eq.inf|0} · Armor eq ${c.eq.tank|0}`;
  $("sp").innerHTML=[0,1,2,3,4,5].map(i=>`<button data-s="${i}" class="${speed==i?"on":""}">${i?i:"⏸"}</button>`).join("");
  if(G.editor&&tab!=8&&tab!=6)tab=8;if(!G.editor&&tab==8)tab=0;if(tab==7&&!G.treaty)tab=0;if(tab==3)tab=2;if(tab==5)tab=0;const ix=G.editor?[8,6]:[0,1,2,4,6].concat(G.treaty?[7]:[]),th=ix.map((i,p)=>`<button data-t="${i}" class="${i==tab?"on":""}">${UI.TABS[i][1]}<span>${p+1} ${UI.TABS[i][0]}</span></button>`).join(""),tb=$("tabs");UI.ix=ix;if(tb._h!==th){tb.innerHTML=th;tb._h=th}},
 pane(){const c=G.N[G.me],mine=G.U.filter(u=>u.k==G.me);let h="";
  if(tab==0){h+=`<div class="row"><span><span class="sw" style="background:${c.col}"></span><b>${c.name}</b></span><span>${mine.length} divisions</span></div><div class="row"><button data-a="cap">Capital</button><button data-a="all">All units</button><button data-a="idle">Idle units</button></div>`;
   if(hov>=0&&G.land[hov])h+=`<p>Terrain: ${Data.TN[G.ter[hov]]}<br>Owner: ${G.N[G.own[hov]].name}<br>Controller: ${G.N[G.ctl[hov]].name}</p>`;
   h+=sel.length?`<h4>Selected: ${sel.length} <button data-a="stop">Stop</button></h4>`+sel.slice(0,12).map(u=>`<div class="row"><span>${Data.UNIT[u.t].n}</span><span>HP ${u.hp|0}% · Org ${u.org|0}%</span></div>`).join(""):"<p>No units selected.</p>";
   h+=`<p>At war with: ${G.N.filter(n=>Sim.wr(G.me,n.id)).map(n=>n.name).join(", ")||"nobody"}</p><details><summary><b>Controls</b></summary><p>Click a unit to select. Ctrl/Shift+click or drag a box to multi-select; double-click or A selects all. Drag on the map to draw a route; all selected units follow it. Hold Ctrl while dragging to line the units up evenly along the drawn line. Click ground = auto-path. Enemy troops cannot enter a fortress; troops next to one slowly wear it down. Ultimatums (Map tab) can force weaker nations to submit. Right-click and drag pans the map, the mouse wheel zooms. A cell holds at most 4 units. Ctrl+click a foreign nation = mass on its border. S stops, Esc clears, Space pauses, 1–7 switch tabs, I selects idle units, Shift+1–9 saves a control group and Alt+1–9 recalls it (or use the Army tab), Guard in Diplomacy lines your idle units along a border, Peace asks for peace, H centers on your capital. After an order, clicking another unit replaces the old selection. Reaching a nation's capital pauses the game and opens a peace treaty: pick territories to annex, annex everything, or make it a vassal. Undefended enemy land near your troops flips to you automatically. Annex or vassalize 3 nations to win. Army tab: raise divisions (limited by your command limit), Equipment tab: research, railways (R) and fortresses. Funds come from cities (more when troops are inside) and a little from every railway cell. Enemies cannot use your railways. Docks (Equipment tab) let you build landing ships: select a ship, load divisions from the dock city, then click a coastal land cell to land.</p></details>`}
  if(tab==1){h+=UI.prod(c,mine);h+=UI.ships();h+=`<div class="row"><button data-a="all">Select all</button><button data-a="idle">Select idle</button></div><div class="row"><button data-a="seltype" data-v="inf">Infantry</button><button data-a="seltype" data-v="tank">Armor</button><button data-a="seltype" data-v="hurt">Wounded</button></div><div class="row"><span>Groups<br><small>Shift+click saves your selection</small></span><span>${[1,2,3,4,5,6].map(n=>`<button data-a="grp" data-v="${n}">${n}</button>`).join("")}</span></div>`;h+=mine.slice(0,80).map(u=>`<div class="row k ${sel.includes(u)?"s":""}" data-a="unit" data-v="${u.id}"><span>${Data.UNIT[u.t].n}</span><span>HP ${u.hp|0}% · Org ${u.org|0}% · ${u.path.length?"moving":"idle"}</span></div>`).join("")||"<p>No divisions.</p>"}
  if(tab==2){h+=`<p>Funds <b>${c.gold|0}</b> (+${c.inc}/day). ${c.cells} land cells, ${c.cit} cities (${c.gar} garrisoned: troops inside cities earn more).</p><h4>Research</h4>`;
   h+=c.res?`<p>Researching: <b>${Data.TECH[c.res.id][0]}</b> (${c.res.l} days)</p>`:"<p>Idle.</p>";
   for(const t in Data.TECH)h+=`<div class="row"><span>${Data.TECH[t][0]} (${Data.TECH[t][1]}d)</span>${c.tech[t]?"✔":`<button data-a="res" data-v="${t}">Start</button>`}</div>`;
   h+=`<h4>Railways</h4><div class="row"><button data-a="rm" class="${RM?"on":""}">Draw railway: ${RM?"ON":"OFF"}</button><button data-a="conn">Connect cities</button></div><p><small>${Data.RAILC} funds per cell. With railway mode on, drag across your land to build (key R toggles). Troops move up to 3 cells per day along rails.</small></p>`;
   h+=`<h4>Fortresses (${Data.FORTC} funds, ${Data.FORTT} days)</h4>`+G.cities.filter(ct=>G.ctl[ct.i]==G.me).map(ct=>{const f=G.fort[ct.i]&&G.fhp[ct.i]>0,b=G.cons.find(x=>x.i==ct.i);return`<div class="row"><span>${G.N[G.me].cap==ct.i?"★ ":""}${ct.name}</span><span>${f?`Fort ${G.fhp[ct.i]|0}/${Data.FORTHP}`:b?`building ${b.l}d`:`<button data-a="fort" data-v="${ct.i}">Build fort</button>`}</span></div>`}).join("");h+=UI.docks()}
  if(tab==4){h+=c.foc?`<p>Focus: <b>${Data.FOCUS[c.foc.id][0]}</b> (${c.foc.l} days)</p>`:"<p>Idle.</p>";for(const t in Data.FOCUS)h+=`<div class="row"><span>${Data.FOCUS[t][0]} · ${Data.FOCUS[t][2]}${Data.FOCUS[t][3]?` · ${Data.FOCUS[t][3]} funds`:""}</span>${c.done[t]?"✔":`<button data-a="foc" data-v="${t}">Start</button>`}</div>`}
  if(tab==0){h+="<h4>Diplomacy</h4>";const mates=G.N.filter(n=>n.id!=G.me&&!n.dead&&Sim.fa(G.me,n.id));h+=`<p>Alliance: ${mates.length?mates.map(n=>n.name).join(", ")+` <button data-a="leave">Leave</button>`:"none"}</p>`;
   G.N.filter(n=>n.id!=G.me).forEach(n=>{const st=n.dead?"annexed":n.vas==G.me?`vassal <button data-a="annexv" data-v="${n.id}">Annex</button><button data-a="release" data-v="${n.id}">Free</button>`:Sim.wr(G.me,n.id)?`<b>AT WAR</b> <button data-a="peace" data-v="${n.id}">Peace</button>`:Sim.fa(G.me,n.id)?"ally":`<button data-a="war" data-v="${n.id}">War</button><button data-a="ally" data-v="${n.id}">Ally</button>`;
    h+=`<div class="row k" data-a="goto" data-v="${n.id}"><span><span class="sw" style="background:${n.col}"></span>${n.name}</span><span>${st}${n.dead?"":` <button data-a="guard" data-v="${n.id}">Guard</button>${n.vas==G.me||Sim.wr(G.me,n.id)||Sim.fa(G.me,n.id)?"":` <button data-a="ult" data-v="${n.id}">Ultimatum</button>`}`}</span></div>${ULT==n.id?UI.ult(n):""}`})}
  if(tab==6){h+=`<h4>AI aggression</h4><div class="row">`+Data.DF.map((d,i)=>`<button data-a="diff" data-v="${i}" class="${G.diff==i?"on":""}">${d.n}</button>`).join("")+`</div>`;h+=`<h4>New world</h4><div class="row"><input id="seed" size="8" value="${G.seed}"><button data-a="newmap">Generate</button><button data-a="rand">Random</button></div><h4>Save / Load</h4>`+[1,2,3,"auto"].map(s=>`<div class="row"><span>${s=="auto"?"Autosave":"Slot "+s}<br><small>${Save.meta(s)||"empty"}</small></span><span>${s!="auto"?`<button data-a="save" data-v="${s}">Save</button>`:""}<button data-a="load" data-v="${s}">Load</button></span></div>`).join("")}
  if(tab==6)h+=UI.maps();if(tab==8&&G.editor)h+=UI.editor();
  if(tab==7&&G.treaty){const T=G.treaty,X=G.N[T.x];
   if(T.mode=="info")h+=`<h4>Treaty</h4><p>${T.msg}</p><button data-a="tok">Continue</button>`;
   else h+=`<h4>Peace treaty: ${X.name}</h4><p>Click territories here or on the map. Highlighted ones will be annexed.</p>`+T.gr.map((q,i)=>`<div class="row k ${T.pick.has(i)?"s":""}" data-a="tg" data-v="${i}"><span>${q.cap?"★ ":""}${q.name}</span><span>${q.cells.length} cells · ${Math.round(q.occ*100)}% held</span></div>`).join("")+`<div class="row"><button data-a="tsel">Occupied</button><button data-a="tnone">None</button></div><div class="row"><button data-a="tann">Sign: annex selected (${T.pick.size})</button></div><div class="row"><button data-a="tall">Annex ALL</button><button data-a="tvas">Make vassal</button></div>`}
  return h},
 maps(){return`<h4>Maps</h4><div class="row"><button data-a="menu">Main menu</button>${G.editor?"":`<button data-a="medit">Open map editor</button>`}</div>`+[1,2,3].map(s=>`<div class="row"><span>Map ${s}<br><small>${MapIO.meta(s)||"empty"}</small></span><span><button data-a="msave" data-v="${s}">Save map</button><button data-a="mload" data-v="${s}">Load map</button><button data-a="mledit" data-v="${s}">Edit</button></span></div>`).join("")+`<h4>Map file (text)</h4><div class="row"><button data-a="mexp">Export</button><button data-a="mimp">Import</button></div><textarea id="mjson" rows="4" style="width:100%">${MJ.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</textarea>`},
 ult(n){const U=G.ultsel;
  if(U&&U.x==n.id){const ch=Sim.chance(G.me,n.id,"land",U.gr,U.pick);return`<div class="row"><b>Territory demand: ${n.name}</b></div>`+U.gr.map((q,i)=>`<div class="row k ${U.pick.has(i)?"s":""}" data-a="utg" data-v="${i}"><span>${q.cap?"★ ":""}${q.name}</span><span>${q.cells.length} cells</span></div>`).join("")+`<div class="row"><span>Acceptance chance <b>${Math.round(ch*100)}%</b></span><span><button data-a="usend">Send</button><button data-a="ucancel">Cancel</button></span></div>`}
  return`<div class="row"><span>Demand:</span><span><button data-a="udo" data-v="${n.id}:vassal">Vassalage (${Math.round(Sim.chance(G.me,n.id,"vassal")*100)}%)</button><button data-a="uland" data-v="${n.id}">Territory…</button></span></div>`},
 docks(){return`<h4>Docks and landing ships</h4><p><small>Dock ${Data.DOCKC} funds (${Data.DOCKT} days), ship ${Data.SHIPC} funds. Coastal cities only.</small></p>`+(G.cities.filter(ct=>G.ctl[ct.i]==G.me&&nb(ct.i).some(j=>!G.land[j])).map(ct=>{const dk=G.dock[ct.i]==G.me+1,b=G.cons.find(x=>x.i==ct.i&&x.t=="dock");
   return`<div class="row"><span>${ct.name}</span><span>${dk?`<button data-a="ship" data-v="${ct.i}">Build ship</button>`:b?`building ${b.l}d`:`<button data-a="dock" data-v="${ct.i}">Build dock</button>`}</span></div>`}).join("")||"<p><small>You have no coastal cities.</small></p>")},
 ships(){const ss=G.S.filter(s=>s.k==G.me);if(!ss.length)return"";
  return`<h4>Landing ships</h4>`+ss.map(s=>`<div class="row k ${SH==s.id?"s":""}" data-a="ssel" data-v="${s.id}"><span>Ship #${s.id} <small>cargo ${s.cargo.length}/4</small></span><span>${SH==s.id?`<button data-a="sload">Load from dock</button>`:""}</span></div>`).join("")+`<p><small>Select a ship, or click it on the map. Click a sea cell to sail, or a coastal land cell to land troops. Load divisions that stand in a dock city next to the ship.</small></p>`},
 editor(){const used=G.N.filter(n=>n.on!==false),cnt=new Array(NN).fill(0),uc=new Array(NN).fill(0);for(let i=0;i<NC;i++)if(G.land[i]&&G.own[i]>=0)cnt[G.own[i]]++;G.U.forEach(u=>uc[u.k]++);
  const rows=used.map(n=>`<div class="row k ${ED.nat==n.id?"s":""}" data-a="enat" data-v="${n.id}"><span><span class="sw" style="background:${n.col}"></span>${n.name}${n.cap>=0?"":" <small>(no capital)</small>"}</span><span>${ED.step==1?cnt[n.id]+" cells":uc[n.id]+" divisions"}</span></div>`).join("")||"<p><small>No nations yet. Type a name and press Add nation.</small></p>";
  let h=`<h4>Map editor: step ${ED.step} of 2</h4>`;
  if(ED.step==1)h+=`<div class="row" style="flex-wrap:wrap;justify-content:flex-start;gap:4px">`+Editor.TOOLS.map(t=>`<button data-a="etool" data-v="${t[0]}" class="${ED.tool==t[0]?"on":""}">${t[1]}</button>`).join("")+`</div><div class="row"><span>Brush size</span><span>`+[1,2,3,5].map(b=>`<button data-a="ebrush" data-v="${b}" class="${ED.brush==b?"on":""}">${b}</button>`).join("")+`</span></div><h4>Nations</h4>`+rows+
   `<div class="row"><input id="nname" size="12" placeholder="Nation name"><button data-a="eadd">Add nation</button></div><div class="row"><button data-a="ename">Rename selected</button><button data-a="edel">Remove selected</button></div><p><small>Select a nation, pick Draw border and paint its land. Erase makes land neutral (neutral land goes to the nearest nation when you play). City adds or removes a city; Capital moves the selected nation's capital.</small></p><div class="row"><button data-a="enext">Next: start units →</button><button data-a="eexit">Exit</button></div>`;
  else h+=`<div class="row" style="flex-wrap:wrap;justify-content:flex-start;gap:4px"><button data-a="etool" data-v="unit" class="${ED.tool=="unit"?"on":""}">➕ Place units</button><button data-a="etool" data-v="uerase" class="${ED.tool=="uerase"?"on":""}">🧽 Remove units</button></div><div class="row"><span>Unit type</span><span>`+Object.keys(Data.UNIT).map(t=>`<button data-a="eunit" data-v="${t}" class="${ED.unitT==t?"on":""}">${Data.UNIT[t].n}</button>`).join("")+`</span></div><div class="row"><span>Divisions per click</span><span>`+[1,2,3,4].map(n=>`<button data-a="ecount" data-v="${n}" class="${ED.unitN==n?"on":""}">${n}</button>`).join("")+`</span></div><h4>Nations</h4>`+rows+`<p><small>Select a nation, then click land it owns to place divisions (at most 4 per cell). Nations with no placed units get default starting units.</small></p><div class="row"><button data-a="eclear">Clear this nation's units</button></div><div class="row"><button data-a="eback">← Back</button><button data-a="eplay">▶ Play</button></div>`;
  return h+UI.maps()},
 prod(c,dv){const cp=Sim.cap(c),ar=dv.filter(u=>u.t=="tank").length,pl=Sim.plan(G.me);let h=`<p>Divisions <b>${dv.length}/${cp}</b> · Armor <b>${ar}/${Sim.armCap(c)}</b> (limits grow with land and cities)</p>`;
  h+=`<div class="row"><span>Factories ${c.fac}</span><span>Infantry ${c.al.inf} <button data-a="al" data-v="-1">−</button><button data-a="al" data-v="1">+</button> Armor ${c.al.tank}</span></div><div class="row"><button data-a="depall">Raise ALL divisions (${pl.tank+pl.inf})</button></div>`;
  for(const t in Data.UNIT){const u=Data.UNIT[t];h+=`<div class="row"><span>${u.n}<br><small>equipment ${c.eq[t]|0} · ${u.eq} eq + ${u.man} men each</small></span><span><button data-a="dep" data-v="${t}">Raise 1</button><button data-a="depall" data-v="${t}">Raise ALL (${pl.one[t]})</button></span></div>`}
  return h+"<h4>Command</h4>"},
 render(force){UI.top();const p=$("pane");if((tab==6||tab==8)&&!force)return;const sc=p.scrollTop;p.innerHTML=UI.pane();p.scrollTop=sc},
 act(a,v,sh){const c=G.N[G.me];
  if(a=="al"){c.al.inf=cl(c.al.inf+ +v,0,c.fac);c.al.tank=c.fac-c.al.inf}
  if(a=="depall"){let n=0;for(const t of(v?[v]:["tank","inf"]))for(let q=0;q<99&&Sim.deploy(G.me,t,1);q++)n++;lg(n?`Raised ${n} divisions.`:"Could not raise any division (equipment, manpower, command limit or space).")}
  if(a=="rm")RM=!RM;if(a=="ult"){ULT=ULT==+v?-1:+v;G.ultsel=null}
  if(a=="udo"){const q=v.split(":");Sim.ultimatum(G.me,+q[0],q[1]);ULT=-1;G.ultsel=null}
  if(a=="uland"){const o=Sim.groups(+v);o.gr.forEach(q=>q.cap=q.cells.includes(G.N[+v].cap));G.ultsel={x:+v,gr:o.gr,grp:o.grp,pick:new Set()}}
  if(a=="utg"&&G.ultsel){const U=G.ultsel;U.pick.has(+v)?U.pick.delete(+v):U.pick.add(+v)}
  if(a=="ucancel")G.ultsel=null;
  if(a=="usend"&&G.ultsel){const U=G.ultsel,keep=new Set([...U.pick].map(i=>U.gr[i].i));G.ultsel=null;ULT=-1;Sim.ultimatum(G.me,U.x,"land",keep)}
  if(a=="dock"&&Build.dock(G.me,+v))lg("Dock construction started.");
  if(a=="ship"&&Build.ship(G.me,+v))lg("Landing ship built.");
  if(a=="ssel"){SH=+v;sel=[];const s0=G.S.find(x=>x.id==SH);if(s0)Render.center(s0.y*W+s0.x)}
  if(a=="sload"){const s0=G.S.find(x=>x.id==SH);if(s0)Sim.load(s0,sel)}
  if(a=="eadd"){Editor.addNation(($("nname").value||"").trim().slice(0,16));UI.fill()}
  if(a=="edel"){Editor.delNation(ED.nat);UI.fill()}
  if(a=="enext"){ED.step=2;ED.tool="unit"}if(a=="eback"){ED.step=1;ED.tool="own"}
  if(a=="eunit")ED.unitT=v;if(a=="ecount")ED.unitN=+v;if(a=="eclear")G.U=G.U.filter(u=>u.k!=ED.nat);if(a=="conn"){const n=Build.connect(G.me);lg(n?`Built ${n} railway cells.`:"Nothing to connect (or not enough funds).")}if(a=="fort"&&Build.fort(G.me,+v))lg("Fortress construction started.");
  if(a=="dep")Sim.deploy(G.me,v);if(a=="res")Sim.startRes(G.me,v);if(a=="foc")Sim.startFoc(G.me,v);
  if(a=="war")Sim.declare(G.me,+v);if(a=="ally")Sim.ally(G.me,+v);if(a=="leave")Sim.leave(G.me);
  const T=G.treaty;
  if(a=="tg"&&T){T.pick.has(+v)?T.pick.delete(+v):T.pick.add(+v)}
  if(a=="tsel"&&T)T.pick=new Set(T.gr.map((q,i)=>q.cap||q.occ>=.4?i:-1).filter(i=>i>=0));
  if(a=="tnone"&&T)T.pick=new Set();
  if(a=="tann"&&T&&T.mode=="pick"){Sim.applyTreaty(T.x,T.y,T.gr,new Set(T.pick));G.treaty=null;tab=0}
  if(a=="tall"&&T&&T.mode=="pick"){Sim.applyTreaty(T.x,T.y,T.gr,new Set(T.gr.map((q,i)=>i)));G.treaty=null;tab=0}
  if(a=="tvas"&&T&&T.mode=="pick"){Sim.vassalize(T.x,T.y);G.treaty=null;tab=0}
  if(a=="tok"){G.treaty=null;tab=0}
  if(a=="annexv"&&G.N[+v].vas==G.me)Sim.kill(+v,G.me);
  if(a=="release"&&G.N[+v].vas==G.me){G.N[+v].vas=-1;G.N[+v].fa=1000+G.day*20+(+v)}
  if(a=="etool")ED.tool=v;if(a=="ebrush")ED.brush=+v;if(a=="enat")ED.nat=G.me=+v;
  if(a=="ename"){const nm=($("nname").value||"").trim().slice(0,16);if(nm){G.N[ED.nat].name=nm;UI.fill()}}
  if(a=="eplay"){const ok=G.N.filter(n=>n.on!==false&&n.cap>=0&&G.land[n.cap]).length;if(ok<2)lg("Add at least two nations, each with land and a capital, before playing.");else{MapIO.save("cur");Page.go("game",{map:"cur",me:ED.nat})}}
  if(a=="eexit"||a=="menu"){speed=0;Page.go("menu")}
  if(a=="medit"){MapIO.save("cur");speed=0;Page.go("edit",{map:"cur",me:G.me})}
  if(a=="msave")lg(MapIO.save(v)?`Map saved to slot ${v}.`:"Saving failed (browser storage unavailable).");
  if(a=="mload"||a=="mledit"){const cm=MapIO.get(v);if(!cm)lg("No map in that slot.");else if(a=="mledit"&&!G.editor)Page.go("edit",{map:v});else{Game.new(cm,G.editor?ED.nat:0,G.editor);UI.fill()}}
  if(a=="mexp")MJ=JSON.stringify(MapIO.pack());
  if(a=="mimp"){const cm=MapIO.parse(MJ);if(!cm)lg("That is not a valid map.");else{Game.new(cm,G.editor?ED.nat:0,G.editor);UI.fill()}}
  if(a=="peace")Sim.peaceWith(G.me,+v);if(a=="guard")Input.guard(+v);
  if(a=="seltype"){sel=G.U.filter(u=>u.k==G.me&&(v=="hurt"?u.hp<60:u.t==v));spent=0}
  if(a=="diff"){G.diff=DIFF=+v;lg(`AI aggression: ${Data.DF[DIFF].n}`)}
  if(a=="grp"){const n=+v;if(sh){GRP[n]=sel.map(u=>u.id);lg(`Group ${n} saved (${sel.length} divisions).`)}else{const m=(GRP[n]||[]).map(id=>G.U.find(u=>u.id==id)).filter(Boolean);if(m.length){sel=m;spent=0;Render.center(m[0].y*W+m[0].x)}else lg(`Group ${n} is empty. Shift+click it to save your selection.`)}}
  if(a=="stop")sel.forEach(u=>{u.path=[];u.mt=-1});
  if(a=="all"){sel=G.U.filter(u=>u.k==G.me);spent=0}if(a=="idle"){sel=G.U.filter(u=>u.k==G.me&&!u.path.length);spent=0}
  if(a=="cap")Render.center(c.cap);if(a=="goto")Render.center(G.N[+v].cap);
  if(a=="unit"){const u=G.U.find(x=>x.id==+v);if(u){sel=[u];spent=0;Render.center(u.y*W+u.x)}}
  if(a=="newmap"||a=="rand"){const s=a=="rand"?0:Math.floor(+$("seed").value);Game.new(s>0?s:1000+Math.random()*9000|0,0,G.editor);UI.fill()}
  if(a=="save")lg(G.editor?"Use Save map while editing.":Save.write(v)?`Saved to slot ${v}.`:"Saving failed (browser storage unavailable).");
  if(a=="load"&&!Save.read(v))lg("No valid save found.");UI.render(1)},
 init(){
  $("cvw").addEventListener("wheel",e=>{e.preventDefault();const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)/zm,py=(e.clientY-r.top)/zm,z0=zm,w=$("cvw");Render.setZ(zm*(e.deltaY<0?1.12:1/1.12));w.scrollLeft+=px*(zm-z0);w.scrollTop+=py*(zm-z0)},{passive:false});
  $("tabs").onclick=e=>{const b=e.target.closest("[data-t]");if(b){tab=+b.dataset.t;UI.render(1)}};
  $("pane").oninput=e=>{if(e.target.id=="mjson")MJ=e.target.value};$("pane").onclick=e=>{const b=e.target.closest("[data-a]");if(b)UI.act(b.dataset.a,b.dataset.v,e.shiftKey)};
  $("top").onclick=e=>{const b=e.target.closest("[data-s]");if(b&&!G.over&&!G.treaty&&!G.editor){speed=+b.dataset.s;UI.render()}};
  $("cs").onchange=e=>{if(G.editor)ED.nat=G.me=+e.target.value;else Game.new(G.cm||G.seed,+e.target.value);UI.fill();UI.render(1)};
  addEventListener("pointerdown",()=>down=1);addEventListener("pointerup",()=>down=0);
  addEventListener("keydown",e=>{if(G.over||/INPUT|SELECT/.test(e.target.tagName))return;const dg=/^Digit([1-9])$/.exec(e.code);if(dg&&(e.shiftKey||e.altKey)){e.preventDefault();UI.act("grp",dg[1],e.shiftKey);return}const k=e.key.toLowerCase();
   if(e.code=="Space"){e.preventDefault();if(!G.treaty&&!G.editor)speed=speed?0:1}
   else if(k>="1"&&k<="7"&&UI.ix&&UI.ix[+k-1]!=null)tab=UI.ix[+k-1];else if(k=="a"){sel=G.U.filter(u=>u.k==G.me);spent=0}else if(k=="escape"){sel=[];spent=0;SH=-1}
   else if(k=="s")sel.forEach(u=>{u.path=[];u.mt=-1});else if(k=="i"){sel=G.U.filter(u=>u.k==G.me&&!u.path.length);spent=0}else if(k=="h")Render.center(G.N[G.me].cap);else if(k=="r")RM=!RM;UI.render(1)});
  Render.setZ(innerWidth<700?.5:1)}};
