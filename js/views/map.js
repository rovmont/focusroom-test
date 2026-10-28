/* ---------- feature map ---------- */
const FEATURES={
 must:[
  ['School email sign-in','A non-school email is refused.',"verified=false;consented=false;openModal('verify')"],
  ['Activity tracking consent','Shown at sign-in before any room.',"verified=verified||'juan.delacruz@dlsu.edu.ph';openModal('consent')"],
  ['Cursor and typing tracking in every room','Typing, Using cursor, Idle, or Away on each desk.',"quickJoin('a')"],
  ['Focus rooms: avatar only, mics off','Its own room type and screen.',"startDemo(()=>go('focus'))"],
  ['Study sessions: host screen share + turn-based talking','Its own room type and screen.',"quickJoin('d')"],
  ['3-person minimum','Thesis Writing Hour waits for a third student.',"quickJoin('e')"],
  ['Synchronized timers','Late joiners end at the same time.',"quickJoin('a')"],
  ['Task declaration with visible progress','Every desk shows the task and parts done.',"quickJoin('a')"],
  ['Flag and vote-to-remove','Flag, then watch the room vote.',"quickJoin('a',()=>openModal('flag'))"]],
 should:[
  ['Shared start, break, and results','Ready check, break together, reveal together.',"quickJoin('e')"],
  ['Silent reactions',"Tap a classmate's desk.","quickJoin('a',()=>openReact(0))"],
  ['Avatar states and left-early','Idle, away, on break, left early.',"quickJoin('b')"],
  ['Room goal meter','Tasks done by the whole room.',"quickJoin('a')"],
  ['Mid-session check-in','Progress note halfway through.',"quickJoin('a',()=>openModal('checkin'))"],
  ['End-of-sprint wrap-up','Completed, partial, or needs more time.',"quickJoin('a',()=>openModal('wrap'))"],
  ['Course and topic tags','Filter rooms by #tag.',"filterTag='Computer Science';startDemo(()=>go('focus'))"]],
 could:[
  ['Ambient sound and finish chime','Library, café, or rain in focus rooms.',"quickJoin('a')"],
  ['Rotating host','The host passes to the next student each block.',"quickJoin('d')"],
  ['Optional camera in labeled study sessions','Only where the room allows it.',"quickJoin('d')"],
  ['Resource and link drawer','Share links with the room.',"quickJoin('c')"],
  ['Subject-specific sessions','Create your own room.',"startDemo(()=>openCreate('study'))"],
  ['Optional private proof upload','Attach proof at wrap-up.',"quickJoin('a',()=>openModal('wrap'))"],
  ['Streak and activity log','Private history with active time.',"go('log')"],
  ['Premium tier','Avatar style, reserved rooms, extra stats.',"go('plus')"]],
 wont:[
  ['Mandatory webcam','Defeats the camera-free idea.'],
  ['1-on-1 rooms','Safety risk. Rooms need 3+.'],
  ['Open text or voice chat','Reactions and speaking turns replace it.'],
  ['Public leaderboards','Active time and streaks stay private.'],
  ['Open sign-up without school email','Breaks campus-verified trust.'],
  ['Recording keystrokes or screen content','Tracking only knows that you were active.']]
};
function mapPage(){
  const desc={must:'The product fails without these.',should:'Important, with a workaround.',could:'Added if time allows.',wont:'Left out because they conflict with the purpose.'};
  return `<main class="page shell"><div class="page-top"><div><div class="kicker">MoSCoW prioritization · v3</div><h2>Feature map</h2><p class="page-sub">Every feature in the prototype and where to find it. Tap “Show me” to jump to each one.</p></div>${btn('Replay the tour','startTour()','btn-light')}</div>
  <div class="map">${Object.keys(FEATURES).map(k=>`<section class="col-card"><h3>${TIERS[k]} have</h3><p>${desc[k]}</p>${FEATURES[k].map(f=>`<div class="fitem"><b>${f[0]}</b><small>${f[1]}</small>${f[2]?`<button class="btn btn-light btn-sm" onclick="${f[2]}">Show me</button>`:''}</div>`).join('')}</section>`).join('')}</div></main>`;
}
