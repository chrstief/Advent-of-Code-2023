const input: string = await Bun.file("./Day_05/a.txt").text();

const seedsAndRanges =
  input.match(createRegex("seeds"))?.map((string) => Number(string)) ?? [];
const filteredSeeds = seedsAndRanges.filter((value, index) => index % 2 === 0);
const filteredRanges = seedsAndRanges.filter((value, index) => index % 2 !== 0);
const seeds = filteredSeeds.map((seed, index) => ({
  value: seed,
  range: filteredRanges[index],
}));
// console.log({ seeds });

const mapNames: string[] = input.match(/[a-z-]+(?= map:)/g) ?? [];
// console.log(mapNames);
const maps = mapNames.map((mapName) => {
  const parsedNumbers =
    input
      .match(createRegex(`${mapName} map`))
      ?.map((string) => Number(string)) ?? [];

  let ranges: {
    destinationRangeStart: number;
    sourceRangeStart: number;
    range: number;
    sourceRangeEnd: number;
    translation: number;
  }[] = [];

  for (let i = 0; i < parsedNumbers.length; i += 3) {
    const destinationRangeStart = parsedNumbers[i];
    const sourceRangeStart = parsedNumbers[i + 1];
    const range = parsedNumbers[i + 2];
    const sourceRangeEnd = sourceRangeStart + range;
    const translation = destinationRangeStart - sourceRangeStart;
    ranges.push({
      destinationRangeStart: destinationRangeStart,
      sourceRangeStart: sourceRangeStart,
      range: range,
      sourceRangeEnd: sourceRangeEnd,
      translation: translation,
    });
  }

  return {
    mapName: mapName,
    ranges: ranges,
  };
});
// console.log(maps)

const lowestLocation = seeds.reduce((lowestLocationSoFar, seed) => {
  let lowestLocationThisBatch = Infinity;
  for (let i = 0; i < seed.range; i++) {
    const locationThisSeed = getFinalLocation(seed.value + i);
    lowestLocationThisBatch = Math.min(
      lowestLocationThisBatch,
      locationThisSeed
    );
  }
  return Math.min(lowestLocationThisBatch, lowestLocationSoFar);
}, Infinity);

console.log(lowestLocation);

function createRegex(mapName: string) {
  return new RegExp(`(?<=${mapName}:\\s(\\d+\\s)*)\\d+`, "g");
}

function getFinalLocation(seed: number) {
  const finalLocation = maps.reduce((source, map) => {
    // console.log({source});
    for (const range of map.ranges) {
      if (source >= range.sourceRangeStart && source < range.sourceRangeEnd)
        return source + range.translation;
    }

    return source;
  }, seed);

  // console.log(finalLocation);
  return finalLocation;
}
