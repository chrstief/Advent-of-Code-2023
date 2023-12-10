//////////////////////    Types   //////////////////////
type Coordinates = {
  x: number;
  y: number;
};
type Direction = "north" | "east" | "south" | "west" | "none";
type Pipe = {
  type: keyof typeof pipes;
  position: Coordinates;
  exit: Direction;
};
const pipes: Record<
  "|" | "-" | "L" | "J" | "7" | "F" | "." | "S",
  Direction[]
> = {
  "|": ["north", "south"],
  "-": ["west", "east"],
  L: ["north", "east"],
  J: ["north", "west"],
  "7": ["south", "west"],
  F: ["east", "south"],
  ".": ["none", "none"],
  S: ["none", "none"],
};
type Status = "partOfLoop" | "leftOfLoop" | "rightOfLoop";
type MazeElement = {
  type: keyof typeof pipes;
  status?: Status;
};

//////////////////////    Module Code   //////////////////////
const input: string = await Bun.file("./Day_10/a.txt").text();
const maze = input.split("\n").map((line) =>
  line.split("").map(
    (char): MazeElement => ({
      type: char as keyof typeof pipes,
    })
  )
);
// console.log(maze);

const width = maze[0].length;
const length = maze.length;
// console.log({ width }, { length });

const [firstStep, lastStep] = getFirstAndLastStep();

let steps: Pipe[] = [firstStep];
let index = 0;
while (
  JSON.stringify(steps[index].position) != JSON.stringify(lastStep.position)
) {
  const nextStep = nextPipe(steps[index]);
  // console.log(nextStep.type)
  steps.push(nextStep);
  index++;
}

let numberOfElementsWithoutStatus = Infinity;
while (true) {
  for (let row = 0; row < length; row++) {
    for (let column = 0; column < width; column++) {
      const thisPipe = maze[row][column];
      const position: Coordinates = { x: column, y: row };
      if (!thisPipe.status) {
        thisPipe.type = ".";
        const directions = getPossibleDirections(position);
        const neighbors = directions.map((direction) => {
          const neighborPosition = calculateNextPosition(position, direction);
          return maze[neighborPosition.y][neighborPosition.x];
        });
        if (neighbors.some((neighbor) => neighbor.status == "leftOfLoop")) {
          thisPipe.status = "leftOfLoop";
        }
        if (neighbors.some((neighbor) => neighbor.status == "rightOfLoop")) {
          thisPipe.status = "rightOfLoop";
        }
      }
    }
  }
  const newNumberOfElementsWithoutStatus = maze
    .flat()
    .filter((element) => element.status == undefined).length;
  if (numberOfElementsWithoutStatus == newNumberOfElementsWithoutStatus) break;
  numberOfElementsWithoutStatus = newNumberOfElementsWithoutStatus;
}

const visual = maze
  .map((row) =>
    row
      .map((element) => {
        if (element.status == "leftOfLoop") return "0";
        if (element.status == "rightOfLoop") return "1";
        return element.type;
      })
      .join("")
  )
  .join("\n");
console.log(visual);
const leftOfLoop = visual.split("").filter((char) => char === "0").length;
const rightOfLoop = visual.split("").filter((char) => char === "1").length;
console.log({ rightOfLoop }, { leftOfLoop }, { numberOfElementsWithoutStatus });

//////////////////////    Functions   //////////////////////
function getFirstAndLastStep(): Pipe[] {
  const startPipe: Pipe = (() => {
    const row = maze.findIndex((row) =>
      row.some((element) => element.type === "S")
    );
    return {
      type: "S",
      position: {
        x: maze[row].findIndex((element) => element.type === "S"),
        y: row,
      },
      exit: "none",
    };
  })();
  // console.log(startPipe);
  maze[startPipe.position.y][startPipe.position.x].status = "partOfLoop";

  const directions = getPossibleDirections(startPipe.position);
  // console.log({ directions });

  const surroundings = directions.map((direction) => ({
    direction: direction,
    pipe: nextPipe({
      ...startPipe,
      exit: direction,
    }),
  }));
  // console.log(surroundings);

  const connections = surroundings.filter((connection) =>
    pipes[connection.pipe.type].includes(
      translateExitToEntrance(connection.direction)
    )
  );
  // console.log(connections);

  const firstStep: Pipe = connections[0].pipe;
  const lastStep: Pipe = connections[1].pipe;
  // console.log(firstStep)
  // console.log(lastStep)
  maze[firstStep.position.y][firstStep.position.x].status = "partOfLoop";
  maze[lastStep.position.y][lastStep.position.x].status = "partOfLoop";

  return [firstStep, lastStep];
}

