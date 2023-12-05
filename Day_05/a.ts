const input: string = await Deno.readTextFile("./Day_05/a_sample.txt");

const seeds =
  input.match(createRegex("seeds"))?.map((string) => Number(string)) ?? [];
// console.log({ seeds });

const mapNames: string[] = input.match(/[a-z-]+(?= map:)/g) ?? [];
// console.log(mapNames);

const finalLocation = mapNames.reduce((accumulator,mapName) => {
  const parsedNumbers =
    input
      .match(createRegex(`${mapName} map`))
      ?.map((string) => Number(string)) ?? [];
  // console.log(mapName,parsedNumbers)
  const map={
    mapName: mapName,
    ranges: determineRanges(parsedNumbers),
  }
  // console.log({map})

  return translateToDestination(accumulator, map)
},seeds);

console.log(Math.min(...finalLocation));

function createRegex(mapName: string) {
  return new RegExp(`(?<=${mapName}:\\s(\\d+\\s)*)\\d+`, "g");
}

function determineRanges(parsedNumbers: number[]) {
  const numberOfMappings = parsedNumbers.reduce(
    (accumulator, value, index) =>
      (index + 1) % 3 == 0 ? accumulator + value : accumulator,
    0
  );
  // console.log(numberOfMappings);
  let ranges: {
    source: number;
    destination: number;
  }[] = new Array(numberOfMappings);

  let rangesIndexOffset = 0
  for (let i = 0; i < parsedNumbers.length; i += 3) {
    const destinationRangeStart = parsedNumbers[i];
    const sourceRangeStart = parsedNumbers[i + 1];
    const range = parsedNumbers[i + 2];
    for (let j = 0; j < range; j++) {
      ranges[rangesIndexOffset + j] = {
        source: sourceRangeStart + j,
        destination: destinationRangeStart + j,
      };
    }
    rangesIndexOffset += range
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