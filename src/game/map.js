export const TILE_SIZE = 64;

const legend = {
  ".": { type: "floor" },
  "#": { type: "wall" },
  D: { type: "door-closed" },
  K: { type: "key" },
  X: { type: "exit" },
};

const rows = [
  "####################",
  "#..................#",
  "#..######..........#",
  "#..#....#..........#",
  "#..#....#..........#",
  "#..#....#######....#",
  "#..#......K.....DX.#",
  "#..#...............#",
  "#..########........#",
  "#..................#",
  "#..................#",
  "####################",
];

export function createMap() {
  const tiles = rows.map((row) => row.split("").map((char) => ({ ...legend[char] })));

  const door = findDoor(tiles);
  const key = findTile(tiles, "key");
  const exit = findTile(tiles, "exit");

  return {
    width: tiles[0].length,
    height: tiles.length,
    tiles,
    door,
    key,
    exit,
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
    pickUpKey() {
      if (!this.key) {
        return false;
      }
      const tile = tiles[this.key.y][this.key.x];
      if (tile.type !== "key") {
        this.key = null;
        return false;
      }
      tile.type = "floor";
      this.key = null;
      return true;
    },
  };
}

function findDoor(tiles) {
  return findTile(tiles, "door-closed");
}

function findTile(tiles, type) {
  for (let y = 0; y < tiles.length; y += 1) {
    for (let x = 0; x < tiles[0].length; x += 1) {
      if (tiles[y][x].type === type) {
        return { x, y };
      }
    }
  }
  throw new Error(`${type} tile missing.`);
}
