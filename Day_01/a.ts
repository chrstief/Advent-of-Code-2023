const input: string = await Bun.file("./Day_01/a.txt").text();

const lines = input.split("\n");
const characterLines = lines.map((line) => line.split(""));

const initialValue = 0;
const answer = characterLines.reduce((accumulator, charakterLine) => {
  const firstNumber = charakterLine.find((char) => Number(char));
  const lastNumber = charakterLine.findLast((char) => Number(char));
  return accumulator + Number(firstNumber + lastNumber);
}, initialValue);

console.log(answer);
