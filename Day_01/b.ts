const input: string = await Bun.file("./Day_01/b.txt").text();

const lines = input.split("\n");

const processedLines = lines.map((line) => {
  return line
    .replaceAll("one", "one1one")
    .replaceAll("two", "two2two")
    .replaceAll("three", "three3three")
    .replaceAll("four", "four4four")
    .replaceAll("five", "five5five")
    .replaceAll("six", "six6six")
    .replaceAll("seven", "seven7seven")
    .replaceAll("eight", "eight8eight")
    .replaceAll("nine", "nine9nine");
});

const characterLines = processedLines.map((line) => line.split(""));

const initialValue = 0;
const answer = characterLines.reduce((accumulator, charakterLine, i) => {
  const firstNumber = charakterLine.find((char) => Number(char));
  const lastNumber = charakterLine.findLast((char) => Number(char));
  return accumulator + Number(firstNumber + lastNumber);
}, initialValue);

console.log(answer);
