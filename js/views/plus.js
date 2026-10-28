/* ---------- plus ---------- */
function plusPage(){
  const colors=['av-you','av-blue','av-peach','av-lilac','av-sun','av-rose','av-sea'];
  const accs=[['','None'],['headphones','Headphones'],['coffee','Coffee'],['book','Books'],['leaf','Sprout']];
  const L=profile.plus?'':'disabled';
  return `<main class="page shell"><div class="page-top"><div><div class="kicker">Premium concept ${tier('could')}</div><h2>FocusRoom Plus</h2><p class="page-sub">Rooms, tracking, and accountability stay free. Plus adds extras for students who use FocusRoom often. Price is still being tested against student allowances.</p></div></div>
  <div class="plus-grid"><section class="plus-hero"><div class="eyebrow">Plus</div><h3>${profile.plus?'Plus is on (demo)':'Make your rooms yours'}</h3><p>Nothing in Plus changes safety or accountability.</p>
  <ul><li>Avatar colors and accessories</li><li>Reserved rooms for your blockmates at a set time</li><li>Extra stats in your private log</li></ul>
  ${btn(profile.plus?'Turn off Plus (demo)':'Try Plus (demo)','togglePlus()',profile.plus?'btn-light':'btn-primary')}</section>
  <section class="panel" style="padding:24px"><div class="side-title">Avatar customization</div>
   <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap"><div class="big-av">${myAvatar()}</div><div style="display:grid;gap:12px;min-width:0">
   <div><div style="font-size:11px;font-weight:800;color:var(--muted);margin-bottom:6px">COLOR</div><div class="swatches">${colors.map(c=>`<button class="sw ${c} ${profile.color===c?'on':''}" ${L} aria-label="${c}" onclick="profile.color='${c}';render()"></button>`).join('')}</div></div>
   <div><div style="font-size:11px;font-weight:800;color:var(--muted);margin-bottom:6px">ACCESSORY</div><div class="acc-pick">${accs.map(([a,l])=>`<button class="${profile.acc===a?'on':''}" ${L} onclick="profile.acc='${a}';render()">${a?ic(a)+' ':''}${l}</button>`).join('')}</div></div></div></div>
   ${profile.plus?'':'<p class="foot-note" style="margin-top:12px">Turn on Plus (demo) to edit. Your avatar appears like this in every room.</p>'}
   <div class="divider"></div><div class="side-title">Reserved rooms</div>
   <div class="form-grid"><div><label class="foot-note" for="resvKind">Room type</label><select class="field field-sm" id="resvKind" ${L}><option>Focus room</option><option>Study session</option></select></div><div><label class="foot-note" for="resvDay">Day and time</label><select class="field field-sm" id="resvDay" ${L}><option>Thursday, 7:00 PM</option><option>Friday, 8:00 PM</option><option>Saturday, 9:00 AM</option></select></div></div>
   <div style="margin-top:10px"><button class="btn btn-outline btn-sm" ${L} onclick="toast('Reserved: '+document.getElementById('resvKind').value+', '+document.getElementById('resvDay').value)">Reserve and copy invite</button></div>
   <p class="foot-note" style="margin-top:8px">Reserved rooms still need 3 verified students to start.</p></section></div></main>`;
}
function togglePlus(){profile.plus=!profile.plus;if(!profile.plus){profile.color='av-you';profile.acc='';}render();toast(profile.plus?'Plus is on for this demo':'Plus is off');}
