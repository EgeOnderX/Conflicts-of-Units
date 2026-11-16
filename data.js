"use strict";
/* ===== DATA: all tunable content lives here ===== */
const Data={
 TECH:{inf2:["Infantry Equipment II",60],arm:["Armored Doctrine",80],ind:["Industrial Efficiency",50],doc:["Operational Doctrine",70]},
 FOCUS:{arm:["Rearmament",35,"+4 factories"],mob:["Mobilization",35,"+8000 manpower, +25/day",400],ind:["Industrial Push",50,"+3 factories"]},
 UNIT:{inf:{n:"Infantry",eq:8,man:1000,atk:5,def:7,fc:6},tank:{n:"Armor",eq:5,man:1500,atk:12,def:5,fc:18}},
 TD:[1,1.25,1.6],MC:[1,2,3],TN:["Plains","Forest","Mountains"],SPD:[0,260,130,60,25,8],RAILC:8,FORTC:150,FORTHP:200,FORTT:20,STACK:4,DOCKC:200,DOCKT:15,SHIPC:100,SHIPN:6,
 SYL:["ar","bel","cor","dun","eth","fal","gor","hal","ith","kar","lor","mar","nor","os","pra","qui","ren","sol","tav","ul","vor","zan"],END:["ia","land","mark","stan","ova","ria","nia","dor"],
 CP:["Ash","Bright","Cold","Dawn","Elm","Fair","Gold","High","Iron","Kings","Low","Mill","North","Oak","Port","Red","Stone","Thorn","West","Wolf"],CS:["ford","burg","haven","gate","port","ton","field","watch"],
 DF:[{n:"Passive",s:1e9,p:0,r:9,w:0,pt:0,or:1.5},{n:"Normal",s:240,p:.07,r:1.6,w:2,pt:360,or:1.1},{n:"Aggressive",s:120,p:.15,r:1.2,w:4,pt:0,or:.8}]};
const W=100,H=64,S=14,PW=W*S,PH=H*S,NC=W*H,THR=.62,NN=10,$=id=>document.getElementById(id),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
let G={},SD=1,B,sel=[],GRP={},DIFF=1,RM=false,pan=null,ULT=-1,SH=-1,ED={tool:"plain",brush:2,nat:0,stroke:new Set(),step:1,unitT:"inf",unitN:2},MJ="",spent=0,hov=-1,drag=null,tab=0,speed=0,dirty=1,lt=0,tickT=0,zm=1,down=0,cv,g,HH,PM,LM,CO,base,ov,oid,ID;
const mk=s=>()=>(s=s*16807%2147483647)/2147483647;
const nb=i=>{const x=i%W,y=i/W|0,o=[];if(x>0)o.push(i-1);if(x<W-1)o.push(i+1);if(y>0)o.push(i-W);if(y<H-1)o.push(i+W);return o};
function lg(m){const l=$("log");l.innerHTML=`<div>D${G.day|0}: ${m}</div>`+l.innerHTML}
