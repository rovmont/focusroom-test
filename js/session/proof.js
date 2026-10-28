/* ---------- proof check (simulated) ----------
   Proof is required for a sprint to count. The upload and the AI check are pretend:
   there's no file picker, and the file name and summary are made up from the declared task. */
const PROOF_KINDS=[['jpg','Photo of handwritten notes'],['pdf','PDF document'],['png','Screenshot of your work']];
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,32)||'my-work';}
function uploadProof(){
  const [ext,kind]=PROOF_KINDS[rand(PROOF_KINDS.length)],pr={stage:'upload',pct:0,file:`${slug(S.task)}.${ext}`,kind};S.proof=pr;renderModal();
  const mine=()=>S&&S.proof===pr,show=()=>{if(mine()&&modalName==='wrap')renderModal();};
  const up=()=>{if(!mine())return;pr.pct=Math.min(100,pr.pct+18+rand(16));
    if(pr.pct<100){show();setTimeout(up,220);}else{pr.stage='check';show();setTimeout(()=>{if(!mine())return;pr.stage='done';show();},1500);}};
  setTimeout(up,220);
}
function proofSummary(){const n=wrapPick==='Completed'?S.total:S.done;return `${S.proof.kind} about “${S.task}”. ${n?`It shows ${n} of ${S.total} parts worked through.`:'It shows the task started, with work in progress.'}`;}
function proofBox(){
  const pr=S.proof,file=pr?`<div class="proof-file"><span class="ic-box">${ic('file')}</span><div style="min-width:0"><b>${esc(pr.file)}</b><small>${pr.kind}</small></div></div>`:'';
  if(!pr)return `<div class="drop"><b>Upload proof of your work</b><br>A screenshot, a photo of your notes, or a file. A quick check compares it with your task.<div style="margin-top:10px">${btn(ic('upload')+' Upload proof','uploadProof()','btn-light btn-sm')}</div></div>`;
  if(pr.stage==='upload')return `<div class="drop">${file}<div class="pbar" style="margin-top:12px"><div class="bar"><div style="width:${pr.pct}%;transition:none"></div></div><span>${pr.pct}%</span></div><small class="foot-note">Uploading (simulated)</small></div>`;
  if(pr.stage==='check')return `<div class="drop">${file}<div class="proof-sum"><span class="act act-notready"><span class="dots"><i></i><i></i><i></i></span> Checking it against your task</span></div></div>`;
  return `<div class="drop">${file}<div class="proof-sum"><span>${esc(proofSummary())}</span><span><span class="act act-ready">${ic('check')} Matches your task</span></span><small class="foot-note">The file is about the task you declared and shows the progress you reported. Simulated check.</small><button class="tour-skip" style="justify-self:start" onclick="uploadProof()">Replace file</button></div></div>`;
}
function shareResult(){if(S.proof&&S.proof.stage==='done')finish(true);else{modalName='noproof';renderModal();}}

/* After you share, classmates share one by one. Results are revealed only once everyone has. */
function waitForRoom(){
  const R=S.results,pending=R.rows.filter(x=>!x.shared);R.revealed=!pending.length;
  const step=()=>{if(!S||S.results!==R)return;pending.shift().shared=true;R.revealed=!pending.length;if(modalName==='reveal')renderModal();if(pending.length)setTimeout(step,700+rand(700));};
  if(pending.length)setTimeout(step,900);
}
