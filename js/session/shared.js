/* ---------- shared session pieces ---------- */
function peerState(p){
  const r=S.room;
  if(p.left)return 'left';
  if(r.phase==='lobby')return p.ready?'ready':'notready';
  if(r.phase==='break')return 'break';
  if(S.speaker&&S.speaker.name===p.name)return 'speaking';
  if(r.phase==='discuss')return 'listening';
  return p.act;
}
function myState(){
  const r=S.room;
  if(r.phase==='lobby')return S.ready?'ready':'notready';
  if(r.phase==='break')return 'break';
  if(S.speaker&&S.speaker.name==='You')return 'speaking';
  if(r.phase==='discuss')return 'listening';
  return myAct();
}
function actLabel(st,idle){return {typing:'<span class="dots"><i></i><i></i><i></i></span> Typing',cursor:ic('cursor')+' Using cursor',idle:`Idle ${fmt(idle)}`,away:'Away',left:'Left early',break:ic('coffee')+' On break',speaking:ic('mic')+' Speaking',listening:'In discussion',ready:ic('check')+' Ready',notready:'Getting ready'}[st];}
function deskInner(p,you){
  const st=you?myState():peerState(p);
  const idle=you?idleSecs():p.idle;
  const done=you?S.done:p.done,total=you?S.total:p.total,fin=you?S.done>=S.total:p.fin;
  const name=you?'You':p.name;
  const isHost=S.kind==='study'&&S.host===name;
  let vis=you?myAvatar():`<span class="avatar ${p.color}">${p.ini}</span>`;
  if(you&&S.camOn)vis=`<span class="cam"><svg viewBox="0 0 50 46" aria-hidden="true"><circle cx="25" cy="17" r="10" fill="#6d82a6"/><path d="M5 46 Q25 22 45 46 Z" fill="#6d82a6"/></svg></span>`;
  const badge=fin&&st!=='left'?'<span class="badge-ic">'+ic('check')+'</span>':st==='speaking'?'<span class="badge-ic" style="color:var(--blue)">'+ic('mic')+'</span>':'';
  return `<div class="av-wrap a-${st}">${vis}${badge}</div>
   <div class="dname">${esc(name)} ${isHost?'<span class="host-tag">HOST</span>':''}</div>
   <span class="act act-${fin&&['typing','cursor'].includes(st)?'done':st}">${fin&&['typing','cursor'].includes(st)?ic('check')+' Task done':actLabel(st,idle)}</span>
   ${st==='speaking'?'<div class="wave-sm"><span></span><span></span><span></span><span></span><span></span></div>':''}
   <div class="dtask">${esc(you?S.task:p.task)}</div>
   <div class="pbar"><div class="bar"><div style="width:${Math.round(done/total*100)}%"></div></div><span>${done}/${total}</span></div>`;
}
function desksHtml(){
  return S.peers.map((p,i)=>`<div class="desk ${p.left?'left':'clickable'}" id="desk-${i}" ${p.left?'':`onclick="openReact(${i})" onkeydown="if(event.key==='Enter')openReact(${i})" role="button" tabindex="0" aria-label="Send a reaction to ${esc(p.name)}"`}><div class="dinner">${deskInner(p,false)}</div><div class="floats"></div></div>`).join('')
   +`<div class="desk you" id="desk-you"><div class="dinner">${deskInner(null,true)}</div><div class="floats"></div></div>`;
}
function refreshDesks(){
  S.peers.forEach((p,i)=>{const el=document.querySelector(`#desk-${i} .dinner`);if(!el)return;const h=deskInner(p,false);if(el._h!==h){el._h=h;el.innerHTML=h;const d=el.parentElement;d.classList.toggle('left',p.left);if(p.left){d.classList.remove('clickable');d.removeAttribute('onclick');}}});
  const y=document.querySelector('#desk-you .dinner');if(y){const h=deskInner(null,true);if(y._h!==h){y._h=h;y.innerHTML=h;}}
}
function goalCount(){const all=S.peers.length+1;const done=S.peers.filter(p=>p.fin).length+(S.done>=S.total?1:0);return [done,all];}
function goalHtml(){const [d,a]=goalCount();return `<div class="goal" id="goal"><span class="label" style="font-size:11px;font-weight:850;color:var(--muted);text-transform:uppercase;letter-spacing:.8px">Room goal ${tier('should')}</span><b>${d} of ${a} tasks done</b><div class="gbar"><div style="width:${d/a*100}%"></div></div></div>`;}
function ringHtml(r,id){const len=phaseLen(r)||1;const p=r.phase==='lobby'?0:Math.min(100,(1-r.remain/len)*100);return `<div class="ring ${r.phase==='break'?'break':r.phase==='discuss'?'discuss':''}" id="${id}" style="--p:${p}"><div><div><div class="t" id="${id}T">${r.phase==='lobby'?(S.countdown!=null?'0:0'+S.countdown:'--:--'):fmt(r.remain)}</div><small id="${id}L">${phaseName(r)}</small></div></div></div>`;}
function trackPill(){const on=trackingOn();return `<button class="track-pill ${on?'':'paused'}" id="trackPill" onclick="openModal('privacy')"><span class="pulse"></span><span id="trackPillT">${on?'Activity tracking on':'Tracking paused'}</span> ${tier('must')}</button>`;}
function myTaskPanel(){
  return `<div class="p-title">Your task ${tier('must')} <span style="font-weight:600;font-size:11px;color:var(--muted)">visible to the room</span></div>
  <div style="font-weight:850;font-size:15px;margin-bottom:10px;overflow-wrap:anywhere">${esc(S.task)}</div>
  <div class="stepper"><button onclick="step(-1)" aria-label="Undo one part">${ic('minus')}</button><span class="count" id="myCount">${S.done}<small>/${S.total} parts</small></span><button onclick="step(1)" aria-label="Mark one more part done">${ic('plus')}</button>${S.done<S.total?btn('Mark task done','step(99)','btn-light btn-sm'):'<span class="act act-done">'+ic('check')+' Done</span>'}</div>
  ${S.check?`<div class="checkline" style="margin-top:10px">Check-in · ${esc(S.check.status)}${S.check.note?` · “${esc(S.check.note)}”`:''} ${tier('should')}</div>`:''}
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${btn('Check in',"openModal('checkin')",'btn-outline btn-sm')}</div>`;
}
function myActPanel(){
  return `<div class="p-title">Your activity ${tier('must')}</div><div class="my-act">
  <div class="row"><span>Right now</span><span id="myActNow">${actLabel(myState(),idleSecs())}</span></div>
  <div class="row"><span>Active this sprint</span><strong id="myActPct">${pct()}%</strong></div>
  <div class="bar" style="margin:0;max-width:none"><div id="myActBar" style="width:${pct()}%"></div></div>
  <div class="foot-note">The room sees Typing, Using cursor, Idle, or Away. Only you see this percentage. Idle starts after ${IDLE_AFTER}s and Away after ${AWAY_AFTER}s in this demo (1 and 5 minutes in the real app).</div>
  <button class="btn btn-light btn-sm" style="justify-self:start" onclick="openModal('privacy')">What's tracked?</button></div>`;
}
function pct(){return S&&S.elapsed?Math.round(S.activeSec/S.elapsed*100):100;}
function resPanel(){return `<div class="p-title">Resource drawer ${tier('could')}</div><div class="res-list" id="resList">${resHtml()}</div>
  <div class="res-form"><input class="field field-sm" id="resTitle" maxlength="60" placeholder="Title, e.g. Lecture 5 slides" onkeydown="if(event.key==='Enter')addRes()"><input class="field field-sm" id="resUrl" maxlength="300" placeholder="https://…" onkeydown="if(event.key==='Enter')addRes()"><div id="resErr" class="err-msg" hidden></div><button class="btn btn-light btn-sm" type="button" onclick="addRes()">Add link for the room</button></div>`;}
