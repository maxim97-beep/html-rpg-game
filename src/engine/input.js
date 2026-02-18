const PREVENT_DEFAULT_CODES = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
]);

const normalizeCode = (value) => value;

export function createInput() {
  const pressed = new Set();
  const justPressed = new Set();

  function onKeyDown(event) {
    const code = normalizeCode(event.code);
    if (!pressed.has(code)) {
      justPressed.add(code);
    }
    pressed.add(code);

    if (PREVENT_DEFAULT_CODES.has(code)) {
      event.preventDefault();
    }
  }

  function onKeyUp(event) {
    pressed.delete(normalizeCode(event.code));
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return {
    isDown(code) {
      return pressed.has(normalizeCode(code));
    },
    wasPressed(code) {
      return justPressed.has(normalizeCode(code));
    },
    endFrame() {
      justPressed.clear();
    },
    destroy() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      pressed.clear();
      justPressed.clear();
    },
  };
}

export function getMovementAxis(input) {
  const left = input.isDown("KeyA") || input.isDown("ArrowLeft");
  const right = input.isDown("KeyD") || input.isDown("ArrowRight");
  const up = input.isDown("KeyW") || input.isDown("ArrowUp");
  const down = input.isDown("KeyS") || input.isDown("ArrowDown");

  const x = (right ? 1 : 0) - (left ? 1 : 0);
  const y = (down ? 1 : 0) - (up ? 1 : 0);

  if (x !== 0 && y !== 0) {
    return { x: x * Math.SQRT1_2, y: y * Math.SQRT1_2 };
  }

  return { x, y };
}
