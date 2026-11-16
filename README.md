# Conflicts of Units

A lightweight, zero-dependency browser-based grand strategy and wargame built with vanilla HTML5 Canvas, CSS3, and modular ES6 JavaScript. Command nations, draw multi-cell division routes, build supply infrastructure, negotiate treaties, and design custom maps directly in your browser.

---




---

## Overview

**Conflicts of Units** combines real-time pausable territorial warfare with logistics, infrastructure construction, and diplomacy. Built without external game engines or frameworks, the entire simulation runs client-side with support for custom map creation, local save slots, and full mobile/desktop responsive controls.

### Development Philosophy & Playtesting

This project was developed through iterative AI-assisted engineering ("vibe coding") with Claude. Rather than treating AI-generated code as a shortcut that sacrifices quality, **Conflicts of Units** demonstrates that structured, intentional **prompt engineering is a real technical discipline**—requiring clear architectural boundaries, state-machine design, and iterative debugging across 13 modular scripts.

To verify balance, pathfinding, and edge-case mechanics, the game has been actively playtested for **~3 hours** across full campaigns, naval invasions, and custom editor scenarios.

---

## Core Gameplay Mechanics

* **Real-Time Pausable Warfare:** Control simulation speed dynamically or pause at any moment to issue orders across multiple fronts.
* **Tactical Route Drawing:** Select individual divisions or drag-box multiple units, then draw custom movement waypoints directly onto the canvas (`input.js`).
* **Combined Arms & Naval Transport:**
  * **Land Divisions:** Deploy and stack Infantry (`inf`) and Armored (`tank`) divisions with dynamic health tracking, combat cooldowns, and visual stack counters.
  * **Naval Logistics:** Build **Docks** in coastal cities to construct transport ships, load ground divisions as cargo, and execute amphibious landings across water cells.
* **Infrastructure & Supply Lines:**
  * **Railways:** Construct contiguous rail networks connecting territories for rapid strategic redeployment.
  * **Fortifications:** Build defensive forts on cities and strategic chokepoints with dedicated structural hitpoints (`FORTHP`).
* **Diplomacy & Treaties:** Engage in multi-nation warfare, issue ultimatums, and negotiate peace treaties with interactive territory-selection overlays (`treaty` / `ultsel` modes).
* **Terrain & Territorial Control:** Fight across Plains, Forests, Mountains, and Sea tiles, distinguishing between sovereign ownership (`own`) and active military occupation (`ctl`) rendered with striped occupation overlays.
* **Built-in Map Editor (`edit.html`):** Paint terrain brushes (Plains, Water, Forest, Mountains), draw national borders for up to 10 nations, place cities and capitals, pre-deploy starting divisions, and export/import custom maps via `localStorage` (`MapIO`).

---

## Project Architecture

The codebase is organized into clean, single-responsibility modules loaded sequentially without a bundler:

```text
Conflicts-of-Units/
├── index.html      # Main landing menu, scenario & nation selector
├── game.html       # Active campaign & simulation interface
├── edit.html       # Standalone interactive map editor interface
├── style.css       # Responsive light/dark theme & HUD layout
├── data.js         # Game constants, unit stats, tick speeds & name generators
├── world.js        # Procedural map generation & terrain base rendering
├── sim.js          # Core tick loop, combat resolution, economy & AI logic
├── build.js        # Infrastructure construction queue (forts, docks, railways)
├── ai.js           # Computer-controlled nation strategy & diplomacy decisions
├── render.js       # Multi-layer HTML5 Canvas renderer & smooth tick interpolation
├── input.js        # Pointer/touch gesture handling, box selection & path drawing
├── mapio.js        # Custom map serialization, validation & world loader
├── editor.js       # Brush tools, border painting & unit placement logic
├── save.js         # Campaign save/load state management
├── ui.js           # Sidebar tabs, inspector panes, logs & diplomatic modals
├── game.js         # Game lifecycle, initialization & main animation loop
└── page.js         # Page routing & bootstrapping between menu, game, and editor
```
# Getting Started
Clone the repository: "git clone [https://github.com/EgeOnderX/Conflicts-of-Units.git](https://github.com/EgeOnderX/Conflicts-of-Units.git)"

### Run locally:
Open index.html directly in any modern browser, or run a local server (python3 -m http.server 8080) inside the project folder.