function resHtml(){const l=S.room.resources;return l.length?l.map(x=>`<div class="res"><span class="ic-box">${ic('link')}</span><div style="min-width:0"><a href="${esc(x.u)}" target="_blank" rel="noopener noreferrer">${esc(x.t)}</a><small>Added by ${esc(x.by)}</small></div></div>`).join(''):'<div class="foot-note">No links yet.</div>';}
function addRes(e){e&&e.preventDefault&&e.preventDefault();const t=document.getElementById('resTitle'),u=document.getElementById('resUrl'),er=document.getElementById('resErr');const title=t.value.trim(),url=u.value.trim();
  if(!title||!/^https?:\/\/\S+\.\S+/i.test(url)){er.hidden=false;er.textContent='Add a title and a full link that starts with https://';return;}
  er.hidden=true;S.room.resources.push({t:title,u:url,by:'You'});t.value='';u.value='';document.getElementById('resList').innerHTML=resHtml();toast('Link added to the drawer');}
function safetyPanel(){return `<div class="p-title">Safety ${tier('must')}</div><button class="btn btn-danger btn-sm" onclick="openModal('flag')">Flag a participant</button>
  <div class="divider"></div><div class="p-title">Left out on purpose ${tier('wont')}</div>
  <div class="tip wont" style="display:grid;gap:6px"><span><b>No chat box.</b> Use silent reactions${S.kind==='study'?' and speaking turns':''} instead.</span><span><b>No keystroke or screen recording.</b> Tracking only knows that you typed or moved your cursor.</span>${S.kind==='focus'?'<span><b>No cameras or mics.</b> Focus rooms are avatar only.</span>':'<span><b>No required webcam.</b> Camera is optional and only where the room label allows it.</span>'}</div>`;}
