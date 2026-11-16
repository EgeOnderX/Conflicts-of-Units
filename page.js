"use strict";
/* ===== PAGE: navigation between menu, game and editor ===== */
const Page={mode:null,P:{},inited:false,bundle:typeof BUNDLE!="undefined",
 params(){if(Page.bundle)return Page.P;const o={};new URLSearchParams(location.search).forEach((v,k)=>o[k]=v);return o},
 go(mode,p){p=p||{};if(Page.bundle){Page.P=p;Page.show(mode)}else location.href=(mode=="menu"?"index":mode)+".html?"+new URLSearchParams(p)},
 show(mode){const m=$("menu"),a=$("app");speed=0;if(mode=="menu"){a.hidden=true;m.hidden=false;Menu.init()}else{m.hidden=true;a.hidden=false;Page.start(mode)}},
 start(mode){Page.mode=mode;const P=Page.params(),ed=mode=="edit";
  if(!Page.inited){Render.init();Input.init();UI.init()}
  let ok=false;
  if(P.load)ok=Save.read(P.load);
  else if(P.map){const cm=MapIO.get(P.map);if(cm)ok=Game.new(cm,+P.me||0,ed)!==false}
  else if(P.blank)ok=Game.new(MapIO.blank(),0,true)!==false;
  if(!ok)Game.new(Math.max(1,Math.floor(+P.seed))||1000+Math.random()*9000|0,+P.me||0,ed);
  UI.fill();UI.render(1);
  if(!Page.inited){Game.loop();Game.frame();setInterval(()=>{if(!down)UI.render()},400);Page.inited=true}}};
/* ===== MENU: main menu (choose a map, then play or edit) ===== */
const Menu={sel:"rand",slot:1,seed:String(1000+Math.random()*9000|0),txt:"",msg:"",
 esc:t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;"),
 init(){Menu.render();$("menu").onclick=Menu.click;$("menu").oninput=e=>{if(e.target.id=="mseed")Menu.seed=e.target.value;if(e.target.id=="mtxt")Menu.txt=e.target.value}},
 tile(on,a,v,ico,t,sub){return`<div class="tile ${on?"on":""}" data-m="${a}" data-v="${v}"><div class="ti">${ico}</div><div class="tt">${t}</div><div class="ts">${sub}</div></div>`},
 render(){const M=Menu;
  $("menu").innerHTML=`<div class="mbox"><div class="hero"><svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 10l6 16h17l-14 10 5 17-14-10-14 10 5-17L9 26h17z" fill="currentColor"/></svg>
  <h1>Conflicts of Units</h1><p>Grand strategy on procedurally generated worlds. Command divisions, build railways and fortresses, and bring the continent under your flag.</p></div>
  <div class="card"><h3><span class="n">1</span>Choose a map</h3><div class="tiles">`+
  M.tile(M.sel=="rand","sel","rand","🎲","Random world",`Seed <input id="mseed" size="6" value="${M.seed}"> <button data-m="rnd">New</button>`)+
  [1,2,3].map(s=>M.tile(M.sel=="slot"&&M.slot==s,"slot",s,"🗺️","Saved map "+s,MapIO.meta(s)||"empty")).join("")+
  M.tile(M.sel=="text","sel","text","📋","Import text","Paste a map file")+M.tile(M.sel=="blank","sel","blank","⬜","Blank map","Empty plains, you add nations")+`</div>`+
  (M.sel=="text"?`<textarea id="mtxt" rows="3" style="width:100%;margin-top:10px">${M.esc(M.txt)}</textarea>`:"")+`</div>
  <div class="card"><h3><span class="n">2</span>Go</h3><div class="go"><button class="big p" data-m="play">▶ Play game</button><button class="big" data-m="edit">✎ Map editor</button></div><p class="warn">${M.msg}</p></div>
  <div class="card"><h3><span class="n">3</span>Continue a saved game</h3>`+
  [1,2,3,"auto"].map(s=>{const m=Save.meta(s);return`<div class="row"><span>${s=="auto"?"Autosave":"Slot "+s}<br><small>${m||"empty"}</small></span>${m?`<button data-m="load" data-v="${s}">Load</button>`:""}</div>`}).join("")+`</div></div>`},
 target(edit){const M=Menu;M.msg="";
  if(M.sel=="rand")return{seed:Math.max(1,Math.floor(+M.seed)||1000)};
  if(M.sel=="slot"){if(!MapIO.get(M.slot)){M.msg="That map slot is empty.";return null}return{map:M.slot}}
  if(M.sel=="text"){const cm=MapIO.parse(M.txt);if(!cm){M.msg="That is not a valid map.";return null}MapIO.save("cur",cm);return{map:"cur"}}
  if(M.sel=="blank"){if(!edit){M.msg="A blank map is only for the editor.";return null}return{blank:1}}return null},
 click(e){if(/INPUT|TEXTAREA/.test(e.target.tagName))return;const b=e.target.closest("[data-m]");if(!b)return;const a=b.dataset.m,v=b.dataset.v;
  if(a=="sel")Menu.sel=v;if(a=="slot"){Menu.sel="slot";Menu.slot=+v}if(a=="rnd"){Menu.seed=String(1000+Math.random()*9000|0);Menu.sel="rand"}
  if(a=="load"){Page.go("game",{load:v});return}
  if(a=="play"||a=="edit"){const p=Menu.target(a=="edit");if(p){Page.go(a=="edit"?"edit":"game",p);return}}
  Menu.render()}};
