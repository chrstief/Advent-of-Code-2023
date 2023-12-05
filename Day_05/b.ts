const input: string = await Deno.readTextFile("./Day_05/a.txt");

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
  const finalLocation = mapNames.reduce((source, mapName) => {
    // console.log({source});
    const parsedNumbers =
      input
        .match(createRegex(`${mapName} map`))
        ?.map((string) => Number(string)) ?? [];
    // console.log(mapName,parsedNumbers)

    for (let i = 0; i < parsedNumbers.length; i += 3) {
      const destinationRangeStart = parsedNumbers[i];
      const sourceRangeStart = parsedNumbers[i + 1];
      const range = parsedNumbers[i + 2];
      if (source >= sourceRangeStart && source < sourceRangeStart + range)
        return source + (destinationRangeStart - sourceRangeStart);
    }

    return source;
  }, seed);

  // console.log(finalLocation);
  return finalLocation;
}
