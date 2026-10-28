/* ---------- shared data ---------- */
const TIERS={must:'Must',should:'Should',could:'Could',wont:"Won't"};
function tier(t){return '';}
const TAGS=['Computer Science','Engineering','Psychology','Nursing','Thesis','Board exam review'];
const POOL=[['Alex J.','AJ','av-blue'],['Max L.','ML','av-peach'],['Rae C.','RC','av-lilac'],['Bea T.','BT','av-mint'],['Jon P.','JP','av-sun'],['Kai S.','KS','av-sea'],['Mia D.','MD','av-rose']];
const TASKS=['Stats problem set 6','Read chapter 4 notes','Draft methods section','30 board review items','Lab report intro','Gantt chart drills','Pharmacology flashcards','Fix thesis references','Calculus worksheet 3'];
const QUESTIONS=['Is SJF preemptive by default?','When do I use a two-tailed test?','How do I cite a secondary source?','Why is option C wrong on item 14?','Can someone check my Gantt chart?'];
const REACTIONS=[['thumb','Keep going'],['coffee','Take a break'],['sparkle','Nice work'],['flame','On a roll']];
const BREAK_LEN=5*60;
const IDLE_AFTER=10, AWAY_AFTER=45; // seconds, shortened for the demo (real app: 1 and 5 minutes)

let rooms=[
 {id:'a',kind:'focus',name:'Library Sprint',len:25,phase:'focus',remain:18*60+25,count:4,capacity:6,desc:'Quiet accountability for reading, writing, and assignments.',tags:['Computer Science','Psychology']},
 {id:'b',kind:'focus',name:'Deep Work Block',len:50,phase:'break',remain:3*60+10,count:5,capacity:6,desc:'Longer sprints for projects and exam prep. On a shared break right now.',tags:['Engineering','Thesis']},
 {id:'e',kind:'focus',name:'Thesis Writing Hour',len:50,phase:'lobby',remain:0,count:2,capacity:6,subject:'Chapter drafts',desc:'Starts together as soon as 3 students are ready.',tags:['Thesis']},
 {id:'c',kind:'study',name:'Peer Study Circle',len:40,disc:10,phase:'discuss',remain:6*60+30,count:4,capacity:6,subject:'Psych stats · hypothesis testing',desc:'Solo work blocks, then a turn-based discussion round.',tags:['Psychology','Nursing'],video:false,screen:'stats'},
 {id:'d',kind:'study',name:'OS Scheduling Review',len:50,disc:10,phase:'work',remain:22*60+5,count:4,capacity:8,subject:'CPU scheduling',desc:'The host shares the problem set. Questions wait for the discussion round.',tags:['Computer Science'],video:true,screen:'os'},
 {id:'f',kind:'study',name:'Board Exam Circle',len:25,disc:10,phase:'work',remain:9*60+40,count:3,capacity:6,subject:'Review questions',desc:'Short work blocks, then the group goes through the hard items.',tags:['Nursing','Board exam review','Engineering'],video:false,screen:'board'}
];
rooms.forEach(r=>r.resources=[{t:r.kind==='study'?'Shared problem set':'Pomodoro tips',u:'https://example.org/'+(r.kind==='study'?'problem-set':'pomodoro'),by:'Alex J.'}]);

let verified=false,consented=false,page='welcome',S=null,filterTag='All',showTiers=true,pendingAfter=null,modalName='';
let profile={color:'av-you',acc:'',plus:false};
let wrapPick='',proofName='',proofUrl='',flagPick='',voteState=null,checkPick='',reactTarget=null,leaveTo='';
const today=new Date();
let log=[
 {d:-1,kind:'focus',room:'Library Sprint',task:'Read OS notes, chapter 4',result:'Completed',note:'Done with 3 of 5 sections',proof:true,min:25,active:84},
 {d:-1,kind:'study',room:'OS Scheduling Review',task:'Gantt chart drills',result:'Partially completed',note:'2 of 4 charts',proof:false,min:50,active:71},
 {d:-2,kind:'study',room:'Peer Study Circle',task:'Stats problem set 6',result:'Completed',note:'Finished 8 of 10',proof:true,min:40,active:78},
 {d:-3,kind:'focus',room:'Deep Work Block',task:'Draft related works',result:'Need more time',note:'1 paragraph in',proof:false,min:50,active:52},
 {d:-5,kind:'focus',room:'Library Sprint',task:'French vocab list',result:'Completed',note:'',proof:false,min:25,active:88}
];
