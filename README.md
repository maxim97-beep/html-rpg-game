# HTML Canvas RPG Mini

A minimal browser game built with Canvas 2D and vanilla JavaScript.

## Run

- Open `index.html` directly in your browser, **or**
- Serve the folder with VS Code Live Server and open the local URL.

No build tools or dependencies are required.

## Controls

- **Move:** `WASD` (`KeyW/KeyA/KeyS/KeyD`, layout-independent) or `Arrow keys`
- **Interact:** `E` (`KeyE`, layout-independent) when standing adjacent to the key/door
- **Talk to NPC:** `Enter` or `Space` when adjacent
- **Dialog next:** `Enter`, `Space`, or mouse click
- **Dialog close:** `Esc`
- **Goal:** find the key, unlock the door, and reach the exit

## Features

- Bounded tile map (20x12) with floor and wall tiles
- Wall collision blocking movement
- Toggleable door tile (open/closed)
- One NPC with multi-line dialog
- Debug overlay showing FPS and player coordinates
