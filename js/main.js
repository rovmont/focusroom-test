/* =========================================================
   FocusRoom MVP v3
   Two separate room implementations:
     - Focus room  (avatar only, mics off, shared focus/break rhythm)
     - Study session (work block -> turn-based discussion, host screen share)
   Activity tracking (cursor + typing) runs in every room.
   ========================================================= */
/* Entry point. Loaded last: every other script in index.html must run first,
   because the clock and the first render call into all of them. */

/* ---------- ticking ---------- */
let tickN=0;
setInterval(()=>{
  tickN++;
  rooms.forEach(r=>{if(r.phase==='lobby'||(S&&!S.ended&&S.room===r))return;r.remain--;if(r.remain<=0){r.phase=r.kind==='focus'?(r.phase==='focus'?'break':'focus'):(r.phase==='work'?'discuss':'work');r.remain=phaseLen(r);}});
  document.querySelectorAll('[data-phase]').forEach(el=>{const r=room(el.dataset.phase);if(r){el.textContent=phaseText(r);el.className='phase-chip p-'+r.phase;}});
  if(S&&S.room&&!S.ended)sessionTick();
  updateReturnChip();
},1000);

/* ---------- render ---------- */
function render(){
  const views={welcome,focus:()=>listPage('focus'),study:()=>listPage('study'),fsession:()=>S&&S.room?focusSession():listPage('focus'),ssession:()=>S&&S.room?studySession():listPage('study'),outcome:outcomePage,log:logPage,plus:plusPage,map:mapPage};
  document.getElementById('app').innerHTML=(views[page]||welcome)();renderNav();
}
if(document.documentElement.classList.contains('lg-refract'))buildLensMap();
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalName&&!['vote','consent','reveal'].includes(modalName))closeModal();});
render();