function shortcuts(){const r=S.room;return `<div class="test-tools"><strong>Prototype shortcuts</strong>Jump to moments that normally happen later.<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
  ${r.phase==='lobby'?'':btn('Preview check-in',"openModal('checkin')",'btn-outline btn-sm')}
  ${isWorking(r)?btn(`Skip to end of ${S.kind==='study'?'work block':'sprint'}`,"skipEnd()",'btn-outline btn-sm'):''}
  ${!isWorking(r)&&r.phase!=='lobby'?btn(S.kind==='study'?'Skip to next work block':'Skip to end of break',"skipEnd()",'btn-outline btn-sm'):''}
  ${btn('Get a reaction',"fakeReaction()",'btn-outline btn-sm')}</div></div>`;}
function step(n){const was=S.done>=S.total;S.done=Math.max(0,Math.min(S.total,S.done+n));if(!was&&S.done>=S.total){chime();toast('Task done. The room sees your check mark.');}rerender();}
function skipEnd(){S.room.remain=isWorking(S.room)?6:3;S.wrapShown=false;}
function fakeReaction(){const p=S.peers.filter(x=>!x.left)[0];if(!p)return;const r=REACTIONS[rand(4)];floatOn('you',r[0]);toast(`${p.name} sent “${r[1]}”`);}
function floatOn(key,emoji){const el=document.querySelector(`#desk-${key} .floats`);if(!el)return;const s=document.createElement('span');s.className='float';s.innerHTML=ic(emoji);el.appendChild(s);setTimeout(()=>s.remove(),1800);}
function openReact(i){reactTarget=i;openModal('react');}
function sendReaction(k){const p=S.peers[reactTarget];closeModal();floatOn(reactTarget,REACTIONS[k][0]);toast(`Sent “${REACTIONS[k][1]}” to ${p.name}`);}
function leaveRoom(){if(isWorking(S.room)&&!S.wrapShown){openModal('leave');}else{endSession(false);}}
function endSession(early){
  if(early){log.forEach(l=>l.fresh=false);log.push({d:0,kind:S.kind,room:S.room.name,task:S.task,result:'Left early',note:S.check?.note||'',proof:false,min:Math.round(S.elapsed/60),active:pct(),fresh:true});}
  if(S.room.youCounted){S.room.count--;S.room.youCounted=false;if(S.room.phase==='lobby'&&S.room.count<0)S.room.count=0;}
  S.ended=true;setAmbient('off');closeModal();go(early?'outcome':S.kind==='study'?'study':'focus');
}
