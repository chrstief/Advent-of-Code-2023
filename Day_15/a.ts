const input: string = await Bun.file("./Day_15/a.txt").text();

const strings = input.split(",").map((string) => string.split(""));
console.log(strings);


const answer = strings.reduce(
  (acc, stringArray) =>
    acc +
    stringArray.reduce((innerAcc, char) => ((innerAcc + char.charCodeAt(0))*17)%256, 0),
  0
);

console.log(answer)
