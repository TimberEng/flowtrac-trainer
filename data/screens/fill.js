/* =====================================================================
   Panel 2.2 — Fill (Section 2.1.2.2). Filling the flow pump cylinder
   requires the Supply Valve to already be open (Position > Control
   Valves) — water is drawn in from the external supply through the
   Supply port. Same "valve must already be open" rule as Empty (2.1),
   Initialize (2.3) and Jog (2.4).
   ===================================================================== */
(function(){
  let note = "";
  Screens.register("2.2", {
    render(state){
      if(isMotionRunning() && state.flowIn){
        return [ "Fill", "Filling...", "Cylinder: "+state.cylinderPct+"% full", "Press any key to stop" ];
      }
      const status = state.cylinderPct===100 ? "Pump is full." : "Cylinder: "+state.cylinderPct+"% full";
      return [ "Fill", note || "Ent = start filling", status, "" ];
    },
    key(k, state){
      if(isMotionRunning()){ stopMotion(); note=""; return; }
      if(k!=="Ent") return;
      if(state.supplyValve!=="open"){ note="Supply Valve is closed — open it"; return; }
      note = "";
      runMotion("fill", 100);
    },
    stop(){ stopMotion(); note=""; },
    help:`<h3>Fill</h3>
      <p>Fills the flow pump cylinder. The <b>Supply Valve</b> must already
      be open (use <b>Position &rarr; Control Valves</b>) &mdash; water is
      drawn in from the external supply through the Supply port.</p>
      <p class="muted">Real hardware note: the tubing on the Supply port
      must be in a container of water, or the cylinder fills with air.</p>
      <ul class="keyhelp">
        <li><kbd>Ent</kbd><span>Start filling</span></li>
        <li><kbd>any key</kbd><span>Stop the motion early</span></li>
        <li><kbd>Esc</kbd><span>Back to the Position menu</span></li>
      </ul>`,
  });
})();
