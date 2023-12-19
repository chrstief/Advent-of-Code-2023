const input: string = await Bun.file("./Day_19/a.txt").text();

const [workflowStrings, partStrings] = input
  .split("\n\n")
  .map((line) => line.split("\n"));

// console.log(partStrings)
type Rule = {
  condition: string;
  destination: string;
  ruleIndex: number;
  workflow: string;
};
type Workflow = { name: string; rules: Rule[] };
const workflows: Workflow[] = workflowStrings.map((workflowString) => {
  const [name, ruleStrings] = workflowString.slice(0, -1).split("{");
  const rules = ruleStrings.split(",").map((ruleString, ruleIndex) => {
    let [condition, destination] = ruleString.split(":");
    if (!destination) {
      destination = condition;
      condition = "true";
    }
    return { condition, destination, ruleIndex, workflow: name };
  });
  return { name, rules };
});

// console.log(workflows);

const rules = workflows.flatMap((workflow) => workflow.rules);
const accepted = rules.filter((rule) => rule.destination === "A");
const px = rules.find((rule) => rule.destination === "px");

// console.log(workflows);

type PathOfRules = { rule: Rule; invert: boolean }[];
function backtrackConditions(rule: Rule): PathOfRules {
  const previousConditions = [
    { rule, invert: false },
    ...workflows
      .find((workflow) => workflow.name === rule.workflow)!
      .rules.slice(0, rule.ruleIndex)
      .map((rule) => ({ rule, invert: true })),
  ];

  if (rule.workflow === "in") return previousConditions;

  const previousRule = rules.find((r) => r.destination === rule.workflow)!;

  return [...previousConditions, ...backtrackConditions(previousRule)];
}

// const test = backtrackConditions(accepted[0]);
// console.log();

type Range = { min: number; max: number };
type Ranges = { x: Range; m: Range; a: Range; s: Range };
function calculateRanges(pathOfRules: PathOfRules): Ranges {
  const startRange: Range = { min: 1, max: 4000 };
  const ranges: Ranges = {
    x: { ...startRange },
    m: { ...startRange },
    a: { ...startRange },
    s: { ...startRange },
  };
  pathOfRules.forEach(({ invert, rule }) => {
    const category = rule.condition[0] as keyof Ranges;
    const comparisonOperator = rule.condition[1];
    const limit = Number(rule.condition.substring(2, rule.condition.length));
    if (comparisonOperator === "<") {
      if (!invert) ranges[category].max = Math.min(ranges[category].max, limit-1);
      if (invert) ranges[category].min = Math.max(ranges[category].min, limit);
    }
    if (comparisonOperator === ">") {
      if (!invert) ranges[category].min = Math.max(ranges[category].min, limit+1);
      if (invert) ranges[category].max = Math.min(ranges[category].max, limit);
    }
  });
  return ranges;
}
// const testRanges=calculateRanges(test)
// console.log();

const ranges = accepted.map((rule) => calculateRanges(backtrackConditions(rule)));
const answer = ranges.reduce(
  (acc, range) =>
    acc +
    (range.x.max - range.x.min + 1) *
      (range.m.max - range.m.min + 1) *
      (range.a.max - range.a.min + 1) *
      (range.s.max - range.s.min + 1),
  0
);
console.log(answer);