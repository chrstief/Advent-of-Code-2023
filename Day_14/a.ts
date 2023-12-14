const input: string = await Bun.file("./Day_14/a.txt").text();

type Element = {
  type: string;
  row: number;
  column: number;
};

const platform = input.split("\n").map((row) => row.split(""));
const rows = platform.length;
const columns = platform[0].length;

let platformMutated = true;
let weight = 0;
while (platformMutated) {
  platformMutated = false;
  weight = 0;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const element: Element = {
        type: platform[row][column],
        row: row,
        column: column,
      };
      if (isRoundStone(element)) {
        weight += rows - row;
        const NorhternNeigbor = getNorhternNeigbor(element);
        if (NorhternNeigbor && isFreeSpace(NorhternNeigbor)) {
          moveElementNorth(element);
          platformMutated = true;
        }
      }
    }
  }
}

console.log(weight);

function isRoundStone(element: Element) {
  return element.type === "O";
}
function isFreeSpace(element: Element) {
  return element.type == ".";
}
function getNorhternNeigbor(element: Element): Element | undefined {
  if (element.row == 0) return undefined;
  return {
    type: platform[element.row - 1][element.column],
    row: element.row - 1,
    column: element.column,
  };
}
function moveElementNorth(element: Element) {
  platform[element.row][element.column] = ".";
  platform[element.row - 1][element.column] = element.type;
}
