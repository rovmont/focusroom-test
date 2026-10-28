function checkEmail(e){e&&e.preventDefault&&e.preventDefault();const v=document.getElementById('email').value.trim(),er=document.getElementById('emailErr');
  if(!/^[^@\s]+@[^@\s]+\.edu(\.[a-z]{2})?$/i.test(v)){er.hidden=false;er.innerHTML=`Use your school email (for example, one ending in .edu.ph). Sign-up without a school email isn't available, so rooms stay student-only. ${tier('wont')}`;document.getElementById('email').classList.add('err');return;}
  verified=v;openModal('code');}
function declineConsent(){openModal('declined');}
function finishVerify(){consented=true;closeModal();const a=pendingAfter;pendingAfter=null;toast('Verified. Activity tracking agreed.');if(a)a();else go('focus');}
function saveCheck(){const n=document.getElementById('checkNote').value.trim();S.check={status:checkPick,note:n};S.autoChecked=true;closeModal();rerender();toast('Check-in saved');}
function startVote(){voteState={who:flagPick,why:document.getElementById('flagWhy').value,yes:0,done:false,mine:false};modalName='vote';renderModal();}
function castVote(yes){const v=voteState;v.mine=true;if(yes)v.yes++;renderModal();const others=S.peers.filter(p=>!p.left&&p.name!==v.who).length;let i=0;
  const stepV=()=>{if(modalName!=='vote')return;if(i<others){if(yes||i<Math.floor(others/2))v.yes++;i++;renderModal();setTimeout(stepV,650);}else{v.done=true;v.removed=v.yes>(others+1)/2;if(v.removed){S.peers=S.peers.filter(p=>p.name!==v.who);S.queue=S.queue.filter(q=>q.name!==v.who);if(S.host===v.who)S.host='You';}renderModal();}};
  setTimeout(stepV,650);}
function peerRows(){return S.peers.map(p=>({name:p.name,ini:p.ini,color:p.color,task:p.task,result:p.left?'Left early':p.fin?'Completed':p.done/p.total>=.5?'Partially completed':'Need more time',shared:p.left,proof:!p.left}));}
function finish(withProof){
  const r=S.room;log.forEach(l=>l.fresh=false);
  log.push({d:0,kind:S.kind,room:r.name,task:S.task,result:wrapPick,note:S.check?.note||'',proof:withProof,proofName:withProof?S.proof.file:'',uncounted:!withProof,min:r.len,active:pct(),fresh:true});
  if(wrapPick==='Completed')S.done=S.total;
  const rows=peerRows();
  // One classmate skips proof in the first wrap-up of a session, then now and then, so the warning shows up in the demo
  const active=rows.filter(x=>!x.shared);if(active.length>=2&&(!S.skipShown||Math.random()<.35)){active[rand(active.length)].proof=false;S.skipShown=true;}
  rows.push({you:true,name:'You',task:S.task,result:wrapPick,shared:true,proof:withProof});
  S.results={rows,goal:[rows.filter(x=>x.result==='Completed').length,rows.length]};
  openModal('reveal');waitForRoom();
}
function endAfterReveal(){if(S.room.youCounted){S.room.count--;S.room.youCounted=false;}S.ended=true;setAmbient('off');go('outcome');}
function createRoom(e){e&&e.preventDefault&&e.preventDefault();const k=createKind;const name=document.getElementById('cName').value.trim()||'My study room';
  const r={id:'n'+Date.now(),kind:k,name,subject:document.getElementById('cSubject').value.trim()||'General',len:+document.getElementById('cLen').value,phase:'lobby',remain:0,count:1,capacity:+document.getElementById('cCap').value,desc:'Created by you. Share the invite with classmates.',tags:[document.getElementById('cTag').value],mine:true,youCounted:true,resources:[]};
  if(k==='study'){r.disc=+document.getElementById('cDisc').value;r.video=document.getElementById('cVideo').value==='1';r.screen='board';}
  rooms.unshift(r);filterTag='All';closeModal();go(k);toast('Room created. It starts when 2 more students join.');}
