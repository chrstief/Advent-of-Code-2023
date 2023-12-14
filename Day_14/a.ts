const input: string = await Bun.file("./Day_14/a_sample.txt").text();

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

  moveNorth() {
    const positionsOfElementsInFront = platformObjects
      .filter(
        (element) => element.row < this.row && element.column == this.column
      )
      .map((elementInFront) => elementInFront.row);
    if (positionsOfElementsInFront.length == 0) {
      this.row = 0;
    } else {
      this.row = Math.max(...positionsOfElementsInFront) + 1;
    }
  }
}

const platform: Element[][] = input
  .split("\n")
  .map((row, rowIndex) =>
    row
      .split("")
      .map((type, columnIndex) => new Element(type, rowIndex, columnIndex))
  );
const rows = platform.length;
const columns = platform[0].length;

const platformObjects = platform
  .flat()
  .filter((element) => !element.isFreeSpace);
printPlatform("start");
const roundStones = platformObjects.filter((element) => element.isRoundStone);
roundStones.forEach((roundStone) => roundStone.moveNorth());
printPlatform("north");
console.log(calculateWeight());

function printPlatform(heading: string) {
  const array: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ".")
  );
  platformObjects.forEach((element) => {
    array[element.row][element.column] = element.type;
  });
  console.log(heading);
  array.forEach((row) => console.log(row));
}

function calculateWeight() {
  let weight = 0;
  roundStones.forEach((element) => {
    weight += rows - element.row;
  });
  return weight;
}
