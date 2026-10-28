/* ---------- phase changes for the joined room ---------- */
function startPhase(p){
  const r=S.room;r.phase=p;r.remain=phaseLen(r);
  if(isWorking(r)){
    if(S.sprintNo>0&&S.started)S.sprintNo++;S.started=true;S.elapsed=0;S.activeSec=0;S.check=null;S.autoChecked=false;S.wrapShown=false;S.proof=null;S.checkAt=Math.floor(phaseLen(r)/2);
    S.peers.forEach(x=>{if(x.fin){x.fin=false;x.done=0;x.task=TASKS[rand(TASKS.length)];}x.act='typing';x.idle=0;});
    if(S.done>=S.total){S.done=0;}
    if(S.kind==='study'&&S.sprintNo>1){const order=[...S.peers.filter(x=>!x.left).map(x=>x.name),'You'];S.host=order[(order.indexOf(S.host)+1)%order.length];S.sharing=false;}
    toast(S.kind==='study'?'Work block started for everyone':'Sprint started for everyone');
  }else if(p==='break'){toast('Shared break. Back together in 5 minutes.');}
  else if(p==='discuss'){toast('Discussion round. The queue starts now.');}
  rerender();
}
