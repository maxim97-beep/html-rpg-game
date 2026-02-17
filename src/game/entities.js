import { TILE_SIZE } from "./map.js";
import { tileDistance } from "../engine/collision.js";

export function createPlayer() {
  return {
    x: 2 * TILE_SIZE + 8,
    y: 2 * TILE_SIZE + 8,
    width: TILE_SIZE - 16,
    height: TILE_SIZE - 16,
    speed: 220,
  };
}

export function createNpc() {
  return {
    name: "Old Ranger",
    tileX: 9,
    tileY: 7,
    width: TILE_SIZE - 20,
    height: TILE_SIZE - 20,
    get x() {
      return this.tileX * TILE_SIZE + 10;
    },
    get y() {
      return this.tileY * TILE_SIZE + 10;
    },
  };
}

export function getEntityTilePosition(entity) {
  const centerX = entity.x + entity.width / 2;
  const centerY = entity.y + entity.height / 2;
  return {
    x: Math.floor(centerX / TILE_SIZE),
    y: Math.floor(centerY / TILE_SIZE),
  };
}

export function isAdjacentToTile(player, tilePos) {
  return tileDistance(getEntityTilePosition(player), tilePos) === 1;
}

export function isAdjacentToNpc(player, npc) {
  return isAdjacentToTile(player, { x: npc.tileX, y: npc.tileY });
}
