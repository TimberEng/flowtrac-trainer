/* =====================================================================
   FlowTrac-II menu tree — the firmware menu structure, indexed by code.
   ===================================================================== */
const MONITOR = { code:"1", label:"Monitor", children:[
  { code:"1.1", label:"System" }, { code:"1.2", label:"Debug" },
  { code:"1.3", label:"A/D" }, { code:"1.4", label:"Network" },
  { code:"1.5", label:"Encoder" },
]};
const POSITION = { code:"2", label:"Position", children:[
  { code:"2.1", label:"Empty" }, { code:"2.2", label:"Fill" },
  { code:"2.3", label:"Initialize" }, { code:"2.4", label:"Jog" },
  { code:"2.5", label:"Control Valves" },
]};
const CONTROL = { code:"3", label:"Control", children:[
  { code:"3.1", label:"Ramp Pressure", children:[
    {code:"3.1.1",label:"Pressure Rate"},{code:"3.1.2",label:"Final Pressure"},
    {code:"3.1.3",label:"Maximum Flow"},{code:"3.1.4",label:"Sampling Period"},
    {code:"3.1.5",label:"View Settings"},{code:"3.1.6",label:"Start"} ]},
  { code:"3.2", label:"Cyclic Pressure", children:[
    {code:"3.2.1",label:"Seating Pressure"},{code:"3.2.2",label:"Pressure Amplitude"},
    {code:"3.2.3",label:"Cycle Period"},{code:"3.2.4",label:"Sampling Period"},
    {code:"3.2.5",label:"View Settings"},{code:"3.2.6",label:"Start"} ]},
  { code:"3.3", label:"Ramp Flow", children:[
    {code:"3.3.1",label:"Flow Rate"},{code:"3.3.2",label:"Final Flow"},
    {code:"3.3.3",label:"Maximum Pressure"},{code:"3.3.4",label:"Sampling Period"},
    {code:"3.3.5",label:"View Settings"},{code:"3.3.6",label:"Start"} ]},
  { code:"3.4", label:"Cyclic Flow", children:[
    {code:"3.4.1",label:"Seating Flow"},{code:"3.4.2",label:"Flow Amplitude"},
    {code:"3.4.3",label:"Cycle Period"},{code:"3.4.4",label:"Sampling Period"},
    {code:"3.4.5",label:"View Settings"},{code:"3.4.6",label:"Start"} ]},
]};
const SETUP = { code:"4", label:"Setup", children:[
  { code:"4.1", label:"System", children:[
    {code:"4.1.1",label:"A/D Channels"},{code:"4.1.2",label:"Units"},
    {code:"4.1.3",label:"Restart"},{code:"4.1.4",label:"Save/Restore"},
    {code:"4.1.5",label:"Firmware Update"},{code:"4.1.6",label:"Revision"} ]},
  { code:"4.2", label:"Network", children:[ {code:"4.2.1",label:"Node ID Setup"} ]},
  { code:"4.3", label:"A/D", children:[ {code:"4.3.1",label:"Channel X"} ]},
  { code:"4.4", label:"PID", children:[
    {code:"4.4.1",label:"P-Gain"},{code:"4.4.2",label:"I-Gain"},{code:"4.4.3",label:"D-Gain"},
    {code:"4.4.4",label:"V-Offset"},{code:"4.4.5",label:"I-Limit"},{code:"4.4.6",label:"V-Limit"},
    {code:"4.4.7",label:"Dither Ampl."},{code:"4.4.8",label:"Dither Freq."} ]},
  { code:"4.5", label:"Motor", children:[
    {code:"4.5.1",label:"Frequency"},{code:"4.5.2",label:"Acceleration"},
    {code:"4.5.3",label:"Step Capacity"},{code:"4.5.4",label:"Step Factor"} ]},
]};
const TREE = { code:"", label:"Main Menu", children:[MONITOR, POSITION, CONTROL, SETUP] };

/* index every node by code */
const nodeByCode = {};
(function index(n){ nodeByCode[n.code]=n; (n.children||[]).forEach(index); })(TREE);

/* help text for menu screens (optional, keyed by code) */
const DESCRIPTIONS = {
  "":  "Top level. Pick a section to begin.",
  "1": "Live readouts — system status, sensor channels, network and encoder.",
  "2": "Move the piston and drive the valves: empty, fill, initialise, jog, and manual valve control.",
  "3": "Run automated tests — ramp or cycle either pressure or flow.",
  "4": "Configure the instrument: units, network, sensor channels, PID tuning and motor.",
};
