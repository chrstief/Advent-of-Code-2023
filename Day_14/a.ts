const input: string = await Bun.file("./Day_14/a.txt").text();

type Direction = {
  row: number;
  column: number;
};
const north: Direction = {
  row: -1,
  column: 0,
};

class Element {
  type: string;
  row: number;
  column: number;
  isRoundStone: boolean;
  isFreeSpace: boolean;

  constructor(type: string, row: number, column: number) {
    this.type = type;
    this.row = row;
    this.column = column;
    this.isRoundStone = type === "O";
    this.isFreeSpace = type == ".";
  }
}

const platform: Element[][] = input
  .split("\n")
  .map((row, rowIndex) =>
    row
      .split("")
      .map((type, columnIndex) => new Element(type, rowIndex, columnIndex))
  );
// platform.forEach((row) => console.log(row.map((element) => element.type)));
const rows = platform.length;
const columns = platform[0].length;

let platformMutated = true;
let weight = 0;
while (platformMutated) {
  platformMutated = false;
  weight = 0;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const element = platform[row][column];
      if (element.isRoundStone) {
        weight += rows - row;
        const NorthernNeighbor = getNorthernNeighbor(element);
        if (NorthernNeighbor && NorthernNeighbor.isFreeSpace) {
          moveElementNorth(element);
          platformMutated = true;
        }
      }
    }
  }
}

console.log(weight);
// platform.forEach((row) => console.log(row.map((element) => element.type)));

function getNorthernNeighbor(element: Element): Element | undefined {
  if (element.row == 0) return undefined;
  return platform[element.row - 1][element.column];
}
function moveElementNorth(element: Element) {
  platform[element.row][element.column] = new Element(
    ".",
    element.row,
    element.column
  );
  platform[element.row - 1][element.column] = new Element(
    "O",
    element.row - 1,
    element.column
  );
}
