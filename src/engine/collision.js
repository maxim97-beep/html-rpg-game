export function isBlockingTile(tile) {
  return tile === "wall" || tile === "door-closed";
}

function intersectsBlocking(rect, map, tileSize) {
  const left = Math.floor(rect.x / tileSize);
  const right = Math.floor((rect.x + rect.width - 1) / tileSize);
  const top = Math.floor(rect.y / tileSize);
  const bottom = Math.floor((rect.y + rect.height - 1) / tileSize);

  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const tile = map.getTile(x, y);
      if (!tile || isBlockingTile(tile.type)) {
        return true;
      }
    }
  }
  return false;
}

export function moveWithCollisions(entity, velocity, dt, map, tileSize) {
  const originalX = entity.x;
  const originalY = entity.y;

  entity.x += velocity.x * dt;
  if (intersectsBlocking(entity, map, tileSize)) {
    entity.x = originalX;
  }

  entity.y += velocity.y * dt;
  if (intersectsBlocking(entity, map, tileSize)) {
    entity.y = originalY;
  }
}

export function tileDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
