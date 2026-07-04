# FlowTrac-II Trainer — Project Brief & Refactor Spec

> 交接说明:这是一个已在单文件里做好的 FlowTrac-II 前面板训练器,现在要拆成规范的多文件静态项目并上传 GitHub。请先读本文件和 `reference-single-file.html`,再按下面执行。

## What this is
An interactive, browser-only training simulator for the **GeoComp FlowTrac-II** pressure-volume controller. The user learns the device by operating a schematic front panel — a character LCD, a 4×5 keypad, and a bank of indicator lights — exactly as the real hardware behaves. Panels are captured from the real device **incrementally**, so the architecture must make "add one more panel" trivial.

## Input to work from
- `reference-single-file.html` — the current, working single-file trainer. **Split this** into the structure below without changing any behavior. It already contains the full FlowTrac-II menu tree, the working Control Valves screen, the two-column menu renderer, the LED logic, the help panel, and one guided lesson. Extract the menu tree and all logic from here (don't rewrite from scratch).

## Goal
A multi-file **static** site: easy to manage, git/GitHub-friendly, with `index.html` as the entry point so anyone can open it (locally by double-click, or via GitHub Pages). **No backend. No build tools / bundlers.**

## Target structure
```
flowtrac-trainer/
├── index.html            # entry point — HTML structure only; loads css + js in order
├── css/
│   └── styles.css        # all styling (device, LCD, keypad, LEDs, info panels)
├── js/
│   ├── engine.js         # nav stack, key dispatch, screen resolution, render loop
│   ├── device.js         # LCD grid + keypad + LED rendering
│   ├── ui.js             # help panel + guided-lessons framework
│   └── main.js           # boot + wiring (runs last)
├── data/
│   ├── menu.js           # FlowTrac-II menu tree (from reference HTML)
│   ├── lessons.js        # guided lessons (from reference HTML)
│   └── screens/          # ONE FILE PER CAPTURED PANEL  ← the incremental workflow
│       └── control-valves.js
├── assets/               # reference images, favicon
├── README.md
├── LICENSE               # MIT
└── .gitignore
```

## Hard constraints — preserve these exactly
1. **Static only.** No server, no API, no bundler. Must run from `file://` (double-click `index.html`) *and* from GitHub Pages.
2. **Plain `<script>` tags + a global registry.** No ES modules (they break `file://`). Scripts load in this order in `index.html`: data files (`menu.js`, `lessons.js`, `data/screens/*.js`) → `engine.js`, `device.js`, `ui.js` → `main.js` last.
3. **Screen registry.** Expose a global `Screens` with `Screens.register(code, def)`. Each panel file self-registers at the top, e.g. `Screens.register("2.5", { render, key, help })`. This is the single extension point.
4. **Fonts:** IBM Plex Sans (UI) and IBM Plex Mono (LCD/keypad), loaded from Google Fonts.
5. **Color tokens** (inherited from the user's existing menu-tree file — keep identical):
   `--c1:#2f6f8f` Monitor · `--c2:#7a5aa6` Position · `--c3:#c2662b` Control · `--c4:#3f8f5c` Setup.
   Neutrals: `--bg:#f4f5f3 --panel:#fff --ink:#1a201d --ink-soft:#5a635e --line:#d9ddd7 --line-soft:#e8ebe6`.
6. **Device geometry:** LCD is **4 lines × 40 characters** (monospace). Keypad is **4 columns × 5 rows** matching the hardware: `7 8 9 Esc / 4 5 6 Ent / 1 2 3 ↑ / - 0 . ↓ / Menu ← → Alt`. Ten LEDs — left: Motor Power, CPU Power, Net Tx, Net Rx; right: Limit Empty, Flow Out ↑, Flow In ↓, Limit Full, Output Valve, Supply Valve.
7. **Menu rendering (matches the real device):** a title line, then items numbered `N. Label` that fill the **left column top-to-bottom, then continue down the right column**. ≤6 items → keep title + 3 rows; 7–8 items → drop the title, use 4 rows. **Selection is by number key** (press the item's number to enter). No cursor/highlight bar. `Esc` = back, `Menu` = home.
8. **Stub behavior:** any menu leaf without a registered screen shows a clean "Panel not captured yet." placeholder — navigation must never dead-end.
9. **Device state is the single source of truth.** One `state` object (valve positions, LED flags, etc.); the LED bank renders from it. Opening the output valve on the Control Valves screen lights the Output Valve LED, etc.
10. **Control Valves (code 2.5)** — fully implemented, keep behavior: `1` open output, `2` close output, `3` open supply, `4` close supply; two status lines ("Valve is open/closed"); updates the Output/Supply Valve LEDs.
11. **Learning layer:** a contextual help panel that updates per screen, plus a guided-lessons framework with one working lesson, "Operate the control valves" (navigate Position → Control Valves, open both, close both; steps self-check against nav + state).

## Refactor steps
1. Split `reference-single-file.html` into the structure above; behavior must be identical.
2. **Verify** it still runs by opening `index.html` directly in a browser (Control Valves works, menus show two columns, lesson checks off).
3. Add `.gitignore`, `README.md` (what it is + how to run + how to add a panel), `LICENSE` (MIT). `git init`, initial commit.
4. Create a GitHub repo and push.
5. Enable **GitHub Pages** (deploy from the default branch, root). Confirm the public URL loads.

## Adding a panel later (the recurring workflow — put this in the README)
1. Create `data/screens/<name>.js` that calls `Screens.register("<code>", { render, key, help })`.
2. Add one `<script src="data/screens/<name>.js"></script>` line in `index.html` (with the other data scripts).
3. Commit. That's it — no other file changes.

## Target registry API (design `engine.js` around this)
```js
Screens.register(code, {
  render(state) { return [line0, line1, line2, line3]; }, // ≤4 strings, ≤40 chars
  key(k, state) { /* mutate state on key press */ },
  help: `<h3>…</h3> …`                                     // HTML for the help panel
});
```
Menus are generated from `data/menu.js`; leaves fall back to the stub.

## Open items — need real device captures before finalizing
- Exact **main-menu title** text (currently a placeholder "Main Menu").
- Exact format for **menus longer than 6 items** (e.g. PID has 8) — current handling is a reasonable guess.
- Not-yet-captured panels: Empty (2.1), Fill (2.2), Initialize (2.3), Jog (2.4), all Monitor screens (1.x), all Control leaves (3.x.x), all Setup leaves (4.x.x). Each arrives as a screenshot and becomes one file in `data/screens/`.
