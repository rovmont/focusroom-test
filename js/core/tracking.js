/* ---------- activity tracking (cursor + typing) ----------
   Only counts THAT input happened. Key values are never read. */
const track={last:Date.now(),kind:'cursor'};
let lastMove=0;
document.addEventListener('keydown',()=>{track.last=Date.now();track.kind='typing';},true);
document.addEventListener('pointermove',()=>{const n=Date.now();if(n-lastMove>250){lastMove=n;const gap=n-track.last;track.last=n;if(track.kind!=='typing'||gap>2000)track.kind='cursor';}},true);
document.addEventListener('pointerdown',()=>{track.last=Date.now();track.kind='cursor';},true);
document.addEventListener('wheel',()=>{track.last=Date.now();track.kind='cursor';},{capture:true,passive:true});
function idleSecs(){return Math.floor((Date.now()-track.last)/1000);}
function myAct(){const s=idleSecs();return s<IDLE_AFTER?track.kind:s<AWAY_AFTER?'idle':'away';}
function trackingOn(){return S&&S.room&&isWorking(S.room)&&!S.ended;}
