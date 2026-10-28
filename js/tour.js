/* ---------- guided tour ----------
   Starts on every page load (main.js) and can be replayed from the feature map.
   To show the real screens it signs in a demo student and joins sample rooms,
   then puts the session and sign-in back the way they were when it ends. */
const TOUR_EMAIL='demo.student@university.edu.ph';
const TOUR=[
 {title:'Welcome to FocusRoom',text:'Study beside other verified students as an avatar, with no webcam. This quick tour points out the main features. It takes about a minute.',show:()=>tourGo('welcome')},
 {sel:'.hero-ctas',title:'Two kinds of rooms',text:'Focus rooms are silent and avatar only. Study sessions add a host who shares the screen and a turn-based discussion. Joining asks for your school email and your OK on activity tracking.',show:()=>tourGo('welcome')},
 {sel:'#nav,#tabbar',title:'Getting around',text:'Switch between focus rooms, study sessions, your private log, Plus, and the feature map from here.',show:()=>tourGo('welcome')},
 {sel:'.room-grid .room',title:'A room at a glance',text:"Each card shows the room's phase and a timer everyone shares, its course tags, and whether mics are on. A room only starts once 3 students are in, so there are no 1-on-1 rooms.",show:()=>{tourSignIn();tourGo('focus');}},
 {sel:'.phase-bar',title:'One shared rhythm',text:'Inside a focus room, everyone sprints and breaks at the same time, and late joiners finish with the group. The room goal counts the tasks the whole room has finished.',show:()=>tourRoom('a')},
 {sel:'#desks',title:'Seen working, not watched',text:"Every desk shows a classmate's task, their progress, and whether they're typing, using the cursor, idle, or away. Tap a desk to send a silent reaction. There's no chat.",show:()=>tourRoom('a')},
 {sel:'#trackPill',title:'Activity tracking',text:"Tracking only notes that you typed or moved your cursor, never what you typed or what's on your screen. It pauses during breaks. Tap it any time to see exactly what's tracked.",show:()=>tourRoom('a')},
 {sel:'.fs-side .panel',title:'Your task, out in the open',text:'Declare one task when you join and mark parts done as you go. A check-in halfway through keeps you on track.',show:()=>tourRoom('a')},
 {sel:'.modal .drop',modal:'wrap',title:'Proof at the end of each sprint',text:"When the sprint ends, you upload proof of your work. A quick check (simulated in this prototype) summarizes the file and confirms it matches your task. Only you see the file. Without proof, the sprint won't count in your log.",show:tourWrap},
 {sel:'.modal .reveal-list',narrow:'.modal .proof-warn',modal:'reveal',title:'Results, revealed together',text:"The session waits until everyone has shared. Then the room sees each person's result and whether their proof was checked. If someone skips proof, everyone is told, and that sprint won't count in their log.",show:tourReveal},
 {sel:'.fs-side .panel:last-child',title:'Safety built in',text:'Flag anyone who breaks the room rules, and the rest of the room votes on removing them.',show:()=>tourRoom('a')},
 {sel:'.stage',title:'Study sessions share a screen',text:'A host shares the problem set while everyone works on their own. The host role rotates each block.',show:()=>tourRoom('d')},
 {sel:'#qpanel',title:'Talk in turns',text:'In the discussion round, raise your hand to join the queue. Your mic turns on only for your own turn.',show:()=>tourRoom('d')},
 {sel:'.stats',title:'Your private log',text:'Your streak, sessions, and active time are visible only to you. There are no leaderboards.',show:()=>{tourSignIn();tourGo('log');}},
 {title:"That's the tour",text:'Open the feature map to see every feature with a “Show me” button, or explore the app on your own from the home page. You can replay this tour from the feature map.'}
];
let tourI=null,tourSaved=null,tourTimer=null;

function tourGo(p){if(page!==p)go(p);}
function tourSignIn(){verified=verified||TOUR_EMAIL;consented=true;}
function tourRoom(id){
  tourSignIn();if(S===tourSaved.S)S=null; // the tour uses its own sessions and leaves the visitor's alone
  if(S&&S.room&&S.room.id===id&&!S.ended)tourGo(S.kind==='study'?'ssession':'fsession');else quickJoin(id);
  S.autoChecked=true; // no check-in popping up mid-tour
}
/* Demo wrap-up and reveal: shown as dialogs only, nothing is written to the log. */
function tourWrap(){tourRoom('a');wrapPick='Completed';S.proof={stage:'done',pct:100,file:`${slug(S.task)}.jpg`,kind:'Photo of handwritten notes'};modalName='wrap';renderModal();}
function tourReveal(){
  tourRoom('a');const rows=peerRows(),skip=rows.filter(x=>x.proof)[1];if(skip)skip.proof=false;
  rows.push({you:true,name:'You',task:S.task,result:'Completed',shared:true,proof:true});
  S.results={rows,goal:[rows.filter(x=>x.result==='Completed').length,rows.length],revealed:true};modalName='reveal';renderModal();
}
function tourTarget(st){const sel=innerWidth<=650&&st.narrow||st.sel;return sel&&[...document.querySelectorAll(sel)].find(e=>e.getClientRects().length);} // narrow: smaller target on phones
function tourInert(on){document.querySelectorAll('body > *:not(#tour):not(script)').forEach(e=>e.inert=on);}

