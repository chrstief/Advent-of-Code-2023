const input: string = await Bun.file("./Day_18/a.txt").text();

type Direction = "R" | "L" | "U" | "D";
type Corner = { row: number; col: number };

const instructions = input.split("\n").map((line) => {
  const parts = line.split(" ");
  return { direction: parts[0] as Direction, steps: Number(parts[1]) };
});

// console.log(instructions);

const corners: Corner[] = instructions.reduce(
  (corners, instruction) => {
    const previousCorner = corners[corners.length - 1];
    let newCorner: Corner;
    switch (instruction.direction) {
      case "R":
        newCorner = {
          row: previousCorner.row,
          col: previousCorner.col + instruction.steps,
        };
        break;
      case "L":
        newCorner = {
          row: previousCorner.row,
          col: previousCorner.col - instruction.steps,
        };
        break;
      case "U":
        newCorner = {
          row: previousCorner.row - instruction.steps,
          col: previousCorner.col,
        };
        break;
      case "D":
        newCorner = {
          row: previousCorner.row + instruction.steps,
          col: previousCorner.col,
        };
        break;
    }
    return [...corners, newCorner];
  },
  [{ row: 0, col: 0 }]
);
const minRow = Math.min(...corners.map((corner) => corner.row));
const minCol = Math.min(...corners.map((corner) => corner.col));
const normalizedCorners: Corner[] = corners.map((corner) => ({
  row: corner.row - minRow,
  col: corner.col - minCol,
}));
const maxNormalizedRow = Math.max(
  ...normalizedCorners.map((corner) => corner.row)
);
const maxNormalizedCol = Math.max(
  ...normalizedCorners.map((corner) => corner.col)
);

const lagoon = Array.from({ length: maxNormalizedRow + 1 }, () =>
  Array.from({ length: maxNormalizedCol + 1 }, () => ".")
);

normalizedCorners.reduce((previousCorner, corner) => {
  if (corner.row === previousCorner.row) {
    if (previousCorner.col < corner.col) {
      for (let i = previousCorner.col; i <= corner.col; i++) {
        lagoon[corner.row][i] = "#";
      }
    } else {
      for (let i = corner.col; i <= previousCorner.col; i++) {
        lagoon[corner.row][i] = "#";
      }
    }
  } else if (corner.col === previousCorner.col) {
    if (previousCorner.row < corner.row) {
      for (let i = previousCorner.row; i <= corner.row; i++) {
        lagoon[i][corner.col] = "#";
      }
    } else {
      for (let i = corner.row; i <= previousCorner.row; i++) {
        lagoon[i][corner.col] = "#";
      }
    }
  } else {
    throw new Error("Unexpected corner");
  }
  return corner;
});

function floodFill(lagoon: string[][], row: number, col: number) {
  if (lagoon[row][col] === '#') return
  lagoon[row][col] = '#'
  floodFill(lagoon, row + 1, col)
  floodFill(lagoon, row - 1, col);
  floodFill(lagoon, row, col + 1);
  floodFill(lagoon, row, col - 1);
}
floodFill(lagoon, normalizedCorners[0].row+1,normalizedCorners[0].col+1)


// lagoon.forEach((row) => console.log(row));

const answer = lagoon.map(row => {
  return row.filter(char=>char=='#').length
}).reduce((acc, current) => acc + current)
console.log(answer)
