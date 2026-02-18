export const TILE_SIZE = 64;

const legend = {
  ".": { type: "floor" },
  "#": { type: "wall" },
  D: { type: "door-closed" },
};

const rows = [
  "####################",
  "#..................#",
  "#..######..........#",
  "#..#....#..........#",
  "#..#....#..........#",
  "#..#....#######....#",
  "#..#............D..#",
  "#..#...............#",
  "#..########........#",
  "#..................#",
  "#..................#",
  "####################",
];

export function createMap() {
  const tiles = rows.map((row) => row.split("").map((char) => ({ ...legend[char] })));

  const door = findDoor(tiles);

  return {
    width: tiles[0].length,
    height: tiles.length,
    tiles,
    door,
    getTile(x, y) {
      if (x < 0 || y < 0 || y >= tiles.length || x >= tiles[0].length) {
        return null;
      }
      return tiles[y][x];
    },
    toggleDoor() {
      const tile = tiles[door.y][door.x];
      tile.type = tile.type === "door-closed" ? "door-open" : "door-closed";
      return tile.type;
    },
  };
}

function findDoor(tiles) {
  for (let y = 0; y < tiles.length; y += 1) {
    for (let x = 0; x < tiles[0].length; x += 1) {
      if (tiles[y][x].type.startsWith("door")) {
        return { x, y };
      }
    }
  }
  throw new Error("Door tile missing.");
}
