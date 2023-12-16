const input: string = await Bun.file("./Day_16/a.txt").text();

type TileType = "." | "/" | "\\" | "-" | "|";
type Direction = "north" | "south" | "east" | "west";
type Coordinates = { row: number; column: number };
const translations: Map<Direction, Coordinates> = new Map([
  ["north", { row: -1, column: 0 }],
  ["south", { row: 1, column: 0 }],
  ["east", { row: 0, column: 1 }],
  ["west", { row: 0, column: -1 }],
]);

function createMap() {
  const map: Tile[][] = input
    .split("\n")
    .map((line, rowIndex) =>
      line
        .split("")
        .map(
          (char, columnIndex) =>
            new Tile(char as TileType, { row: rowIndex, column: columnIndex })
        )
    );
  map.flat().forEach((tile) => tile.setMapReference(map));
  return map;
}
const lastRow = input.split("\n").length - 1;
const lastColumn = input.split("\n")[0].length - 1;

class Tile {
  map?: Tile[][];
  type: TileType;
  energizedInDirection: Set<Direction>;
  location: Coordinates;
  constructor(type: TileType, location: Coordinates) {
    this.type = type;
    this.energizedInDirection = new Set();
    this.location = location;
  }

  public setMapReference(map: Tile[][]) {
    this.map = map;
  }

  public propagateBeam(incomingBeamDirection: Direction) {
    if (this.energizedInDirection.has(incomingBeamDirection)) return;
    this.energizedInDirection.add(incomingBeamDirection);
    switch (this.type) {
      case ".":
        this.hitNextTile(incomingBeamDirection);
        break;

      case "/":
        switch (incomingBeamDirection) {
          case "north":
            this.hitNextTile("east");
            break;
          case "south":
            this.hitNextTile("west");
            break;
          case "east":
            this.hitNextTile("north");
            break;
          case "west":
            this.hitNextTile("south");
            break;
        }
        break;

      case "\\":
        switch (incomingBeamDirection) {
          case "north":
            this.hitNextTile("west");
            break;
          case "south":
            this.hitNextTile("east");
            break;
          case "east":
            this.hitNextTile("south");
            break;
          case "west":
            this.hitNextTile("north");
            break;
        }
        break;

      case "-":
        switch (incomingBeamDirection) {
          case "north":
          case "south":
            this.hitNextTile("east");
            this.hitNextTile("west");
            break;
          case "east":
          case "west":
            this.hitNextTile(incomingBeamDirection);
            break;
        }
        break;

      case "|":
        switch (incomingBeamDirection) {
          case "north":
          case "south":
            this.hitNextTile(incomingBeamDirection);
            break;
          case "east":
          case "west":
            this.hitNextTile("north");
            this.hitNextTile("south");
            break;
        }
        break;
    }
  }
  private getNextLocation(direction: Direction): Coordinates | null {
    switch (direction) {
      case "north":
        if (this.location.row == 0) return null;
        break;
      case "south":
        if (this.location.row == lastRow) return null;
        break;
      case "east":
        if (this.location.column == lastColumn) return null;
        break;
      case "west":
        if (this.location.column == 0) return null;
        break;
    }
    return {
      row: this.location.row + translations.get(direction)!.row,
      column: this.location.column + translations.get(direction)!.column,
    };
  }

  private hitNextTile(direction: Direction) {
    const nextTileLocation = this.getNextLocation(direction);
    if (!nextTileLocation) return;
    if (!this.map) throw new Error("Tile has no map Reference");
    const nextTile = this.map[nextTileLocation.row][nextTileLocation.column];
    nextTile.propagateBeam(direction);
  }
}

type StartConfiguration = {
  startLocation: Coordinates;
  beamStartDirection: Direction;
};

function numberOfEnergizedTiles({
  startLocation,
  beamStartDirection,
}: StartConfiguration) {
  const map = createMap();
  const startTile: Tile = map[startLocation.row][startLocation.column];
  startTile.propagateBeam(beamStartDirection);
  const numberOfEnergizedTiles = map
    .flat()
    .filter((tile) => tile.energizedInDirection.size > 0).length;
  return numberOfEnergizedTiles;
}

//////////  module code  //////////

const northEdgeStart: StartConfiguration[] = Array.from(
  { length: lastColumn + 1 },
  (_, index) => ({
    startLocation: { row: 0, column: index },
    beamStartDirection: "south",
  })
);
const southEdgeStart: StartConfiguration[] = Array.from(
  { length: lastColumn + 1 },
  (_, index) => ({
    startLocation: { row: lastRow, column: index },
    beamStartDirection: "north",
  })
);
const eastEdgeStart: StartConfiguration[] = Array.from(
  { length: lastRow + 1 },
  (_, index) => ({
    startLocation: { row: index, column: lastColumn },
    beamStartDirection: "west",
  })
);
const westEdgeStart: StartConfiguration[] = Array.from(
  { length: lastRow + 1 },
  (_, index) => ({
    startLocation: { row: index, column: 0 },
    beamStartDirection: "east",
  })
);

const allStartConfigurations = [
  ...northEdgeStart,
  ...southEdgeStart,
  ...eastEdgeStart,
  ...westEdgeStart,
];

const results = allStartConfigurations.map((startConfig) =>
  numberOfEnergizedTiles(startConfig)
);
const answer = Math.max(...results);
console.log(answer);
