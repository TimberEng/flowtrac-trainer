/* =====================================================================
   DEVICE — LCD grid, keypad, and LED bank rendering.
   ===================================================================== */

/* ---- LCD geometry: 4 lines x 40 characters, monospace ---- */
const COLS = 40, ROWS = 4;
const pad = s => (s + " ".repeat(COLS)).slice(0, COLS);
const col2 = (l,r) => pad(pad(l).slice(0,20) + r);   /* two-column line */

const lcdEl=document.getElementById("lcd");
function renderLCD(lines, active){
  lcdEl.innerHTML = lines.map((t,i)=>
    `<div class="ln${i===active?" active":""}">${t.replace(/ /g," ")}</div>`).join("");
}

/* ---- LED bank ---- */
const ledsEl=document.getElementById("leds");
const LEDS = {
  left:[ {id:"motor",label:"Motor Power",c:"#35b26a"},{id:"cpu",label:"CPU Power",c:"#35b26a"},
         {id:"tx",label:"Net Tx",c:"#d8a13a"},{id:"rx",label:"Net Rx",c:"#d8a13a"} ],
  right:[ {id:"limitEmpty",label:"Limit Empty",c:"#d1493f"},{id:"flowOut",label:"Flow Out ↑",c:"#35b26a"},
          {id:"flowIn",label:"Flow In ↓",c:"#35b26a"},{id:"limitFull",label:"Limit Full",c:"#d1493f"},
          {id:"outputValve",label:"Output Valve",c:"#35b26a"},{id:"supplyValve",label:"Supply Valve",c:"#35b26a"} ],
};
function lit(id){
  switch(id){
    case "motor": return state.power.motor; case "cpu": return state.power.cpu;
    case "tx": return state.net.tx; case "rx": return state.net.rx;
    case "limitEmpty": return state.limitEmpty; case "limitFull": return state.limitFull;
    case "flowOut": return state.flowOut; case "flowIn": return state.flowIn;
    case "outputValve": return state.outputValve==="open";
    case "supplyValve": return state.supplyValve==="open";
  }
  return false;
}
function renderLEDs(){
  const cell = L => `<div class="led${lit(L.id)?" on":""}" style="--_c:${L.c}"><i></i>${L.label}</div>`;
  /* interleave columns so the CSS grid lays them out left/right */
  let html="";
  const n=Math.max(LEDS.left.length, LEDS.right.length);
  for(let i=0;i<n;i++){
    html += LEDS.left[i]?cell(LEDS.left[i]):"<div></div>";
    html += LEDS.right[i]?cell(LEDS.right[i]):"<div></div>";
  }
  ledsEl.innerHTML=html;
}

/* ---- hydraulic circuit diagram: supply tank, cylinder, output ----
   Supply is drawn as always full (unlimited). The cylinder fill level
   comes from state.cylinderPct (randomised once per page load, then
   driven for real by Empty/Fill/Initialize/Jog — see engine.js's
   runMotion). The valve circle/colour reflects valve position
   (outputValve open/closed); the animated flow-dot on each link
   reflects actual water movement (state.flowOut/flowIn) — a valve can
   be open with nothing moving, just like on the real unit. */
const cylWaterEl=document.getElementById("cylWater");
const cylPctEl=document.getElementById("cylPct");
const outputShapeEl=document.getElementById("outputShape");
const outputSubEl=document.getElementById("outputSub");
const linkSupplyEl=document.getElementById("linkSupply");
const linkOutputEl=document.getElementById("linkOutput");
const valveSupplyEl=document.getElementById("valveSupply");
const valveOutputEl=document.getElementById("valveOutput");

function renderHydraulics(){
  cylWaterEl.style.height = state.cylinderPct + "%";
  cylPctEl.textContent = state.cylinderPct;

  const outOpen = state.outputValve === "open";
  outputShapeEl.classList.toggle("open", outOpen);
  outputSubEl.textContent = state.flowOut ? "draining to test cell"
    : outOpen ? "valve open — to test cell" : "to test cell — valve closed";
  linkOutputEl.classList.toggle("flowing", state.flowOut);
  valveOutputEl.classList.toggle("open", outOpen);

  const supOpen = state.supplyValve === "open";
  linkSupplyEl.classList.toggle("flowing", state.flowIn);
  valveSupplyEl.classList.toggle("open", supOpen);
}

/* =====================================================================
   KEYPAD  (4 cols x 5 rows, matching the hardware)
   ===================================================================== */
const KEYS = [
  ["7","8","9",{k:"Esc",fn:1}],
  ["4","5","6",{k:"Ent",fn:1}],
  ["1","2","3",{k:"Up",fn:1,lbl:"↑"}],
  [{k:"-"},"0",{k:"."},{k:"Down",fn:1,lbl:"↓"}],
  [{k:"Menu",fn:1},{k:"Left",fn:1,lbl:"←"},{k:"Right",fn:1,lbl:"→"},{k:"Alt",fn:1}],
];
const keypadEl=document.getElementById("keypad");
const keyBtns={};
KEYS.flat().forEach(spec=>{
  const key = typeof spec==="string" ? spec : spec.k;
  const lbl = typeof spec==="string" ? spec : (spec.lbl||spec.k);
  const b=document.createElement("button");
  b.className="key"+(typeof spec==="object"&&spec.fn?" fn":"");
  b.textContent=lbl; b.dataset.key=key;
  b.setAttribute("aria-label",key);
  b.addEventListener("click",()=>{ flash(key); press(key); });
  keypadEl.appendChild(b);
  keyBtns[key]=b;
});
function flash(key){
  const b=keyBtns[key]; if(!b) return;
  b.classList.add("flash"); setTimeout(()=>b.classList.remove("flash"),110);
}

/* keyboard mapping */
const KB = {"Enter":"Ent","Escape":"Esc","ArrowUp":"Up","ArrowDown":"Down",
  "ArrowLeft":"Left","ArrowRight":"Right"};
document.addEventListener("keydown",e=>{
  let k=null;
  if(/^[0-9]$/.test(e.key)) k=e.key;
  else if(e.key==="."||e.key==="-") k=e.key;
  else if(KB[e.key]) k=KB[e.key];
  else if(e.key==="m"||e.key==="M") k="Menu";
  else if(e.key==="a"||e.key==="A") k="Alt";
  if(k){ e.preventDefault(); flash(k); press(k); }
});
