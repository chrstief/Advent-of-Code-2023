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

//////////////////////    Module Code   //////////////////////
const maze: string = await Bun.file("./Day_10/a.txt").text();
// console.log(maze);

const width = maze.split("\n")[0].length;
const length = maze.split("\n").length;
// console.log({ width }, { length });

const [firstStep, lastStep] = getFirstAndLastStep();

let steps: Pipe[] = [firstStep];
let index = 0;
while (JSON.stringify(steps[index].position) != JSON.stringify(lastStep.position)) {
  const nextStep = nextPipe(steps[index]);
  // console.log(nextStep.type)
  steps.push(nextStep);
  index++;
}
const answer = Math.ceil(steps.length / 2);
console.log(answer);

//////////////////////    Functions   //////////////////////
function getFirstAndLastStep(): Pipe[] {
  const startPipe: Pipe = {
    type: "S",
    position: {
      x: maze.indexOf("S") % (width + 1), //+1 for /n every line
      y: Math.floor(maze.indexOf("S") / (width + 1)),
    },
    exit: "none",
  };
  // console.log(startPipe);

  const directions: Direction[] = [];
  if (startPipe.position.x > 0) directions.push("west");
  if (startPipe.position.x < width - 1) directions.push("east");
  if (startPipe.position.y > 0) directions.push("north");
  if (startPipe.position.y < length - 1) directions.push("south");
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

  return [firstStep, lastStep];
}

function nextPipe(previousPipe: Pipe): Pipe {
  const position = calculateNextPosition(
    previousPipe.position,
    previousPipe.exit
  );
  const type = getCharFromPosition(position) as keyof typeof pipes;
  const entrance = translateExitToEntrance(previousPipe.exit);
  const exit = pipes[type].find((direction) => direction != entrance)!;

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

function getCharFromPosition(position: Coordinates) {
  return maze[position.y * (width + 1) + position.x];
}
