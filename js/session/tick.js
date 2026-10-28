function sessionTick(){
  const r=S.room,onPage=page==='fsession'||page==='ssession';
  if(r.phase==='lobby'){
    if(S.countdown!=null){S.countdown--;if(S.countdown<=0){S.countdown=null;startPhase(S.kind==='study'?'work':'focus');return;}}
    const b=document.getElementById('lobbyBanner');if(b&&S.countdown!=null)b.innerHTML=lobbyInner();
    const t=document.getElementById('ringT');if(t)t.textContent=S.countdown!=null?'0:0'+S.countdown:'--:--';
    refreshDesks();return;
  }
  r.remain--;
  const working=isWorking(r);
  if(working){S.elapsed++;const st=myAct();if(st==='typing'||st==='cursor')S.activeSec++;}
  simulatePeers(working);
  if(S.kind==='study'){
    if(S.speaker){S.spkLeft--;if(S.spkLeft<=0){S.speaker=null;refreshDesks();}}
    if(r.phase==='discuss')advanceQueue();
    if(tickN%19===0){const free=S.peers.filter(p=>!p.left&&!S.queue.some(q=>q.name===p.name)&&!(S.speaker&&S.speaker.name===p.name));if(free.length&&S.queue.length<4)S.queue.push({name:free[rand(free.length)].name,q:QUESTIONS[rand(QUESTIONS.length)]});}
    refreshQueue(false);
  }
  if(onPage&&working&&!S.check&&!S.autoChecked&&S.checkAt>30&&r.remain<=S.checkAt&&!modalName){S.autoChecked=true;openModal('checkin');}
  if(r.remain<=0){
    if(working){r.remain=0;if(onPage&&(!S.wrapShown||(!modalName&&tickN%15===0))){S.wrapShown=true;openModal('wrap');}}
    else{startPhase(S.kind==='study'?'work':'focus');return;}
  }
  updateLive();
}
function simulatePeers(working){
  S.peers.forEach((p,i)=>{
    if(p.left)return;
    if(!working){p.idle=0;return;}
    if(Math.random()<.12){const x=Math.random();p.act=x<.5?'typing':x<.82?'cursor':x<.96?'idle':'away';}
    p.idle=(p.act==='idle'||p.act==='away')?p.idle+1:0;
    if(!p.fin&&(p.act==='typing'||p.act==='cursor')&&Math.random()<.025){p.done++;if(p.done>=p.total){p.fin=true;chime();toast(`${p.name} finished their task`);}}
  });
  if(working&&S.leaveSim&&S.elapsed===45){const p=S.peers[2];if(p&&!p.left){p.left=true;S.leaveSim=false;toast(`${p.name} left early`);const h=document.getElementById('headCount');if(h)h.textContent=(S.peers.filter(x=>!x.left).length+1)+' students here';}}
  if(working&&tickN%37===0){const p=S.peers.filter(x=>!x.left)[rand(Math.max(1,S.peers.filter(x=>!x.left).length))];if(p){const r=REACTIONS[rand(4)];floatOn('you',r[0]);toast(`${p.name} sent “${r[1]}”`);}}
}
function updateLive(){
  const r=S.room,len=phaseLen(r)||1;
  const ring=document.getElementById('ring');if(ring)ring.style.setProperty('--p',Math.min(100,(1-r.remain/len)*100));
  const t=document.getElementById('ringT');if(t)t.textContent=fmt(r.remain);
  const now=document.getElementById('myActNow');if(now)now.innerHTML=actLabel(myState(),idleSecs());
  const pc=document.getElementById('myActPct');if(pc)pc.textContent=pct()+'%';
  const pb=document.getElementById('myActBar');if(pb)pb.style.width=pct()+'%';
  const g=document.getElementById('goal');if(g){const h=goalHtml();if(S._goalH!==h){S._goalH=h;g.outerHTML=h;}}
  refreshDesks();
}
