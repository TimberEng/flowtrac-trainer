# FlowTrac-II Trainer

An interactive, browser-only training simulator for the **GeoComp FlowTrac-II**
pressure-volume controller. It reproduces the real front panel — a 4×40
character LCD, a 4×5 keypad, and a bank of indicator LEDs — so you can learn
the device's menu tree and behavior without touching the hardware.

Panels are captured from the real device incrementally, so the project is
built to make "add one more panel" a trivial, one-file change.

## Running it

No build step, no server, no dependencies.

- **Locally:** double-click [index.html](index.html) — it runs straight from
  `file://`.
- **Hosted:** works as-is on GitHub Pages (or any static file host).

## How it's built

```
flowtrac-trainer/
├── index.html            # entry point — HTML structure only; loads css + js in order
├── css/
│   └── styles.css        # all styling (device, LCD, keypad, LEDs, info panels)
├── js/
│   ├── engine.js         # screen registry, device state, nav stack, key dispatch, render loop
│   ├── device.js         # LCD grid + keypad + LED rendering
│   ├── ui.js              # help panel + guided-lessons framework
│   └── main.js            # boot + wiring (runs last)
├── data/
│   ├── menu.js            # FlowTrac-II menu tree
│   ├── lessons.js         # guided lessons
│   └── screens/           # ONE FILE PER CAPTURED PANEL ← the incremental workflow
│       └── control-valves.js
├── assets/                # reference images, favicon
├── README.md
├── LICENSE
└── .gitignore
```

There's no bundler and no ES modules — every file is a plain `<script>` tag
loaded in order from `index.html`, sharing one global scope. That's what lets
the page run from a double-clicked `file://` URL as well as GitHub Pages.

## Adding a panel (the recurring workflow)

Each captured screen self-registers into a global `Screens` registry — this
is the single extension point for the whole project.

1. Create `data/screens/<name>.js`:
   ```js
   Screens.register("<code>", {
     render(state) { return [line0, line1, line2, line3]; }, // ≤4 strings, ≤40 chars each
     key(k, state) { /* mutate state on key press */ },
     help: `<h3>…</h3> …`, // HTML shown in the "This screen" panel
   });
   ```
2. Add one line to `index.html`, alongside the other data scripts:
   ```html
   <script src="data/screens/<name>.js"></script>
   ```
3. Commit. That's it — no other file needs to change. Any menu leaf without a
   registered screen automatically shows a "Panel not captured yet." stub, so
   navigation never dead-ends while panels are filled in over time.

## Status

- Implemented: full menu tree, two-column menu rendering, LED bank, help
  panel, one guided lesson ("Operate the control valves"), the
  **Control Valves** (2.5) panel, and a live "Hydraulic Circuit" diagram
  (Supply tank, flow pump cylinder, Output) driven by the same state.
- Also implemented: **Empty** (2.1), **Fill** (2.2), **Initialize** (2.3)
  and a simplified **Jog** (2.4) — the flow pump cylinder's fill level
  (`state.cylinderPct`, randomised each page load) animates in real time
  via the shared `runMotion`/`stopMotion` helpers in `js/engine.js`, and
  can be interrupted mid-motion by pressing any key, matching the manual.
  Draining requires the Output Valve already open and filling requires the
  Supply Valve already open (Position → Control Valves) — the same
  interlock the manual calls out for Jog (2.1.2.4), applied consistently
  to every operation that moves water.
- Still placeholders, pending real device captures: all Monitor screens
  (1.x), all Control leaves (3.x.x), all Setup leaves (4.x.x). Jog is a
  simplified version — the real panel also lets you dial in an exact
  steps/sec speed with the 0-4 keys before pressing an arrow.
