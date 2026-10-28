/* ---------- STUDY SESSION view ---------- */
function screenHtml(){
  const s=S;if(s.host==='You'&&!s.sharing)return `<div class="top"><span>Shared screen · host only</span><span>You're the host</span></div><div class="blank">Share a problem set or slide when the group needs it.</div>`;
  if(s.host==='You')return `<div class="top"><span>Your screen · shared with the room</span><span>simulated</span></div><div class="blank">Your shared window appears here for everyone</div>`;
  const t=S.room.screen;let body;
  if(t==='os')body=`<table><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th></tr><tr><td>P1</td><td>0</td><td>7</td><td>3</td></tr><tr><td>P2</td><td>2</td><td>4</td><td>1</td></tr><tr><td>P3</td><td>4</td><td>1</td><td>4</td></tr><tr><td>P4</td><td>5</td><td>4</td><td>2</td></tr></table><div style="margin-top:10px;color:#8fbca6">Draw the Gantt chart for preemptive SJF, then compare average waiting time with FCFS.</div>`;
  else if(t==='stats')body=`<div class="slide"><h4>Hypothesis testing checklist</h4><ol><li>State H₀ and H₁</li><li>Pick one- or two-tailed</li><li>Choose α = 0.05</li><li>Compute the test statistic</li><li>Compare with the critical value</li></ol></div>`;
  else body=`<div class="slide"><h4>Item 14</h4>A patient on digoxin has a heart rate of 54 bpm. What should the nurse do first?<ol><li>Give the dose</li><li>Hold the dose and reassess</li><li>Double the next dose</li><li>Call the pharmacy</li></ol></div>`;
  return `<div class="top"><span>${esc(s.host)} is sharing · host only</span><span>${esc(S.room.subject||'')}</span></div>${body}`;
}
function queueInner(){
  const r=S.room,inQ=S.queue.some(q=>q.name==='You'),disc=r.phase==='discuss';
  const now=S.speaker?`<div class="now-speaking"><div class="who"><span class="act act-speaking">${ic('mic')} Speaking</span>${esc(S.speaker.name)} <span id="spkTime" style="font-weight:700;color:var(--muted);font-variant-numeric:tabular-nums">${fmt(S.spkLeft)}</span></div>${S.speaker.q?`<small>“${esc(S.speaker.q)}”</small>`:''}</div>`
    :`<div class="now-speaking empty"><div class="who" style="font-size:13px">${disc?'No one is speaking. Next in queue goes soon.':'Mics are locked during the work block.'}</div><small>${disc?'Raise your hand to take a turn.':'Raise your hand now to add a question for the discussion round.'}</small></div>`;
  const list=S.queue.length?`<ol class="qlist">${S.queue.map((q,i)=>`<li class="${q.name==='You'?'you':''}"><span>${i+1}</span><span><b>${esc(q.name)}</b><i>${esc(q.q||'No question added')}</i></span></li>`).join('')}</ol>`:'<div class="foot-note">The queue is empty.</div>';
  const mine=S.speaker&&S.speaker.name==='You'?btn('End my turn','endTurn()','btn-dark btn-sm'):inQ?btn('Lower my hand','leaveQueue()','btn-light btn-sm'):`<div style="display:grid;gap:7px"><input class="field field-sm" id="qText" maxlength="90" placeholder="Your question (optional)" onkeydown="if(event.key==='Enter')raiseHand()"><button class="btn btn-outline btn-sm" type="button" onclick="raiseHand()">${ic('hand')} Raise hand</button></div>`;
  const hostCtl=S.host==='You'?`<div class="divider" style="margin:4px 0"></div><div style="display:flex;gap:6px;flex-wrap:wrap">${btn('Call next speaker','callNext()','btn-light btn-sm',disc?'':'disabled')}</div><div class="foot-note">As host, you can move the queue along.</div>`:'';
  return `<div class="p-title" style="margin:0">Discussion queue ${tier('must')}</div>${now}${list}${mine}${hostCtl}<div class="foot-note">Your mic turns on only during your own turn. Turns are 2 minutes (shortened here).</div>`;
}
function studySession(){
  const r=S.room,lobby=r.phase==='lobby';
  const steps=`<div class="steps-line"><span class="sl ${lobby?'on':'done'}">Ready</span><span class="sl ${r.phase==='work'?'on':r.phase==='discuss'?'done':''}">Work block ${r.len}m</span><span class="sl ${r.phase==='discuss'?'on':''}">Results + discussion ${r.disc}m</span><span class="sl">Next block</span></div>`;
  const next=S.host==='You'?(S.peers[0]?.name||'You'):'You';
  return `<main class="page shell"><button class="back" onclick="leaveRoom()">${ic('chevL')}Leave session</button>
  <div class="sess-head"><div><div class="meta"><span class="kind-badge k-study">${ic('screen')} Study session ${tier('must')}</span>${trackPill()}</div><h2>${esc(r.name)}</h2><p class="page-sub">${esc(r.subject||'')}. Work quietly during the block, then talk it through in turns.</p></div>
   <div class="head-actions">${r.video?`<button class="btn btn-outline btn-sm" onclick="S.camOn=!S.camOn;refreshDesks();rerender()">${S.camOn?'Turn camera off':'Turn camera on (optional)'}</button>${tier('could')}`:''}</div></div>
  <div class="panel st-strip">${ringHtml(r,'ring')}<div style="display:grid;gap:8px;min-width:0;flex:2"><span style="font-size:11px;font-weight:850;color:var(--muted);text-transform:uppercase;letter-spacing:.8px">Session rhythm ${tier('should')}</span>${steps}</div>${goalHtml()}</div>
  ${lobby?`<div class="banner lobby" id="lobbyBanner" style="margin:0 0 16px">${lobbyInner()}</div>`:''}
  ${r.phase==='discuss'?`<div class="banner discuss" style="margin:0 0 16px"><b>Discussion round.</b> The queue moves one speaker at a time. Work tracking is paused.</div>`:''}
  <div class="st-grid"><section class="panel stage"><div class="p-title">Shared screen ${tier('must')}</div><div class="screen" id="screen">${screenHtml()}</div>
     <div class="host-row">Host: <b>${esc(S.host)}</b> · Next block: <b>${esc(next)}</b> ${tier('could')}
     ${S.host==='You'?btn(S.sharing?'Stop sharing':'Share my screen (demo)','S.sharing=!S.sharing;rerender()','btn-outline btn-sm'):''}${btn('Pass host','rotateHost()','btn-light btn-sm')}</div></section>
   <aside class="panel qpanel" id="qpanel">${queueInner()}</aside></div>
  <section class="panel people-strip"><div class="p-title">In this session ${tier('must')} <span style="font-weight:600;font-size:12px;color:var(--muted)">Tap a classmate to react ${tier('should')}</span></div><div class="desks" id="desks">${desksHtml()}</div></section>
  <div class="st-lower"><div class="panel">${myTaskPanel()}</div><div class="panel">${myActPanel()}</div><div class="panel">${resPanel()}<div class="divider"></div>${safetyPanel()}</div></div>
  ${shortcuts()}</main>`;
}
function raiseHand(e){e&&e.preventDefault&&e.preventDefault();const q=document.getElementById('qText').value.trim();S.queue.push({name:'You',q});refreshQueue(true);toast(S.room.phase==='discuss'?"You're in the speaking queue":"Your question is queued for the discussion round");}
function leaveQueue(){S.queue=S.queue.filter(q=>q.name!=='You');refreshQueue(true);}
function endTurn(){S.speaker=null;S.spkLeft=0;refreshQueue(true);refreshDesks();}
function callNext(){S.speaker=null;S.spkLeft=0;advanceQueue();refreshQueue(true);refreshDesks();}
function refreshQueue(force){const el=document.getElementById('qpanel');if(!el)return;const sig=JSON.stringify([S.speaker&&S.speaker.name,S.queue.map(q=>q.name),S.room.phase,S.host]);if(force||el._sig!==sig){el._sig=sig;el.innerHTML=queueInner();}else{const t=document.getElementById('spkTime');if(t)t.textContent=fmt(S.spkLeft);}}
function rotateHost(){const order=[...S.peers.filter(p=>!p.left).map(p=>p.name),'You'];const i=order.indexOf(S.host);S.host=order[(i+1)%order.length];S.sharing=false;rerender();toast(`${S.host==='You'?'You are':S.host+' is'} now the host`);}
function advanceQueue(){if(!S.speaker&&S.queue.length){S.speaker=S.queue.shift();S.spkLeft=S.speaker.name==='You'?30:15;if(S.speaker.name==='You')toast("It's your turn. Your mic is on.");refreshDesks();}}
