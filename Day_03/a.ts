const input: string = await Bun.file("./Day_03/a.txt").text();

const lines = input.split("\n");

const partNumbers: number[] = [];

lines.forEach((line, lineIndex) => {
  const matches = findNumbers(line);
  // console.log(line);
  for (const match of matches) {
    console.log(
      `Found ${match[0]} start=${match.index} end=${
        match.index + match[0].length - 1
      }.`
    );
    if (
      isPartNumber(lineIndex, match.index, match.index + match[0].length - 1)
    ) {
      partNumbers.push(Number(match[0]));
    }
  }
});
console.log(partNumbers);
const answer = partNumbers.reduce(
  (accumulator, currentValue) => accumulator + currentValue
);

console.log(answer);

function findNumbers(line: string) {
  return line.matchAll(/[^.\W]+/g);
}

function isPartNumber(lineIndex: number, start: number, end: number) {
  const lineAbove = lines[lineIndex - 1]?.substring(start - 1, end + 2);
  const thisLine = lines[lineIndex].substring(start - 1, end + 2);
  const lineBelow = lines[lineIndex + 1]?.substring(start - 1, end + 2);

  console.log("lineAbove", lineAbove, includesSymbol(lineAbove));
  console.log("thisLine", thisLine, includesSymbol(thisLine));
  console.log("lineBelow", lineBelow, includesSymbol(lineBelow));

  return (
    includesSymbol(thisLine) ||
    includesSymbol(lineAbove) ||
    includesSymbol(lineBelow)
  );
}

function includesSymbol(line: string) {
  return /[^.\w]/.test(line);
}
