const normalizeKey = (key) => key.toLowerCase();

export function createInput() {
  const pressed = new Set();
  const justPressed = new Set();

  function onKeyDown(event) {
    const key = normalizeKey(event.key);
    if (!pressed.has(key)) {
      justPressed.add(key);
    }
    pressed.add(key);

    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "enter"].includes(key)) {
      event.preventDefault();
    }
  }

  function onKeyUp(event) {
    pressed.delete(normalizeKey(event.key));
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return {
    isDown(key) {
      return pressed.has(normalizeKey(key));
    },
    wasPressed(key) {
      return justPressed.has(normalizeKey(key));
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
  const left = input.isDown("a") || input.isDown("arrowleft");
  const right = input.isDown("d") || input.isDown("arrowright");
  const up = input.isDown("w") || input.isDown("arrowup");
  const down = input.isDown("s") || input.isDown("arrowdown");

  const x = (right ? 1 : 0) - (left ? 1 : 0);
  const y = (down ? 1 : 0) - (up ? 1 : 0);

  if (x !== 0 && y !== 0) {
    return { x: x * Math.SQRT1_2, y: y * Math.SQRT1_2 };
  }

  return { x, y };
}
