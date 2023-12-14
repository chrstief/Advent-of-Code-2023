const input: string = await Bun.file("./Day_14/a_sample.txt").text();

class Element {
  type: string;
  row: number;
  column: number;

  constructor(type: string, row: number, column: number) {
    this.type = type;
    this.row = row;
    this.column = column;
  }

  moveNorth() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.row < this.row && element.column == this.column
      )
      .map((elementInFront) => elementInFront.row);
    if (positionsOfStonesInFront.length == 0) {
      this.row = 0;
    } else {
      this.row = Math.max(...positionsOfStonesInFront) + 1;
    }
  }
}

const allElements: Element[][] = input
  .split("\n")
  .map((row, rowIndex) =>
    row
      .split("")
      .map((type, columnIndex) => new Element(type, rowIndex, columnIndex))
  );
const rows = allElements.length;
const columns = allElements[0].length;

const stones = allElements.flat().filter((element) => !(element.type == "."));
printPlatform("start");
const roundStones = stones.filter((element) => element.type == "O");
roundStones.forEach((roundStone) => roundStone.moveNorth());
printPlatform("north");
console.log(calculateWeight());

function printPlatform(heading: string) {
  const array: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ".")
  );
  stones.forEach((element) => {
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
