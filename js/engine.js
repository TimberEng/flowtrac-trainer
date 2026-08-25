/* =====================================================================
   ENGINE — screen registry, device state, nav stack, key dispatch,
   and the top-level render loop. Depends on the menu tree (data/menu.js)
   and LCD helpers (js/device.js) only at call time, so load order with
   those files is flexible; this file must load before any
   data/screens/*.js so Screens.register() has something to call.
   ===================================================================== */

/* ---- screen registry — the single extension point for captured panels ---- */
const Screens = (function(){
  const registry = {};
  return {
    register(code, def){ registry[code] = def; },
    get(code){ return registry[code]; },
  };
})();

/* ---- device state: single source of truth ---- */
const state = {
  power:{motor:true, cpu:true},
  net:{tx:false, rx:false},
  limitEmpty:false, limitFull:false, flowOut:false, flowIn:false,
  outputValve:"closed",   // "open" | "closed"
  supplyValve:"closed",
  cylinderPct: Math.floor(Math.random()*101), // flow pump cylinder fill level, 0-100%, reseeded on every page load
};

/* ---- shared motor-motion helper — used by Empty/Fill/Initialize/Jog.
   Animates state.cylinderPct toward a target, ticking state.flowOut /
   state.flowIn (and the limit switches) along the way, so the LEDs and
   the hydraulics diagram follow real, interruptible motion instead of an
   instant jump. Any screen that starts motion should stop it in its
   `stop()` hook so navigating away (Esc/Menu) doesn't leave it running. */
let motionTimer = null;
function isMotionRunning(){ return motionTimer !== null; }
function syncLimits(){ state.limitEmpty = state.cylinderPct<=0; state.limitFull = state.cylinderPct>=100; }
function stopMotion(){
  if(motionTimer){ clearInterval(motionTimer); motionTimer=null; }
  state.flowOut=false; state.flowIn=false;
}
function runMotion(dir, target, onDone){        // dir: "empty" (draining) | "fill" (filling)
  stopMotion();
  state.flowOut = dir==="empty"; state.flowIn = dir==="fill";
  const step = 4;                               // percent per tick — a few seconds end to end
  motionTimer = setInterval(()=>{
    state.cylinderPct = dir==="empty"
      ? Math.max(target, state.cylinderPct-step)
      : Math.min(target, state.cylinderPct+step);
    syncLimits();
    if(state.cylinderPct===target){ stopMotion(); onDone && onDone(); }
    render(); afterInput();   // let guided-lesson steps advance live as the level moves
  }, 150);
}
syncLimits();

/* ---- navigation ---- */
let stack = [""];                       // navigation stack of codes
const sel = {};                         // menu code -> selected index
const visited = new Set();              // codes ever reached (for lessons)
const current = () => stack[stack.length-1];

function leaveCurrentScreen(){
  const screen = Screens.get(current());
  if(screen && screen.stop) screen.stop(state);
}
function go(code){ stack.push(code); sel[code]=sel[code]||0; visited.add(code); render(); afterInput(); }
function back(){ leaveCurrentScreen(); if(stack.length>1) stack.pop(); render(); afterInput(); }
function home(){ leaveCurrentScreen(); stack=[""]; render(); afterInput(); }

function press(k){
  const code = current();
  if(k==="Menu"){ home(); return; }

  const screen = Screens.get(code);
  if(screen){
    if(k==="Esc"){ back(); return; }
    screen.key && screen.key(k, state);
    render(); afterInput(); return;
  }

  const node = nodeByCode[code];
  if(node && node.children){                     // menu screen — number-selected, like the hardware
    if(k==="Esc") back();
    else if(/^[0-9]$/.test(k)){ const i=+k-1; if(i>=0 && i<node.children.length) go(node.children[i].code); }
    afterInput();
    return;
  }
  /* stub leaf */
  if(k==="Esc") back();
}

/* ---- menu -> LCD lines (two-column, matching the real display) ----
   From position.jpeg: a title line, then items numbered "N. Label" that
   fill the LEFT column top-to-bottom, then continue down the RIGHT column.
   A title + 3 rows holds up to 6 items; longer menus drop the title for
   a 4th row (up to 8 items). Selection is by number key, like the hardware. */
function menuLines(node, code){
  const items = node.children;
  const useTitle = items.length <= 6;
  const rows = useTitle ? 3 : 4;
  const out = [];
  if(useTitle) out.push(code === "" ? "Main Menu" : node.label);
  for(let r = 0; r < rows; r++){
    const li = r, ri = rows + r;
    const left  = li < items.length ? (li+1) + ". " + items[li].label : "";
    const right = ri < items.length ? (ri+1) + ". " + items[ri].label : "";
    out.push(col2(left, right));
  }
  while(out.length < ROWS) out.push("");
  return out.slice(0, ROWS);
}

/* ---- screen -> LCD lines ---- */
function screenLines(){
  const code = current();
  const screen = Screens.get(code);
  if(screen) return { lines: screen.render(state).map(pad), active:-1 };

  const node = nodeByCode[code];
  if(node && node.children) return { lines: menuLines(node, code).map(pad), active:-1 };

  /* stub */
  return { lines:[ pad(node?node.label:""), pad(""), pad("Panel not captured yet."), pad("Esc = back") ], active:-1 };
}

/* =====================================================================
   RENDER LOOP — fans out to device.js (LCD/LEDs) and ui.js (crumb/help)
   ===================================================================== */
function render(){
  const {lines, active} = screenLines();
  renderLCD(lines, active);
  renderLEDs();
  renderHydraulics();
  renderCrumb();
  renderHelp();
}
