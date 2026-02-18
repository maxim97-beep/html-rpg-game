import { createInput, getMovementAxis } from "./engine/input.js";
import { moveWithCollisions } from "./engine/collision.js";
import { createRenderer } from "./engine/render.js";
import { createAudio } from "./engine/audio.js";
import { createMap, TILE_SIZE } from "./game/map.js";
import {
  createPlayer,
  createNpc,
  getEntityTilePosition,
  isAdjacentToNpc,
  isAdjacentToTile,
} from "./game/entities.js";
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
const audio = createAudio();
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
  hasKey: false,
  won: false,
  message: "",
  messageTimer: 0,
  debug: { fps: 0, x: player.x, y: player.y },
};

let lastTime = performance.now();
let fpsTimer = 0;
let frameCount = 0;

function update(dt) {
  if (state.messageTimer > 0) {
    state.messageTimer = Math.max(0, state.messageTimer - dt);
    if (state.messageTimer === 0 && !state.won) {
      state.message = "";
    }
  }

  if (state.won) {
    state.hint = "";
    state.debug.x = player.x;
    state.debug.y = player.y;
    return;
  }

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
    const canTakeKey = map.key && isAdjacentToTile(player, map.key);
    const canTalkNpc = isAdjacentToNpc(player, npc);

    if (input.wasPressed("KeyE")) {
      if (canTakeKey && map.pickUpKey()) {
        state.hasKey = true;
        audio.playKeyPickup();
        state.message = "You got a key!";
        state.messageTimer = 2;
      } else if (canUseDoor) {
        if (!state.hasKey) {
          state.message = "Door locked — find a key";
          state.messageTimer = 2;
        } else {
          map.toggleDoor();
          audio.playDoorToggle();
        }
      }
    }

    if (canTalkNpc && (input.wasPressed("Enter") || input.wasPressed("Space"))) {
      openDialog(dialog);
    }

    state.hint = canTalkNpc
      ? "Press Enter/Space to talk"
      : canTakeKey
        ? "Press E to pick up key"
        : canUseDoor
          ? state.hasKey
            ? "Press E to toggle door"
            : "Press E (door is locked)"
          : "";

    const playerTile = getEntityTilePosition(player);
    if (playerTile.x === map.exit.x && playerTile.y === map.exit.y) {
      state.won = true;
      state.message = "YOU WIN! Code: 7391";
      state.messageTimer = 0;
      closeDialog(dialog);
      state.hint = "";
    }
  } else {
    if (input.wasPressed("Escape")) {
      closeDialog(dialog);
    } else if (input.wasPressed("Enter") || input.wasPressed("Space")) {
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
