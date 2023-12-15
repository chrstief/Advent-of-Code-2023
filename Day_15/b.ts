const input: string = await Bun.file("./Day_15/a.txt").text();

type Label = string;
type FocalLenght = number;
type Lens = { label: Label; focalLenght: FocalLenght };
type Operation = "-" | "=";
type Step = {
  lens: Lens;
  operation: Operation;
};
class Box {
  boxNumber: number;
  lenses: Map<Label, FocalLenght>;

  constructor(boxNumber: number) {
    this.boxNumber = boxNumber;
    this.lenses = new Map();
  }
  addLens(lens: Lens) {
    this.lenses.set(lens.label, lens.focalLenght);
  }
  removeLens(lens: Lens) {
    this.lenses.delete(lens.label);
  }
  calcFocussingPower() {
    if (this.lenses.size === 0) return 0;
    return Array.from(this.lenses.values()).reduce(
      (acc, focalLenght, lensIndex) =>
        acc + (this.boxNumber + 1) * (lensIndex + 1) * focalLenght,
      0
    );
  }
}

function hashAlgorithm(input: string) {
  return input
    .split("")
    .reduce(
      (innerAcc, char) => ((innerAcc + char.charCodeAt(0)) * 17) % 256,
      0
    );
}

const steps: Step[] = input.split(",").map((string) => ({
  lens: {
    label: string.match(/[a-z]+/g)?.[0] as string,
    focalLenght: Number(string.match(/\d+/g)),
  },
  operation: string.match(/\W/g)?.[0] as Operation,
}));
const boxes = Array.from({ length: 256 }, (_, index) => new Box(index));

steps.forEach((step) => {
  const boxIndex = hashAlgorithm(step.lens.label);
  switch (step.operation) {
    case "-":
      boxes[boxIndex].removeLens(step.lens);
      break;
    case "=":
      boxes[boxIndex].addLens(step.lens);
      break;
  }
});

const answer = boxes.reduce((acc, box) => acc + box.calcFocussingPower(), 0);
console.log(answer);
