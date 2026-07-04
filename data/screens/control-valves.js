/* =====================================================================
   Panel 2.5 — Control Valves (captured from the real display)
   One file per captured panel. Self-registers into the global Screens
   registry; index.html needs one <script> line and nothing else changes.
   ===================================================================== */
Screens.register("2.5", {
  render(state){
    const o = state.outputValve, s = state.supplyValve;
    return [
      col2("Output Valve","Supply Valve"),
      col2("1. Open","3. Open"),
      col2("2. Close","4. Close"),
      col2("Valve is "+o, "Valve is "+s),
    ];
  },
  key(k, state){
    if(k==="1") state.outputValve="open";
    else if(k==="2") state.outputValve="closed";
    else if(k==="3") state.supplyValve="open";
    else if(k==="4") state.supplyValve="closed";
  },
  help:`<h3>Control Valves</h3>
    <p>Manually open or close the two valves. Watch the <b>Output Valve</b> and
    <b>Supply Valve</b> lights on the panel change as you do.</p>
    <ul class="keyhelp">
      <li><kbd>1</kbd><span>Open the output valve</span></li>
      <li><kbd>2</kbd><span>Close the output valve</span></li>
      <li><kbd>3</kbd><span>Open the supply valve</span></li>
      <li><kbd>4</kbd><span>Close the supply valve</span></li>
      <li><kbd>Esc</kbd><span>Back to the Position menu</span></li>
    </ul>`,
});
