const input: string = await Bun.file("./Day_02/b.txt").text();

const lines = input.split("\n");

type draw = {
  red: number;
  green: number;
  blue: number;
};

type game = {
  id: number;
  draws: draw[];
};

function getGameID(line: string) {
  return;
}

const allGames: game[] = lines.map((line) => {
  const gameID = Number(line.match(/(?<=Game )[0-9]+/)![0]);
  const draws: draw[] = line.split(";").map((drawString) => ({
    red: Number(drawString.match(/\d+(?= red)/)?.[0]) || 0,
    blue: Number(drawString.match(/\d+(?= blue)/)?.[0]) || 0,
    green: Number(drawString.match(/\d+(?= green)/)?.[0]) || 0,
  }));

  return { id: gameID, draws: draws };
});

const fewestNeededCubes = allGames.map((game) => ({
  maxRed: Math.max(...game.draws.map((draw) => draw.red)),
  maxGreen: Math.max(...game.draws.map((draw) => draw.green)),
  maxBlue: Math.max(...game.draws.map((draw) => draw.blue)),
}));

const initialValue = 0;
const answer = fewestNeededCubes.reduce(
  (accumulator, game) =>
    accumulator + game.maxRed * game.maxGreen * game.maxBlue,
  initialValue
);

console.log(answer);
