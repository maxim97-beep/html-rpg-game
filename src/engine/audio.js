function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function createAudio() {
  let context = null;

  function ensureContext() {
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      context = new AudioContextClass();
    }

    if (context.state === "suspended") {
      context.resume();
    }

    return context;
  }

  function playTone({ frequency, type = "sine", duration = 0.12, volume = 0.18, slideTo }) {
    const ctx = ensureContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const safeDuration = clamp(duration, 0.02, 1.5);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slideTo && Number.isFinite(slideTo)) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), now + safeDuration);
    }

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + safeDuration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + safeDuration + 0.02);
  }

  return {
    playKeyPickup() {
      playTone({ frequency: 660, type: "triangle", duration: 0.08, volume: 0.12, slideTo: 880 });
      window.setTimeout(() => {
        playTone({ frequency: 880, type: "triangle", duration: 0.12, volume: 0.14, slideTo: 1040 });
      }, 50);
    },
    playDoorToggle() {
      playTone({ frequency: 220, type: "square", duration: 0.16, volume: 0.1, slideTo: 180 });
      window.setTimeout(() => {
        playTone({ frequency: 140, type: "square", duration: 0.14, volume: 0.08, slideTo: 120 });
      }, 35);
    },
  };
}
