/* ---------- helpers ---------- */
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function fmt(s){s=Math.max(0,s|0);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function btn(text,fn,cls='btn-primary',extra=''){return `<button class="btn ${cls}" onclick="${fn}" ${extra}>${text}</button>`;}
function toast(msg){const r=document.getElementById('toastRoot');r.innerHTML=`<div class="toast glass dark" role="status">${esc(msg)}</div>`;clearTimeout(toast.h);toast.h=setTimeout(()=>r.innerHTML='',2600);}
function dayLabel(d){const x=new Date(today);x.setDate(x.getDate()+d);return d===0?'Today':d===-1?'Yesterday':x.toLocaleDateString('en-PH',{weekday:'short',month:'short',day:'numeric'});}
function myAvatar(){return `<span class="avatar ${profile.color}">YOU${profile.acc?`<span class="acc">${ic(profile.acc)}</span>`:''}</span>`;}
function counted(){return log.filter(l=>!l.uncounted);}
function streak(){const days=new Set(counted().map(l=>l.d));let s=0;for(let d=days.has(0)?0:-1;days.has(d);d--)s++;return s;}
function room(id){return rooms.find(r=>r.id===id);}
function rand(n){return Math.floor(Math.random()*n);}
function isWorking(r){return r.phase==='focus'||r.phase==='work';}
function phaseLen(r){return isWorking(r)?r.len*60:r.phase==='break'?BREAK_LEN:r.phase==='discuss'?r.disc*60:0;}
function phaseName(r){return {focus:'Focus sprint',work:'Work block',break:'Shared break',discuss:'Discussion round',lobby:'Getting ready'}[r.phase];}
function phaseText(r){
  if(r.phase==='lobby')return `Starting · ${Math.min(r.count,3)}/3 ready`;
  return `${{focus:'Focus',work:'Work block',break:'Break',discuss:'Discussion'}[r.phase]} · ${fmt(r.remain)}`;
}
function rerender(){const y=window.scrollY;render();window.scrollTo(0,y);}
