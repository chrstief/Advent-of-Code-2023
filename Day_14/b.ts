class Element {
  type: string;
  row: number;
  column: number;
  movedNorth: boolean;
  movedSouth: boolean;
  movedWest: boolean;
  movedEast: boolean;
  stuck: boolean;

  constructor(type: string, row: number, column: number) {
    this.type = type;
    this.row = row;
    this.column = column;
    this.movedNorth = false;
    this.movedSouth = false;
    this.movedWest = false;
    this.movedEast = false;
    this.stuck = false;
  }

  moveNorth() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.row < this.row && element.column == this.column
      )
      .map((elementInFront) => elementInFront.row);

    const updatedPosition =
      positionsOfStonesInFront.length == 0
        ? 0
        : Math.max(...positionsOfStonesInFront) + 1;

    if (this.row != updatedPosition) {
      this.movedNorth = true;
      this.row = updatedPosition;
    } else {
      this.movedNorth = false;
    }
  }
  moveSouth() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.row > this.row && element.column == this.column
      )
      .map((elementInFront) => elementInFront.row);
    const updatedPosition =
      positionsOfStonesInFront.length == 0
        ? rows - 1
        : Math.min(...positionsOfStonesInFront) - 1;

    if (this.row != updatedPosition) {
      this.movedSouth = true;
      this.row = updatedPosition;
    } else {
      this.movedSouth = false;
    }
  }
  moveWest() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.column < this.column && element.row == this.row
      )
      .map((elementInFront) => elementInFront.column);
    const updatedPosition =
      positionsOfStonesInFront.length == 0
        ? 0
        : Math.max(...positionsOfStonesInFront) + 1;

    if (this.column != updatedPosition) {
      this.movedWest = true;
      this.column = updatedPosition;
    } else {
      this.movedWest = false;
    }
  }
  moveEast() {
    const positionsOfStonesInFront = stones
      .filter(
        (element) => element.column > this.column && element.row == this.row
      )
      .map((elementInFront) => elementInFront.column);
    const updatedPosition =
      positionsOfStonesInFront.length == 0
        ? columns - 1
        : Math.min(...positionsOfStonesInFront) - 1;

    if (this.column != updatedPosition) {
      this.movedEast = true;
      this.column = updatedPosition;
    } else {
      this.movedEast = false;
    }
  }
  checkIfStuck() {
    this.stuck = !(
      this.movedNorth ||
      this.movedSouth ||
      this.movedWest ||
      this.movedEast
    );
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

for (let cycle = 1; cycle <= 3; cycle++) {
  console.time("");
  roundStones.sort((a, b) => a.row - b.row);
  roundStones
    .filter((roundStone) => !roundStone.stuck)
    .forEach((roundStone) => roundStone.moveNorth());
  // printPlatform("north");
  roundStones.sort((a, b) => a.column - b.column);
  roundStones
    .filter((roundStone) => !roundStone.stuck)
    .forEach((roundStone) => roundStone.moveWest());
  // printPlatform("west");
  roundStones.sort((a, b) => b.row - a.row);
  roundStones
    .filter((roundStone) => !roundStone.stuck)
    .forEach((roundStone) => roundStone.moveSouth());
  // printPlatform("south");
  roundStones.sort((a, b) => b.column - a.column);
  roundStones
    .filter((roundStone) => !roundStone.stuck)
    .forEach((roundStone) => roundStone.moveEast());

  roundStones
    .filter((roundStone) => !roundStone.stuck)
    .forEach((roundStone) => roundStone.checkIfStuck());
  if (cycle % 100000 == 0) {
    console.log(`Cycle ${cycle}`);
    console.log(
      "not stuck:",
      roundStones.filter((roundStone) => !roundStone.stuck).length
    );
    console.timeEnd("");
  }
  printPlatform(`Cycle ${cycle}`);
}
console.log(calculateWeight());