function startTour(){
  if(tourI!=null)return;
  tourSaved={S,verified,consented};closeModal();
  const root=document.createElement('div');root.className='tour';root.id='tour';
  root.innerHTML='<div class="tour-spot"></div><div class="tour-card glass" role="dialog" aria-modal="true" aria-labelledby="tourTitle" aria-describedby="tourText"></div>';
  root.addEventListener('mousedown',e=>{if(e.target===root)e.preventDefault();}); // clicking the dimmed page keeps focus on the card
  document.body.appendChild(root);tourInert(true);
  window.addEventListener('resize',tourPlace);window.addEventListener('scroll',tourPlace,{passive:true});
  tourTimer=setInterval(tourPlace,250); // follows re-renders and live layout changes
  tourI=0;tourShow();
}
function tourStep(d){tourI=Math.max(0,Math.min(TOUR.length-1,tourI+d));tourShow();}
function tourShow(){
  const st=TOUR[tourI],last=tourI===TOUR.length-1,n=TOUR.length-2;
  closeModal();if(st.show)st.show();
  const kicker=tourI===0?'Quick tour':last?'Tour complete':`Step ${tourI} of ${n}`;
  const foot=tourI===0?`<button class="tour-skip" onclick="endTour('welcome')">Skip, I'll explore</button>${btn('Start the tour','tourStep(1)','btn-primary','data-primary')}`
    :last?`<div class="end">${btn('Open the feature map',"endTour('map')",'btn-primary','data-primary')}${btn('Explore on my own',"endTour('welcome')",'btn-outline')}<button class="tour-skip" onclick="tourStep(-1)">Back</button></div>`
    :`<button class="tour-skip" onclick="endTour('welcome')">Skip tour</button><div style="display:flex;gap:8px">${btn('Back','tourStep(-1)','btn-light btn-sm')}${btn(tourI===n?'Finish':'Next','tourStep(1)','btn-primary btn-sm','data-primary')}</div>`;
  const card=document.querySelector('#tour .tour-card');
  card.innerHTML=`<div class="tour-body"><div class="kicker">${kicker}</div><h3 id="tourTitle">${st.title}</h3><p id="tourText">${st.text}</p>${tourI&&!last?`<div class="tour-progress"><div style="width:${tourI/n*100}%"></div></div>`:''}<div class="tour-foot">${foot}</div></div>`;
  const el=tourTarget(st);if(el)tourScroll(el,card.offsetHeight);
  tourPlace();card.querySelector('[data-primary]').focus({preventScroll:true});
}
function tourScroll(el,ch){
  if(el.closest('.overlay')){el.scrollIntoView({block:'nearest'});return;} // inside a dialog: scroll the dialog, not the page
  if(el.closest('.site-header,.tabbar'))return;
  const r=el.getBoundingClientRect(),head=document.querySelector('.site-header').getBoundingClientRect().bottom;
  const want=Math.max(head+16,(window.innerHeight-(r.height+30+ch))/2); // target plus card, centered, below the sticky header
  window.scrollTo(0,window.scrollY+r.top-want);
}
function tourPlace(){
  const root=document.getElementById('tour');if(!root)return;if(modalName&&modalName!==TOUR[tourI].modal)closeModal();
  const spot=root.querySelector('.tour-spot'),card=root.querySelector('.tour-card'),st=TOUR[tourI],el=tourTarget(st);card.style.width='';
  const vw=document.documentElement.clientWidth,vh=window.innerHeight,cw=card.offsetWidth,ch=card.offsetHeight,m=12;let x,y;
  if(!el){spot.classList.remove('on');Object.assign(spot.style,{left:vw/2+'px',top:vh/2+'px',width:'0px',height:'0px'});x=(vw-cw)/2;y=(vh-ch)/2;}
  else{
    const r=el.getBoundingClientRect(),p=8,t=Math.max(0,r.top-p),b=Math.min(vh,r.bottom+p),l=Math.max(0,r.left-p),rt=Math.min(vw,r.right+p);
    spot.classList.add('on');Object.assign(spot.style,{left:l+'px',top:t+'px',width:Math.max(0,rt-l)+'px',height:Math.max(0,b-t)+'px'});
    x=Math.min(Math.max(m,(l+rt)/2-cw/2),vw-cw-m);
    if(b+14+ch<=vh-m)y=b+14;else if(t-14-ch>=m)y=t-14-ch; // below, else above
    else if(Math.max(vw-rt,l)-14-m>=260){const right=vw-rt>=l,w=Math.min(cw,(right?vw-rt:l)-14-m);card.style.width=w+'px';const h=card.offsetHeight; // else beside, narrowed to fit
      x=right?rt+14:l-14-w;y=Math.min(Math.max(m,(t+b)/2-h/2),vh-h-m);}
    else y=vh-ch-m; // else pinned to the bottom
  }
  card.style.left=x+'px';card.style.top=Math.max(m,y)+'px';
}
function endTour(dest){
  clearInterval(tourTimer);window.removeEventListener('resize',tourPlace);window.removeEventListener('scroll',tourPlace);
  document.getElementById('tour')?.remove();tourInert(false);
  const sv=tourSaved;tourI=null;tourSaved=null;
  S=sv.S;verified=sv.verified;consented=sv.consented; // drop the demo sign-in and sample sessions
  go(dest);
}
window.addEventListener('keydown',e=>{if(tourI==null)return;
  if(e.key==='Escape')endTour('welcome');
  else if(e.key==='ArrowRight'&&tourI<TOUR.length-1)tourStep(1);
  else if(e.key==='ArrowLeft'&&tourI>0)tourStep(-1);});
