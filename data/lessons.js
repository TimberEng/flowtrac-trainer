/* =====================================================================
   Guided lessons — self-check against nav history (`visited`) and
   device `state`, both defined in js/engine.js.
   ===================================================================== */
const LESSONS = [
  {
    id:"tour",
    title:"Tour the four sections",
    blurb:"Visit Monitor, Position, Control and Setup from the Main Menu, then jump straight back home.",
    steps:[
      { t:"From the Main Menu, open <b>Monitor</b> (press 1).", done:()=>visited.has("1") },
      { t:"Press <b>Esc</b>, then open <b>Position</b> (press 2).", done:()=>visited.has("2") },
      { t:"Press <b>Esc</b>, then open <b>Control</b> (press 3).", done:()=>visited.has("3") },
      { t:"Press <b>Esc</b>, then open <b>Setup</b> (press 4).", done:()=>visited.has("4") },
      { t:"Press <b>Menu</b> to jump straight back to the Main Menu from anywhere.", done:()=>current()==="" },
    ],
  },
  {
    id:"monitor-tour",
    title:"Check status via Monitor",
    blurb:"Walk through every Monitor screen — this is what you check before touching anything else.",
    steps:[
      { t:"From the Main Menu, open <b>Monitor</b> (press 1).", done:()=>visited.has("1") },
      { t:"Open <b>System</b> (press 1).", done:()=>visited.has("1.1") },
      { t:"Press <b>Esc</b>, then open <b>Debug</b> (press 2).", done:()=>visited.has("1.2") },
      { t:"Press <b>Esc</b>, then open <b>A/D</b> (press 3).", done:()=>visited.has("1.3") },
      { t:"Press <b>Esc</b>, then open <b>Network</b> (press 4).", done:()=>visited.has("1.4") },
      { t:"Press <b>Esc</b>, then open <b>Encoder</b> (press 5).", done:()=>visited.has("1.5") },
    ],
  },
  {
    id:"setup-tour",
    title:"Know what's safe in Setup",
    blurb:"Tour System, Network, A/D, PID and Motor. Most of Setup is factory-tuned — this is about learning which corner you're in.",
    steps:[
      { t:"From the Main Menu, open <b>Setup</b> (press 4).", done:()=>visited.has("4") },
      { t:"Open <b>System</b> (press 1) — Units and Node ID here are safe to change.", done:()=>visited.has("4.1") },
      { t:"Press <b>Esc</b>, then open <b>Network</b> (press 2).", done:()=>visited.has("4.2") },
      { t:"Press <b>Esc</b>, then open <b>A/D</b> (press 3) — only Factor/Offset should ever be touched, and only after calibration.", done:()=>visited.has("4.3") },
      { t:"Press <b>Esc</b>, then open <b>PID</b> (press 4) — factory-tuned; consult Geocomp before changing anything here.", done:()=>visited.has("4.4") },
      { t:"Press <b>Esc</b>, then open <b>Motor</b> (press 5) — Frequency, Acceleration, Step Capacity and Step Factor are all factory-set.", done:()=>visited.has("4.5") },
    ],
  },
  {
    id:"valves",
    title:"Operate the control valves",
    blurb:"Find the Control Valves panel, open both valves, then close them again. Watch the panel lights follow along.",
    steps:[
      { t:"From the Main Menu, open <b>Position</b> (press 2).", done:()=>visited.has("2") },
      { t:"Open <b>Control Valves</b> (press 5).", done:()=>visited.has("2.5") },
      { t:"Open the output valve (press 1).", done:()=>state.outputValve==="open" },
      { t:"Open the supply valve (press 3).", done:()=>state.supplyValve==="open" },
      { t:"Close both valves (press 2, then 4).", done:()=>state.outputValve==="closed"&&state.supplyValve==="closed" },
    ],
  },
  {
    id:"priming",
    title:"Prime the pump: Empty, Fill, Initialize",
    blurb:"Practice the interlock every water-moving screen shares: draining needs the Output Valve open, filling needs the Supply Valve open.",
    steps:[
      { t:"Open <b>Position</b> (press 2).", done:()=>visited.has("2") },
      { t:"Open <b>Control Valves</b> (press 5) and open the output valve (press 1).", done:()=>state.outputValve==="open" },
      { t:"Press <b>Esc</b>, open <b>Empty</b> (press 1), then press <b>Ent</b> to drain the cylinder to 0%.", done:()=>state.cylinderPct===0 },
      { t:"Press <b>Esc</b> back to Position, open <b>Control Valves</b> (press 5) and open the supply valve (press 3).", done:()=>state.supplyValve==="open" },
      { t:"Press <b>Esc</b>, open <b>Fill</b> (press 2), then press <b>Ent</b> to fill the cylinder to 100%.", done:()=>state.cylinderPct===100 },
      { t:"Press <b>Esc</b> back to Position, open <b>Initialize</b> (press 3), then press <b>Ent</b> — it drains, then refills to 50%.", done:()=>state.cylinderPct===50 },
    ],
  },
  {
    id:"jog",
    title:"Jog the piston",
    blurb:"Jog moves the piston directly. Up empties (needs the Output Valve open); Down fills (needs the Supply Valve open) — same interlock as Empty/Fill.",
    steps:[
      { t:"Open <b>Position</b> (press 2), then <b>Jog</b> (press 4).", done:()=>visited.has("2.4") },
      { t:"Press <b>Esc</b>, open <b>Control Valves</b> (press 5) and open the output valve (press 1).", done:()=>state.outputValve==="open" },
      { t:"Press <b>Esc</b> back to Position, reopen <b>Jog</b> (press 4), then press <b>&uarr;</b> to empty the cylinder to 0%.", done:()=>state.cylinderPct===0 },
      { t:"Press <b>Esc</b>, open <b>Control Valves</b> (press 5) and open the supply valve (press 3).", done:()=>state.supplyValve==="open" },
      { t:"Press <b>Esc</b> back to Position, reopen <b>Jog</b> (press 4), then press <b>&darr;</b> to fill the cylinder to 100%.", done:()=>state.cylinderPct===100 },
    ],
  },
  {
    id:"control-tour",
    title:"Tour the Ramp Pressure sub-menu",
    blurb:"Ramp Pressure, Cyclic Pressure, Ramp Flow and Cyclic Flow all share this same 6-item shape — learn one and you know all four.",
    steps:[
      { t:"From the Main Menu, open <b>Control</b> (press 3), then <b>Ramp Pressure</b> (press 1).", done:()=>visited.has("3.1") },
      { t:"Open <b>Pressure Rate</b> (press 1).", done:()=>visited.has("3.1.1") },
      { t:"Press <b>Esc</b>, then open <b>Final Pressure</b> (press 2).", done:()=>visited.has("3.1.2") },
      { t:"Press <b>Esc</b>, then open <b>Maximum Flow</b> (press 3).", done:()=>visited.has("3.1.3") },
      { t:"Press <b>Esc</b>, then open <b>Sampling Period</b> (press 4).", done:()=>visited.has("3.1.4") },
      { t:"Press <b>Esc</b>, then open <b>View Settings</b> (press 5).", done:()=>visited.has("3.1.5") },
      { t:"Press <b>Esc</b>, then open <b>Start</b> (press 6) — these panels aren't captured yet, but Cyclic Pressure, Ramp Flow and Cyclic Flow all look exactly like this.", done:()=>visited.has("3.1.6") },
    ],
  },
];
