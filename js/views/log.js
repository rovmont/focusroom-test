/* ---------- log ---------- */
function resCls(r){return r==='Completed'?'r-done':r==='Partially completed'?'r-part':r==='Left early'?'r-left':'r-more';}
function logPage(){
  const done=log.filter(l=>l.result==='Completed').length,rate=log.length?Math.round(done/log.length*100):0,st=streak();
  const avgAct=log.length?Math.round(log.reduce((a,l)=>a+(l.active||0),0)/log.length):0;
  const week=[];for(let d=-6;d<=0;d++){const x=new Date(today);x.setDate(x.getDate()+d);week.push({d,lab:x.toLocaleDateString('en-PH',{weekday:'short'}),min:log.filter(l=>l.d===d).reduce((a,l)=>a+l.min,0)});}
  const max=Math.max(50,...week.map(w=>w.min));
  const byKind=k=>{const l=log.filter(x=>x.kind===k);return l.length?Math.round(l.filter(x=>x.result==='Completed').length/l.length*100):0;};
  const actKind=k=>{const l=log.filter(x=>x.kind===k);return l.length?Math.round(l.reduce((a,x)=>a+x.active,0)/l.length):0;};
  const extra=`<div class="stat" style="padding:18px"><div class="side-title">Focus minutes this week <span class="plus-badge">Plus</span></div><div class="bars">${week.map(w=>`<div class="col ${w.d===0?'today':''}"><em>${w.min||''}</em><div class="b" style="height:${w.min/max*80}%"></div><small>${w.lab}</small></div>`).join('')}</div><div class="divider"></div><div style="font-size:12px;color:var(--muted);display:grid;gap:4px"><span>Focus rooms: <b style="color:var(--ink)">${byKind('focus')}%</b> completed, <b style="color:var(--ink)">${actKind('focus')}%</b> active</span><span>Study sessions: <b style="color:var(--ink)">${byKind('study')}%</b> completed, <b style="color:var(--ink)">${actKind('study')}%</b> active</span></div></div>`;
  return `<main class="page shell"><div class="page-top"><div><div class="kicker">Private to you</div><h2>My log</h2><p class="page-sub">Your streak, session history, and active time. Nobody else sees this page.</p></div></div>
  <div class="log-grid"><section>
   <div class="stats stats4"><div class="stat"><span>Streak ${tier('could')}</span><strong>${st} day${st===1?'':'s'}</strong><div class="streak-dots">${[-6,-5,-4,-3,-2,-1,0].map(d=>`<i class="${log.some(l=>l.d===d)?'on':''}" title="${dayLabel(d)}"></i>`).join('')}</div></div><div class="stat"><span>Sessions</span><strong>${log.length}</strong></div><div class="stat"><span>Tasks completed</span><strong>${rate}%</strong></div><div class="stat"><span>Avg. active time ${tier('must')}</span><strong>${avgAct}%</strong></div></div>
   <div class="side-title">Activity log ${tier('could')}</div>
   ${[...log].sort((a,b)=>b.d-a.d).map(l=>`<div class="entry"><div class="date">${dayLabel(l.d)}</div><div style="min-width:0"><b>${esc(l.task)}</b><div class="meta">${l.kind==='study'?'Study session':'Focus room'} · ${esc(l.room)} · ${l.min} min · active ${l.active}%</div>${l.note?`<div class="note">Check-in: “${esc(l.note)}”</div>`:''}${l.proof?`<span class="proof">With proof${l.proofName?' · '+esc(l.proofName):''}</span>`:''}</div><span class="res-chip ${resCls(l.result)}">${esc(l.result)}</span></div>`).join('')}
  </section><aside style="display:grid;gap:14px">
   ${profile.plus?extra:`<div class="locked stat" style="padding:0"><div class="blurred">${extra}</div><div class="over"><div><b>Extra stats come with Plus</b><p style="font-size:12px;color:var(--muted);margin:6px 0 12px">Weekly minutes, plus completion and active time by room type.</p>${btn('See Plus',"go('plus')",'btn-gold btn-sm')}</div></div></div>`}
   <div class="tip wont"><b>No leaderboards or rankings</b> ${tier('wont')}<br>Your active time and streak are never compared with other students.</div>
  </aside></div></main>`;
}
