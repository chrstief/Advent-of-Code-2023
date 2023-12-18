const input: string = await Bun.file("./Day_18/a.txt").text();

type Direction = "R" | "L" | "U" | "D";
type Corner = { row: number; col: number };
const directionMap = new Map<string, Direction>([
  ["0", "R"],
  ["1", "D"],
  ["2", "L"],
  ["3", "U"],
]);

const instructions = input.split("\n").map((line) => {
  const hex = line.match(/#\w+/g)![0];

  return {
    direction: directionMap.get(hex[6]),
    steps: Number("0x" + hex.substring(1, 6)),
  };
});

// console.log(instructions);

const corners: Corner[] = instructions.reduce(
  (corners, instruction) => {
    const previousCorner = corners[corners.length - 1];
    switch (instruction.direction) {
      case "R":
        return [
          ...corners,
          {
            row: previousCorner.row,
            col: previousCorner.col + instruction.steps,
          },
        ];
      case "L":
        return [
          ...corners,
          {
            row: previousCorner.row,
            col: previousCorner.col - instruction.steps,
          },
        ];
      case "U":
        return [
          ...corners,
          {
            row: previousCorner.row - instruction.steps,
            col: previousCorner.col,
          },
        ];
      case "D":
      default:
        return [
          ...corners,
          {
            row: previousCorner.row + instruction.steps,
            col: previousCorner.col,
          },
        ];
    }
  },
  [{ row: 0, col: 0 }]
);
function calculateEnclosedArea(corners: Corner[]): number {
  //Shoe lace formula for area
  const area =
    0.5 *
    Math.abs(
      corners.reduce(
        (acc, corner, index) =>
          index < corners.length - 1
            ? acc +
              corner.row * corners[index + 1].col -
              corner.col * corners[index + 1].row
            : acc,
        0
      )
    );

  const perimeter = corners.reduce(
    (acc, corner, index) =>
      index < corners.length - 1
        ? acc +
          Math.abs(
            corner.row -
              corners[index + 1].row +
              corner.col -
              corners[index + 1].col
          )
        : acc,
    0
  );

  return area + perimeter / 2 + 1; //Pick's Theorem
}

console.log(calculateEnclosedArea(corners));
