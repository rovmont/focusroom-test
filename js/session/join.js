/* ---------- joining (separate per room type) ---------- */
function openJoin(id){startDemo(()=>{S={pending:id};openModal(room(id).kind==='study'?'joinStudy':'joinFocus');});}
function makePeers(r){
  const n=Math.max(0,(r.youCounted?r.count-1:r.count));const out=[];
  for(let i=0;i<n;i++){const p=POOL[(i+r.id.charCodeAt(0))%POOL.length];const total=3+((i*7+r.id.charCodeAt(0))%4);
    out.push({name:p[0],ini:p[1],color:p[2],task:TASKS[(i+r.id.charCodeAt(0)*3)%TASKS.length],total,done:r.phase==='lobby'?0:Math.min(total-1,(i+1)%3),act:i===2?'idle':(i%2?'cursor':'typing'),idle:i===2?14:0,left:false,fin:false,ready:true});}
  return out;
}
function joinRoom(kind){
  const tEl=document.getElementById('taskEntry'),task=tEl?.value.trim();if(!task){tEl?.classList.add('err');tEl?.focus();return;}
  const total=Math.max(1,Math.min(20,+document.getElementById('taskParts')?.value||5));
  const r=room(S.pending);
  if(r.phase==='lobby'&&!r.mine){r.count++;r.youCounted=true;}
  const peers=makePeers(r);
  S={kind,room:r,task,total,done:0,peers,elapsed:0,activeSec:0,check:null,autoChecked:false,wrapShown:false,ended:false,ready:false,countdown:null,sprintNo:1,leaveSim:kind==='focus'&&peers.length>=3,results:null,
     queue:[],speaker:null,spkLeft:0,host:null,sharing:false,camOn:false};
  S.checkAt=Math.min(Math.floor(phaseLen(r)/2),r.remain-90);if(r.phase!=='lobby')S.started=true;
  if(kind==='study'){
    S.host=peers[1]?.name||peers[0]?.name||'You';
    const q=document.getElementById('qEntry')?.value.trim();
    S.queue=peers.length>2?[{name:peers[2].name,q:QUESTIONS[{os:0,stats:1,board:3}[r.screen]??4]}]:[];
    if(q)S.queue.push({name:'You',q});
    if(r.phase==='discuss'&&peers[0]){S.speaker={name:peers[0].name,q:r.screen==='stats'?'Can someone explain p-values simply?':QUESTIONS[4]};S.spkLeft=15;}
  }
  track.last=Date.now();
  closeModal();go(kind==='study'?'ssession':'fsession');
  if(r.phase==='lobby')toast("You're in. Press I'm ready when you are.");
}
function quickJoin(id,then){startDemo(()=>{const r=room(id);if(!S||!S.room||S.room.id!==id||S.ended){S={pending:id};const holder=document.createElement('div');holder.hidden=true;holder.innerHTML='<input id="taskEntry" value="Review my course notes"><input id="taskParts" value="5">';document.body.appendChild(holder);joinRoom(r.kind);holder.remove();}else go(r.kind==='study'?'ssession':'fsession');if(then)setTimeout(then,80);});}
