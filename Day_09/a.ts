const input: string = await Bun.file("./Day_09/a.txt").text();
const measurements = input
  .split("\n")
  .map((line) => line.split(" ").map((char) => Number(char)));

// console.log(measurements)

const answer = measurements
  .map((measurement) => {
    let differenceSequences = [measurement];
    while (true) {
      const differences = calcDifferences(
        differenceSequences[differenceSequences.length - 1]
      );
      if (differences.every((difference) => difference === 0)) break;
      differenceSequences.push(differences);
    }
    // console.log(differenceSequences);
    const nextHistoryValue = differenceSequences.reduce(
      (acc, differences) => acc + differences[differences.length - 1],
      0
    );
    // console.log(nextHistoryValue);
    return nextHistoryValue;
  })
  .reduce((acc, nextHistoryValue) => acc + nextHistoryValue);
console.log(answer);

function calcDifferences(series: number[]) {
  return Array.from(
    { length: series.length - 1 },
    (_, index) => series[index + 1] - series[index]
  );
}
