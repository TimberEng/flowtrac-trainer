/* =====================================================================
   Panel 2.4 — Jog (Section 2.1.2.4), simplified. The real hardware lets
   you dial in an exact steps/sec speed with the 0-4 keys plus the arrow
   keys; this trainer keeps the direction/valve interlock the manual's
   caution describes but moves the piston at one fixed rate:
     Up   = empties the cylinder — needs the Output Valve open
     Down = fills the cylinder   — needs the Supply Valve open
   "Either the Supply Valve or the Output Valve must be open before the
   Jog option is used. A warning message will be given on the LCD screen
   if [it isn't]." — same rule as Empty/Fill/Initialize.
   ===================================================================== */
(function(){
  let note = "";
  Screens.register("2.4", {
    render(state){
      if(isMotionRunning()){
        const dir = state.flowOut ? "Emptying (Up)..." : "Filling (Down)...";
        return [ "Jog", dir, "Cylinder: "+state.cylinderPct+"% full", "Press any key to stop" ];
      }
      return [ "Jog", note || "Up = empty, Down = fill", "Cylinder: "+state.cylinderPct+"% full", "" ];
    },
    key(k, state){
      if(isMotionRunning()){ stopMotion(); note=""; return; }
      if(k==="Up"){
        if(state.outputValve!=="open"){ note="Output Valve is closed — open it"; return; }
        note = ""; runMotion("empty", 0);
      } else if(k==="Down"){
        if(state.supplyValve!=="open"){ note="Supply Valve is closed — open it"; return; }
        note = ""; runMotion("fill", 100);
      }
    },
    stop(){ stopMotion(); note=""; },
    help:`<h3>Jog</h3>
      <p>Moves the piston directly. <b>Up</b> empties the cylinder (needs
      the Output Valve open); <b>Down</b> fills it (needs the Supply Valve
      open) &mdash; open one from <b>Position &rarr; Control Valves</b>
      first.</p>
      <p class="muted">Simplified: the real panel also lets you set an
      exact speed with the 0-4 keys before pressing an arrow.</p>
      <ul class="keyhelp">
        <li><kbd>↑</kbd><span>Start emptying</span></li>
        <li><kbd>↓</kbd><span>Start filling</span></li>
        <li><kbd>any key</kbd><span>Stop the motion early</span></li>
        <li><kbd>Esc</kbd><span>Back to the Position menu</span></li>
      </ul>`,
  });
})();
