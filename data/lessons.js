/* =====================================================================
   Guided lessons — self-check against nav history (`visited`) and
   device `state`, both defined in js/engine.js.
   ===================================================================== */
const LESSONS = [
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
];
