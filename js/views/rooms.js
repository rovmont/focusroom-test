/* ---------- lobby lists ---------- */
function filters(){return `<div class="filters"><span style="font-size:12px;font-weight:800;color:var(--muted);margin-right:4px">Course / topic ${tier('should')}</span>${['All',...TAGS].map(t=>`<button class="fchip ${filterTag===t?'on':''}" onclick="filterTag='${t}';render()">${t==='All'?'All':'#'+t}</button>`).join('')}</div>`;}
function tabs(cur){return `<div class="tabs"><button class="tab ${cur==='focus'?'on':''}" onclick="go('focus')"><b>Focus rooms</b><small>Silent, avatar only, mics off</small></button><button class="tab ${cur==='study'?'on':''}" onclick="go('study')"><b>Study sessions</b><small>Host screen share and turn-based talking</small></button></div>`;}
function roomCard(r){
  const st=r.kind==='study';
  let foot;
  if(r.phase==='lobby'){
    foot=r.mine&&r.count<3?`<div class="members">Waiting for ${3-r.count} more<br><small>Opens at 3 students</small></div><div style="display:flex;gap:6px;flex-wrap:wrap">${btn('Copy invite',`copyInvite('${r.id}')`,'btn-light btn-sm')}${btn('+1 joins (demo)',`simJoin('${r.id}')`,'btn-outline btn-sm')}</div>`
      :r.mine?`<div class="members">${r.count} students in<br><small>Ready to start together</small></div>${btn('Enter and start',`openJoin('${r.id}')`,'btn-primary btn-sm')}`
      :`<div class="members">${3-r.count} more needed<br><small>You'd be student #${r.count+1}</small></div>${btn('Join and get ready',`openJoin('${r.id}')`,'btn-primary btn-sm')}`;
  }else foot=`<div class="members">${r.count}/${r.capacity} students<br><small>Same end time for all</small></div>${btn(st?'Join session':'Join room',`openJoin('${r.id}')`,'btn-primary btn-sm')}`;
  const label='';
  return `<article class="room ${r.phase==='lobby'?'waiting':''}"><div class="room-head"><div class="room-icon ${st?'speak':''}">${st?ic('screen'):ic('clock')}</div><span class="phase-chip p-${r.phase}" data-phase="${r.id}">${phaseText(r)}</span></div>
  <h3>${esc(r.name)}</h3>${r.subject?`<div class="subject">${esc(r.subject)} ${tier('could')}</div>`:''}<p>${esc(r.desc)}</p>
  <div class="chips">${r.tags.map(t=>`<span class="chip tag">#${esc(t)}</span>`).join('')}<span class="chip">${st?`${r.len}-min work + ${r.disc}-min discussion`:`${r.len}-min sprints + 5-min breaks`}</span><span class="chip chip-mode ${st?'study':''}">${st?ic('mic')+' Mic in turns · host shares screen'+(r.video?' · camera optional':''):ic('micOff')+' Avatar only · mics off'}</span></div>
  ${label}<div class="room-footer">${foot}</div></article>`;
}
function listPage(kind){
  const list=rooms.filter(r=>r.kind===kind&&(filterTag==='All'||r.tags.includes(filterTag)));
  const intro=kind==='focus'
    ?{h:'Focus rooms',p:'Silent rooms where everyone works on their own task. Avatars only, all mics off. Sprints and breaks happen together.'}
    :{h:'Study sessions',p:'Work alone first, then talk it through. A rotating host shares the problem set, and everyone speaks in turns during the discussion round.'};
  return `<main class="page shell"><div class="page-top"><div><div class="kicker">Explore rooms · sample campus</div><h2>${intro.h}</h2><p class="page-sub">${intro.p}</p></div>
  <div class="top-actions"><div class="mini-card">Verified as<br><strong>${esc(verified||'Campus student')}</strong></div>${btn(ic('plus')+' Create a room',`openCreate('${kind}')`,'btn-dark')}</div></div>
  ${tabs(kind)}
  ${filters()}
  <div class="room-grid" style="margin-top:16px">${list.length?list.map(roomCard).join(''):'<div class="empty">No rooms match this tag right now. Try another tag, or create one.</div>'}</div>
  <p class="quiet" style="margin-top:22px">Rooms, classmates, and timers are simulated for usability testing. Timers keep running while you browse.</p></main>`;
}
function copyInvite(id){const txt='Join my FocusRoom: '+room(id).name+' (school email required)';try{navigator.clipboard.writeText(txt).then(()=>toast('Invite copied'),()=>toast('Invite text: '+txt));}catch(e){toast('Invite text: '+txt);}}
function simJoin(id){const r=room(id);r.count++;toast(r.count>=3?'3 students in. Enter the room to start together.':`${r.count} of 3 students in`);render();}
