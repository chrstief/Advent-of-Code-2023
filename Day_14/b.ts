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
  moveSouth() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.row > this.row && element.column == this.column
      )
      .map((elementInFront) => elementInFront.row);
    if (positionsOfStonesInFront.length == 0) {
      this.row = rows - 1;
    } else {
      this.row = Math.min(...positionsOfStonesInFront) - 1;
    }
  }
  moveWest() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.column < this.column && element.row == this.row
      )
      .map((elementInFront) => elementInFront.column);
    if (positionsOfStonesInFront.length == 0) {
      this.column = 0;
    } else {
      this.column = Math.max(...positionsOfStonesInFront) + 1;
    }
  }
  moveEast() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.column > this.column && element.row == this.row
      )
      .map((elementInFront) => elementInFront.column);
    if (positionsOfStonesInFront.length == 0) {
      this.column = columns - 1;
    } else {
      this.column = Math.min(...positionsOfStonesInFront) - 1;
    }
  }
}

function printPlatform(heading: string) {
  const array: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ".")
  );
  stones.forEach((element) => {
    array[element.row][element.column] = element.type;
  });
  console.log(heading);
  array.forEach((row, index) => console.log(index, row));
}

function calculateWeight() {
  let weight = 0;
  roundStones.forEach((element) => {
    weight += rows - element.row;
  });
  return weight;
}

//////////  module code  //////////
const input: string = await Bun.file("./Day_14/a_sample.txt").text();

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
// printPlatform("start");
const roundStones = stones.filter((element) => element.type == "O");

for (let cycle = 1; cycle <= 1000000000; cycle++) {
  console.time('');
  roundStones.sort((a, b) => a.row - b.row);
  roundStones.forEach((roundStone) => roundStone.moveNorth());
  // printPlatform("north");
  roundStones.sort((a, b) => a.column - b.column);
  roundStones.forEach((roundStone) => roundStone.moveWest());
  // printPlatform("west");
  roundStones.sort((a, b) => b.row - a.row);
  roundStones.forEach((roundStone) => roundStone.moveSouth());
  // printPlatform("south");
  roundStones.sort((a, b) => b.column - a.column);
  roundStones.forEach((roundStone) => roundStone.moveEast());
  if (cycle % 100000 == 0) {
    console.log(`Cycle ${cycle}`);
    console.timeEnd('');
  }
}
console.log(calculateWeight());
