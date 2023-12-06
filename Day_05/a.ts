const input: string = await Bun.file("./Day_05/a.txt").text();

const seeds =
  input.match(createRegex("seeds"))?.map((string) => Number(string)) ?? [];
// console.log({ seeds });

const mapNames: string[] = input.match(/[a-z-]+(?= map:)/g) ?? [];
// console.log(mapNames);

const finalLocation = mapNames.reduce((accumulator, mapName) => {
  const parsedNumbers =
    input
      .match(createRegex(`${mapName} map`))
      ?.map((string) => Number(string)) ?? [];
  // console.log(mapName,parsedNumbers)

  const destinations = accumulator.map((source) => {
    for (let i = 0; i < parsedNumbers.length; i += 3) {
      const destinationRangeStart = parsedNumbers[i];
      const sourceRangeStart = parsedNumbers[i + 1];
      const range = parsedNumbers[i + 2];
      if (source >= sourceRangeStart && source < sourceRangeStart + range)
        return source + (destinationRangeStart - sourceRangeStart);
    }
    return source;
  });

  return destinations;
}, seeds);

// console.log(finalLocation);
console.log(Math.min(...finalLocation));

function createRegex(mapName: string) {
  return new RegExp(`(?<=${mapName}:\\s(\\d+\\s)*)\\d+`, "g");
}
