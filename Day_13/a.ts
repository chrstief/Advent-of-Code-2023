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

const verticalReflectionLines = transposedPatterns.map((pattern) =>
  findReflectionLine(pattern, 0)
);
// console.log({verticalReflectionLines});

const answer =
  verticalReflectionLines.reduce((acc, element) => acc + element) +
  100 * horizontalReflectionLines.reduce((acc, element) => acc + element);
console.log(answer);

function findReflectionLine(pattern: Pattern, startIndex: number) {
  const arrayToCheck = pattern.slice(startIndex);
  const localReflectionLine = arrayToCheck.findIndex(
    (row, index) => row == arrayToCheck[index + 1]
  );
  if (localReflectionLine == -1) return 0;

  const globalReflectionLine = localReflectionLine + startIndex;

  const linesFromReflectionToEnd = Math.min(
    globalReflectionLine,
    pattern.length - globalReflectionLine -2
  );
  for (let i = 1; i <= linesFromReflectionToEnd; i++) {
    const up = pattern[globalReflectionLine - i];
    const down = pattern[globalReflectionLine + 1 + i];
    const same = up == down;
    if (!same) return findReflectionLine(pattern, globalReflectionLine + 1);
  }
  return globalReflectionLine + 1;
}
