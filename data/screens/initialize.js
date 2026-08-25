/* =====================================================================
   Panel 2.3 — Initialize (Section 2.1.2.3). Empties the cylinder
   completely, then reverses and fills it to 50% capacity — used only
   when the FlowTrac unit isn't under computer control. Since it moves
   water both out and in, both the Output and Supply valves must already
   be open first (same rule as Empty/Fill/Jog).
   ===================================================================== */
(function(){
  let note = "";
  Screens.register("2.3", {
    render(state){
      if(isMotionRunning()){
        const phase = state.flowOut ? "Emptying..." : "Filling to 50%...";
        return [ "Initialize", phase, "Cylinder: "+state.cylinderPct+"% full", "Press any key to stop" ];
      }
      return [ "Initialize", note || "Ent = empty, then fill to 50%", "Cylinder: "+state.cylinderPct+"% full", "" ];
    },
    key(k, state){
      if(isMotionRunning()){ stopMotion(); note=""; return; }
      if(k!=="Ent") return;
      const missing=[];
      if(state.outputValve!=="open") missing.push("Output");
      if(state.supplyValve!=="open") missing.push("Supply");
      if(missing.length){ note=missing.join(" & ")+" Valve closed — open it"; return; }
      note = "";
      runMotion("empty", 0, ()=> runMotion("fill", 50));
    },
    stop(){ stopMotion(); note=""; },
    help:`<h3>Initialize</h3>
      <p>Empties the cylinder completely, then refills it to 50% capacity.
      Used only when the FlowTrac unit isn't being run by a computer.
      Both the <b>Output</b> and <b>Supply</b> valves must already be open
      (Position &rarr; Control Valves) before starting.</p>
      <ul class="keyhelp">
        <li><kbd>Ent</kbd><span>Start initializing</span></li>
        <li><kbd>any key</kbd><span>Stop the motion early</span></li>
        <li><kbd>Esc</kbd><span>Back to the Position menu</span></li>
      </ul>`,
  });
})();
