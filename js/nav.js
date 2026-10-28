/* ---------- nav ---------- */
function renderNav(){
  const items=[['focus','Focus rooms'],['study','Study sessions'],['log','My log'],['plus','Plus'],['map','Feature map']];
  const cur=page==='fsession'?'focus':page==='ssession'?'study':page;
  document.getElementById('nav').innerHTML=items.map(([k,l])=>`<button class="nav-link ${cur===k?'on':''}" onclick="${k==='focus'||k==='study'?`startDemo(()=>go('${k}'))`:`go('${k}')`}">${l}</button>`).join('')+
  '';
  const keys=['focus','study','log','plus','map'],i=keys.indexOf(cur);
  document.querySelectorAll('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.k===cur));
  const ind=document.getElementById('tabInd');if(ind){ind.style.setProperty('--i',Math.max(0,i));ind.classList.toggle('none',i<0);}
  updateReturnChip();
}
function updateReturnChip(){const c=document.getElementById('returnChip');if(!c)return;const show=S&&S.room&&!S.ended&&page!=='fsession'&&page!=='ssession'&&page!=='outcome';c.hidden=!show;if(show)document.getElementById('returnTxt').textContent=`${S.room.name} · ${phaseText(S.room)}`;}
function returnToRoom(){if(S&&S.room&&!S.ended)go(S.kind==='study'?'ssession':'fsession');}
function toggleTiers(on){showTiers=on;document.body.classList.toggle('hide-tiers',!on);}
function go(name){page=name;closeModal();render();window.scrollTo(0,0);}
function startDemo(after){if(!verified||!consented){pendingAfter=after||null;openModal(verified?'consent':'verify');}else if(after)after();else go('focus');}
