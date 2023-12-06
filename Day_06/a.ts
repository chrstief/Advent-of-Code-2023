const input: string = await Deno.readTextFile("./Day_06/a.txt");

function createRegex(mapName: string) {
    return new RegExp(`(?<=${mapName}:\\s+(\\d+\\s+)*)\\d+`, "g");
}
  
const times =
  input.match(createRegex("Time"))?.map((string) => Number(string)) ?? [];
const distances =
  input.match(createRegex("Distance"))?.map((string) => Number(string)) ?? [];

const races = times?.map((time, index) => ({
  time: time,
  recordDistance: distances[index],
}));

const result = races.reduce((accumulator, race) => {
    const waysToWin: number[] = []
    for (let buttonPressTime = 0; buttonPressTime <= race.time; buttonPressTime++){
        const distanceTraveled = (race.time - buttonPressTime)*buttonPressTime
        // console.log({buttonPressTime},{distanceTraveled})
        if (distanceTraveled>race.recordDistance) waysToWin.push(buttonPressTime)
    }
    // console.log(waysToWin)
    return accumulator*waysToWin.length
},1)

console.log(result);


