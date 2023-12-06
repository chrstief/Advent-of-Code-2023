const input: string = await Bun.file("./Day_02/a.txt").text();

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

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

const possibleGames = allGames.filter((game) =>
  game.draws.every(
    (draw) =>
      draw.red <= maxRed && draw.green <= maxGreen && draw.blue <= maxBlue
  )
);

const initialValue = 0;
const answer = possibleGames.reduce(
  (accumulator, game) => accumulator + game.id,
  initialValue
);

console.log(answer);
