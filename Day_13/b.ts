const input: string = await Bun.file("./Day_13/a.txt").text();

type Pattern = string[];
const patterns: Pattern[] = input
  .split("\n\n")
  .map((pattern) => pattern.split("\n"));

const transposedPatterns: Pattern[] = patterns.map((pattern) =>
  pattern[0]
    .split("")
    .map((_, columnIndex) => pattern.map((row) => row[columnIndex]).join(""))
);

// console.log(transposedPatterns);
const horizontalReflectionLines = patterns.map((pattern) =>
  findReflectionLine(pattern, 0)
);
console.log({ horizontalReflectionLines });

const verticalReflectionLines = transposedPatterns.map((pattern, index) => {
  if (horizontalReflectionLines[index] != 0) return 0;
  return findReflectionLine(pattern, 0);
});
console.log({ verticalReflectionLines });

const answer =
  verticalReflectionLines.reduce((acc, element) => acc + element) +
  100 * horizontalReflectionLines.reduce((acc, element) => acc + element);
console.log(answer);

function findReflectionLine(pattern: Pattern, startIndex: number) {
  let smudgeCleaned = false;
  const arrayToCheck = pattern.slice(startIndex);

  const localReflectionLine = arrayToCheck.findIndex((row, index, array) => {
    const numberOfDifferences = getNumberOfDifferences(row, array[index + 1]);
    switch (numberOfDifferences) {
      case 0:
        return true;
      case 1:
        if (!smudgeCleaned) {
          smudgeCleaned = true;
          return true;
        }
      default:
        return false;
    }
  });
  if (localReflectionLine == -1) return 0;

  const globalReflectionLine = localReflectionLine + startIndex;

  const linesFromReflectionToEnd = Math.min(
    globalReflectionLine,
    pattern.length - globalReflectionLine - 2
  );

  for (let i = 1; i <= linesFromReflectionToEnd; i++) {
    const up = pattern[globalReflectionLine - i];
    const down = pattern[globalReflectionLine + 1 + i];
    const numberOfDifferences = getNumberOfDifferences(up, down);
    switch (numberOfDifferences) {
      case 0:
        break;
      case 1:
        if (!smudgeCleaned) {
          smudgeCleaned = true;
          break;
        }
      default:
        return findReflectionLine(pattern, globalReflectionLine + 1);
    }
  }

  if (!smudgeCleaned)
    return findReflectionLine(pattern, globalReflectionLine + 1);

  return globalReflectionLine + 1;
}

function getNumberOfDifferences(str1: string, str2: string) {
  if (!str2) return Infinity;
  const differences = str1
    .split("")
    .map((char1, index) => char1 != str2[index]);
  return differences.filter((difference) => difference).length;
}

console.log(
  horizontalReflectionLines.findIndex(
    (hrl, index) => hrl == 0 && verticalReflectionLines[index] == 0
  )
);
