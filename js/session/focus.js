/* ---------- FOCUS ROOM view ---------- */
function focusSession(){
  const r=S.room;
  const lobby=r.phase==='lobby',brk=r.phase==='break';
  const sprintSteps=`<div class="steps-line"><span class="sl ${lobby?'on':'done'}">Ready</span><span class="sl ${r.phase==='focus'?'on':brk?'done':''}">Focus ${r.len}m</span><span class="sl ${brk?'on':''}">Results + break 5m</span><span class="sl">Next sprint</span></div>`;
  const ready=`<div class="banner lobby" id="lobbyBanner">${lobbyInner()}</div>`;
  const brkBanner=brk?`<div class="banner break"><b>Shared break.</b> Everyone is away from their desks. Tracking is paused. The next sprint starts for everyone at the same time.</div>`:'';
  return `<main class="page shell"><button class="back" onclick="leaveRoom()">${ic('chevL')}Leave room</button>
  <div class="sess-head"><div><div class="meta"><span class="kind-badge k-focus">${ic('clock')} Focus room ${tier('must')}</span>${trackPill()}</div><h2>${esc(r.name)}</h2><p class="page-sub">Silent and avatar only. Everyone's task and activity are visible, and nobody is on camera or mic.</p></div><div class="head-actions"><div class="mini-card"><span class="live-dot"></span>${r.capacity} seats<br><strong id="headCount">${S.peers.filter(p=>!p.left).length+1} students here</strong></div></div></div>
  <div class="fs-grid"><section class="panel fs-main">
    <div class="phase-bar">${ringHtml(r,'ring')}
      <div class="rhythm"><span class="label">Shared rhythm ${tier('should')}</span>${sprintSteps}${goalHtml()}
       <div class="amb">Ambient sound ${tier('could')} <select id="ambSel" onchange="setAmbient(this.value)" aria-label="Ambient sound"><option value="off" ${ambKind==='off'?'selected':''}>Off</option><option value="library" ${ambKind==='library'?'selected':''}>Library hum</option><option value="cafe" ${ambKind==='cafe'?'selected':''}>Café murmur</option><option value="rain" ${ambKind==='rain'?'selected':''}>Rain</option></select><label style="display:flex;gap:5px;align-items:center"><input type="checkbox" id="chimeChk" ${chimeOn?'checked':''} onchange="chimeOn=this.checked"> Chime when someone finishes</label></div></div></div>
    ${lobby?ready:''}${brkBanner}
    <div class="block-title">The room ${tier('must')} <span style="font-weight:600;font-size:12px;color:var(--muted)">Avatar states and left-early ${tier('should')} · Tap a desk to send a reaction ${tier('should')}</span></div>
    <div class="desks" id="desks">${desksHtml()}</div>
    ${shortcuts()}
  </section>
  <aside class="fs-side"><div class="panel">${myTaskPanel()}</div><div class="panel">${myActPanel()}</div><div class="panel">${resPanel()}</div><div class="panel">${safetyPanel()}</div></aside></div></main>`;
}
function lobbyInner(){
  const peersReady=S.peers.filter(p=>p.ready).length,total=S.peers.length+1,readyN=peersReady+(S.ready?1:0);
  if(S.countdown!=null)return `<b>Starting together in ${S.countdown}…</b> Everyone's timer starts at the same second.`;
  if(total<3)return `<b>${total} of 3 students here.</b> The room starts once a third student joins. ${tier('must')}`;
  return `<b>${readyN} of ${total} ready.</b> The sprint starts for everyone once all are ready. ${S.ready?'':btn("I'm ready","imReady()",'btn-primary btn-sm')}`;
}
function imReady(){S.ready=true;S.countdown=5;const b=document.getElementById('lobbyBanner');if(b)b.innerHTML=lobbyInner();refreshDesks();}
