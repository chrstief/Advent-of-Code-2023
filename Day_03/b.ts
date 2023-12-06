const input: string = await Bun.file("./Day_03/a.txt").text();

const lines = input.split("\n");

const gearRatios: number[] = [];

lines.forEach((line, lineIndex) => {
  const starSymbols = line.matchAll(/[*]/g);

  for (const match of starSymbols) {
    // console.log(
    //   `Found ${match[0]} start=${match.index} end=${
    //     match.index + match[0].length - 1
    //   }.`
    // );
    gearRatios.push(calcGearRatio(lineIndex, match.index));
  }
});
// console.log(partNumbers);
const answer = gearRatios.reduce(
  (accumulator, currentValue) => accumulator + currentValue
);

console.log(answer);

function calcGearRatio(lineNumber: number, index: number) {
  const numbers = /\d+/g;
  const numbersAbove = lines[lineNumber - 1].matchAll(numbers);
  const numbersBesides = lines[lineNumber].matchAll(numbers);
  const numbersBelow = lines[lineNumber + 1].matchAll(numbers);

  function filterForAdjacentNumbers(matches) {
    const adjacentNumbers: number[] = [];
    for (const match of matches) {
      const start = match.index;
      const end = match.index + match[0].length - 1;
      // console.log(`Found ${match[0]} start=${start} end=${end}.`);
      const adjacent = start <= index + 1 && end >= index - 1;
      // console.log({ adjacent });
      if (adjacent) adjacentNumbers.push(Number(match[0]));
    }
    return adjacentNumbers;
  }

  const adjacentNumbers = [
    ...filterForAdjacentNumbers(numbersAbove),
    ...filterForAdjacentNumbers(numbersBesides),
    ...filterForAdjacentNumbers(numbersBelow),
  ];

  const gearRatio =
    adjacentNumbers.length == 2 ? adjacentNumbers[0] * adjacentNumbers[1] : 0;

  return gearRatio;
}
