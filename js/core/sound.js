/* ---------- sound (ambient + finish chime) ---------- */
let AC=null,ambNodes=null,ambKind='off',chimeOn=true;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});return AC;}
document.addEventListener('pointerdown',()=>{if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});},true);
function setAmbient(kind){
  ambKind=kind;try{if(ambNodes){ambNodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}});ambNodes=null;}}catch(e){}
  if(kind==='off')return;const c=ac();if(!c)return;
  const len=2*c.sampleRate,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;if(kind==='rain'){d[i]=w*.5;}else{last=(last+.02*w)/1.02;d[i]=last*3.5;}}
  const src=c.createBufferSource();src.buffer=buf;src.loop=true;
  const f=c.createBiquadFilter();f.type=kind==='rain'?'bandpass':'lowpass';f.frequency.value=kind==='rain'?1800:kind==='cafe'?900:420;if(kind==='rain')f.Q.value=.6;
  const g=c.createGain();g.gain.value=kind==='rain'?.09:kind==='cafe'?.22:.14;
  src.connect(f).connect(g).connect(c.destination);src.start();ambNodes=[src,f,g];
}
function chime(){if(!chimeOn)return;const c=AC;if(!c||c.state!=='running')return;const t=c.currentTime;[[784,0],[1047,.14]].forEach(([fr,dt])=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=fr;g.gain.setValueAtTime(0,t+dt);g.gain.linearRampToValueAtTime(.12,t+dt+.02);g.gain.exponentialRampToValueAtTime(.001,t+dt+.6);o.connect(g).connect(c.destination);o.start(t+dt);o.stop(t+dt+.65);});}
