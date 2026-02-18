import { TILE_SIZE } from "../game/map.js";
import { getDialogLine } from "../game/dialog.js";

const palette = {
  floor: "#2a3445",
  wall: "#4f5f78",
  "door-closed": "#9c6e3f",
  "door-open": "#5f8f4e",
  key: "#f2d14f",
  exit: "#6ad7a8",
};

export function createRenderer(canvas, map) {
  const ctx = canvas.getContext("2d");

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#151c28";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawMap() {
    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const tile = map.getTile(x, y);
        ctx.fillStyle = palette[tile.type] ?? "#ff00ff";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  function drawEntity(entity, color) {
    ctx.fillStyle = color;
    ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  }

  function drawDebug(info) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(12, 12, 220, 66);

    ctx.fillStyle = "#b9d8ff";
    ctx.font = "20px monospace";
    ctx.fillText(`FPS: ${info.fps.toFixed(0)}`, 20, 36);
    ctx.fillText(`Player: ${info.x.toFixed(1)}, ${info.y.toFixed(1)}`, 20, 62);
  }

  function drawHint(text) {
    if (!text) {
      return;
    }
    const w = ctx.measureText(text).width + 24;
    const x = canvas.width / 2 - w / 2;
    const y = canvas.height - 86;

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x, y, w, 36);
    ctx.strokeStyle = "#7e9cd4";
    ctx.strokeRect(x, y, w, 36);

    ctx.fillStyle = "#deebff";
    ctx.font = "20px sans-serif";
    ctx.fillText(text, x + 12, y + 24);
  }

  function drawWinOverlay(state) {
    if (!state.won) {
      return;
    }

    ctx.fillStyle = "rgba(5, 10, 20, 0.78)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const text = "YOU WIN! Code: 7391";
    ctx.font = "bold 48px sans-serif";
    const textWidth = ctx.measureText(text).width;
    const x = canvas.width / 2 - textWidth / 2;
    const y = canvas.height / 2;

    ctx.fillStyle = "#f9ffb5";
    ctx.fillText(text, x, y);
  }

  function drawDialog(dialog) {
    if (!dialog.active) {
      return;
    }

    const boxHeight = 150;
    const padding = 20;
    const x = 20;
    const y = canvas.height - boxHeight - 20;
    const w = canvas.width - 40;

    ctx.fillStyle = "rgba(7,12,22,0.92)";
    ctx.fillRect(x, y, w, boxHeight);
    ctx.strokeStyle = "#93b4f2";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, boxHeight);

    ctx.fillStyle = "#eaf2ff";
    ctx.font = "24px sans-serif";
    ctx.fillText(getDialogLine(dialog), x + padding, y + 55);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#a8c3f9";
    ctx.fillText("Enter/Click: next • Esc: close", x + padding, y + boxHeight - 24);
  }

  return {
    render(state) {
      clear();
      drawMap();
      drawEntity(state.npc, "#e9c46a");
      drawEntity(state.player, "#58a6ff");
      drawDebug(state.debug);
      drawHint(state.message || state.hint);
      drawDialog(state.dialog);
      drawWinOverlay(state);
    },
    onDialogClick(handler) {
      canvas.addEventListener("click", handler);
    },
  };
}