function nextPipe(previousPipe: Pipe): Pipe {
  const position = calculateNextPosition(
    previousPipe.position,
    previousPipe.exit
  );
  const type = maze[position.y][position.x].type;
  const entrance = translateExitToEntrance(previousPipe.exit);
  const exit = pipes[type].find((direction) => direction != entrance)!;
  //mutation hell because of unpure funtions
  if (previousPipe.type != "S") {
    maze[position.y][position.x].status = "partOfLoop";
    const directionRight = calculateDirectionRight(entrance);
    const directionLeft = calculateDirectionLeft(entrance);
    const positionRight = calculateNextPosition(position, directionRight);
    const positionLeft = calculateNextPosition(position, directionLeft);
    const positionTop = calculateNextPosition(position, entrance);
    if (maze[positionRight.y]?.[positionRight.x]) {
      maze[positionRight.y][positionRight.x].status ||= "rightOfLoop";
    }
    if (maze[positionLeft.y]?.[positionLeft.x]) {
      maze[positionLeft.y][positionLeft.x].status ||= "leftOfLoop";
    }
    if (maze[positionTop.y]?.[positionTop.x]) {
      switch (entrance) {
        case "north":
          if (type == "J")
            maze[positionTop.y][positionTop.x].status ||= "leftOfLoop";
          if (type == "L")
            maze[positionTop.y][positionTop.x].status ||= "rightOfLoop";
          break;
        case "east":
          if (type == "L")
            maze[positionTop.y][positionTop.x].status ||= "leftOfLoop";
          if (type == "F")
            maze[positionTop.y][positionTop.x].status ||= "rightOfLoop";
          break;
        case "south":
          if (type == "F")
            maze[positionTop.y][positionTop.x].status ||= "leftOfLoop";
          if (type == "7")
            maze[positionTop.y][positionTop.x].status ||= "rightOfLoop";
          break;
        case "west":
          if (type == "7")
            maze[positionTop.y][positionTop.x].status ||= "leftOfLoop";
          if (type == "J")
            maze[positionTop.y][positionTop.x].status ||= "rightOfLoop";
          break;
      }
    }
  }

  return { type: type, position: position, exit: exit };
}

function translateExitToEntrance(exit: Direction): Direction {
  switch (exit) {
    case "east":
      return "west";
    case "west":
      return "east";
    case "north":
      return "south";
    case "south":
      return "north";
    case "none":
      return "none";
  }
}

function calculateNextPosition(
  position: Coordinates,
  to: Direction
): Coordinates {
  switch (to) {
    case "east":
      return { x: position.x + 1, y: position.y };
    case "west":
      return { x: position.x - 1, y: position.y };
    case "north":
      return { x: position.x, y: position.y - 1 };
    case "south":
      return { x: position.x, y: position.y + 1 };
    case "none":
      return { x: position.x, y: position.y };
  }
}

function calculateDirectionRight(from: Direction): Direction {
  switch (from) {
    case "east":
      return "north";
    case "west":
      return "south";
    case "north":
      return "west";
    case "south":
      return "east";
    case "none":
      return "none";
  }
}

function calculateDirectionLeft(from: Direction): Direction {
  switch (from) {
    case "east":
      return "south";
    case "west":
      return "north";
    case "north":
      return "east";
    case "south":
      return "west";
    case "none":
      return "none";
  }
}

function getPossibleDirections(position: Coordinates): Direction[] {
  const directions: Direction[] = [];
  if (position.x > 0) directions.push("west");
  if (position.x < width - 1) directions.push("east");
  if (position.y > 0) directions.push("north");
  if (position.y < length - 1) directions.push("south");
  return directions;
}
