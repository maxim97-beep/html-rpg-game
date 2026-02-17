import { createInput, getMovementAxis } from "./engine/input.js";
import { moveWithCollisions } from "./engine/collision.js";
import { createRenderer } from "./engine/render.js";
import { createMap, TILE_SIZE } from "./game/map.js";
import { createPlayer, createNpc, isAdjacentToNpc, isAdjacentToTile } from "./game/entities.js";
import { createDialogState, openDialog, closeDialog, advanceDialog } from "./game/dialog.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 20 * TILE_SIZE;
canvas.height = 12 * TILE_SIZE;

const input = createInput();
const map = createMap();
const player = createPlayer();
const npc = createNpc();
const dialog = createDialogState([
  "Welcome, traveler.",
  "The door responds to your intent: press E nearby.",
  "Be kind, and the path ahead will open.",
]);

const renderer = createRenderer(canvas, map);
renderer.onDialogClick(() => {
  if (dialog.active) {
    advanceDialog(dialog);
  }
});

const state = {
  player,
  npc,
  dialog,
  hint: "",
  debug: { fps: 0, x: player.x, y: player.y },
};

let lastTime = performance.now();
let fpsTimer = 0;
let frameCount = 0;

function update(dt) {
  if (!dialog.active) {
    const axis = getMovementAxis(input);
    moveWithCollisions(
      player,
      { x: axis.x * player.speed, y: axis.y * player.speed },
      dt,
      map,
      TILE_SIZE,
    );

    const canUseDoor = isAdjacentToTile(player, map.door);
    const canTalkNpc = isAdjacentToNpc(player, npc);

    if (canUseDoor && input.wasPressed("e")) {
      map.toggleDoor();
    }

    if (canTalkNpc && (input.wasPressed("enter") || input.wasPressed(" "))) {
      openDialog(dialog);
    }

    state.hint = canTalkNpc
      ? "Press Enter/Space to talk"
      : canUseDoor
        ? "Press E to toggle door"
        : "";
  } else {
    if (input.wasPressed("escape")) {
      closeDialog(dialog);
    } else if (input.wasPressed("enter") || input.wasPressed(" ")) {
      advanceDialog(dialog);
    }
  }

  state.debug.x = player.x;
  state.debug.y = player.y;
}

function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  fpsTimer += dt;
  frameCount += 1;
  if (fpsTimer >= 0.25) {
    state.debug.fps = frameCount / fpsTimer;
    frameCount = 0;
    fpsTimer = 0;
  }

  update(dt);
  renderer.render(state);
  input.endFrame();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
