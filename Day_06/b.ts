const input = await Bun.file("./Day_06/a.txt").text();

const lines = input.split("\n");

const times = [Number(lines[0].split(":")[1]?.replace(/\s*/g, ""))];
const distances = [Number(lines[1].split(":")[1]?.replace(/\s*/g, ""))];

const races = times?.map((time, index) => ({
  time: time,
  recordDistance: distances[index],
}));
// console.log(races)

const result = races.reduce((accumulator, race) => {
  const waysToWin: number[] = [];
  for (
    let buttonPressTime = 0;
    buttonPressTime <= race.time;
    buttonPressTime++
  ) {
    const distanceTraveled = (race.time - buttonPressTime) * buttonPressTime;
    // console.log({buttonPressTime},{distanceTraveled})
    if (distanceTraveled > race.recordDistance) waysToWin.push(buttonPressTime);
  }
  // console.log(waysToWin)
  return accumulator * waysToWin.length;
}, 1);

console.log(result);
