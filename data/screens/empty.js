/* =====================================================================
   Panel 2.1 — Empty (Section 2.1.2.1). Draining the flow pump cylinder
   requires the Output Valve to already be open (Position > Control
   Valves) — the piston pushes water out through the Output port. This
   mirrors the manual's caution for Jog (2.1.2.4) and keeps the "the
   valve must already be open" rule consistent across every operation
   that moves water.
   ===================================================================== */
(function(){
  let note = "";
  Screens.register("2.1", {
    render(state){
      if(isMotionRunning() && state.flowOut){
        return [ "Empty", "Emptying...", "Cylinder: "+state.cylinderPct+"% full", "Press any key to stop" ];
      }
      const status = state.cylinderPct===0 ? "Pump is empty." : "Cylinder: "+state.cylinderPct+"% full";
      return [ "Empty", note || "Ent = start emptying", status, "" ];
    },
    key(k, state){
      if(isMotionRunning()){ stopMotion(); note=""; return; }
      if(k!=="Ent") return;
      if(state.outputValve!=="open"){ note="Output Valve is closed — open it"; return; }
      note = "";
      runMotion("empty", 0);
    },
    stop(){ stopMotion(); note=""; },
    help:`<h3>Empty</h3>
      <p>Drains the flow pump cylinder. The <b>Output Valve</b> must already
      be open (use <b>Position &rarr; Control Valves</b>) &mdash; the piston
      pushes water out through the Output port to the test cell.</p>
      <ul class="keyhelp">
        <li><kbd>Ent</kbd><span>Start emptying</span></li>
        <li><kbd>any key</kbd><span>Stop the motion early</span></li>
        <li><kbd>Esc</kbd><span>Back to the Position menu</span></li>
      </ul>`,
  });
})();
