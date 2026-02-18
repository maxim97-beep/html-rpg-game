export function createAudio() {
  // SFX (mp3)
  const door = new Audio("assets/audio/door.mp3");
  const pickup = new Audio("assets/audio/pickup.mp3");

  // Настройки
  door.preload = "auto";
  pickup.preload = "auto";
  door.volume = 0.8;
  pickup.volume = 0.9;

  // Чтобы можно было быстро повторять и не было "кваканья"
  function restart(a) {
    try {
      a.pause();
      a.currentTime = 0;
    } catch {}
    a.play().catch(() => {});
  }

  return {
    playKeyPickup() {
      restart(pickup);
    },
    playDoorToggle() {
      restart(door);
    },
  };
}
