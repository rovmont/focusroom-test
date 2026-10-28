/* ---------- outcome ---------- */
function outcomePage(){const last=log.find(l=>l.d===0&&l.fresh);const st=streak();const [gd,ga]=S&&S.results?S.results.goal:[0,0];
  return `<main class="page shell outcome"><div class="panel outcome-card"><div class="outcome-badge">${last&&last.result==='Left early'?ic('back'):ic('check')}</div><div class="kicker" style="margin-top:20px">${S?.kind==='study'?'Study session':'Focus room'} summary</div><h2>${last&&last.result==='Left early'?'You left early.':'One focused step forward.'}</h2>
  <p>${last?`<b>${esc(last.task)}</b> · <span class="res-chip ${resCls(last.result)}">${esc(last.result)}</span>`:'Session preview completed'}</p>${last&&last.proof?`<span class="proof">Proof attached · only you can see it</span>`:''}
  <div class="stat-strip"><div><strong>${last?last.active:0}%</strong><span>active time (private)</span></div><div><strong>${ga?gd+'/'+ga:'–'}</strong><span>room tasks done</span></div><div><strong>${st}</strong><span>day streak</span></div></div>
  <p style="max-width:430px;margin:0 auto 20px">Saved to your private log. What did studying beside other students change for you? Tell us in the survey.</p>
  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">${btn('View my log',"go('log')")}${btn('Back to rooms',`go('${S?.kind==='study'?'study':'focus'}')`,'btn-outline')}</div></div></main>`;}
