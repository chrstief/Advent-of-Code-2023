const input: string = await Deno.readTextFile("./Day_05/a_sample.txt");

const seeds =
  input.match(createRegex("seeds"))?.map((string) => Number(string)) ?? [];
// console.log({ seeds });

const mapNames: string[] = input.match(/[a-z-]+(?= map:)/g) ?? [];
// console.log(mapNames);

const maps = mapNames.map((mapName) => {
  const parsedNumbers =
    input
      .match(createRegex(`${mapName} map`))
      ?.map((string) => Number(string)) ?? [];
  // console.log(mapName,parsedNumbers)

  return {
    mapName: mapName,
    ranges: determineRanges(parsedNumbers),
  };
});
// console.log(maps);

const soil = translateToDestination(seeds, maps[0]);
const fertilizer = translateToDestination(soil, maps[1]);
const water = translateToDestination(fertilizer, maps[2]);
const light = translateToDestination(water, maps[3]);
const temperature = translateToDestination(light, maps[4]);
const humidity = translateToDestination(temperature, maps[5]);
const finalLocation = translateToDestination(humidity, maps[6]);

console.log(Math.min(...finalLocation));

function createRegex(mapName: string) {
  return new RegExp(`(?<=${mapName}:\\s(\\d+\\s)*)\\d+`, "g");
}

function determineRanges(parsedNumbers: number[]) {
  let ranges: {
    source: number;
    destination: number;
  }[] = [];

  for (let i = 0; i < parsedNumbers.length; i += 3) {
    const destinationRangeStart = parsedNumbers[i];
    const sourceRangeStart = parsedNumbers[i + 1];
    const range = parsedNumbers[i + 2];
    for (let j = 0; j < range; j++) {
      ranges.push({
        source: sourceRangeStart + j,
        destination: destinationRangeStart + j,
      });
    }
  }
  return ranges.sort((a, b) => a.source - b.source);
}

function translateToDestination(
  start: typeof seeds,
  map: (typeof maps)[number]
) {
  return start.map((source) => {
    return (
      map.ranges.find((range) => source == range.source)?.destination ?? source
    );
  });
}
