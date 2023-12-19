const input: string = await Bun.file("./Day_19/a.txt").text();

const [workflowStrings, partStrings] = input
  .split("\n\n")
  .map((line) => line.split("\n"));

// console.log(partStrings)
type Rule = { condition: string; destination: string };
type Workflow = { name: string; rules: Rule[] };
const workflows: Workflow[] = workflowStrings.map((workflowString) => {
  const [name, ruleStrings] = workflowString.slice(0, -1).split("{");
  const rules = ruleStrings.split(",").map((ruleString) => {
    let [condition, destination] = ruleString.split(":");
    if (!destination) {
      destination = condition;
      condition = "true";
    }
    return { condition, destination };
  });
  return { name, rules };
});

type Part = { x: number; m: number; a: number; s: number };
const parts: Part[] = partStrings.map((partString) => {
  const [x, m, a, s] = partString.slice(0, -1).split(",");
  return {
    x: Number(x.split("=")[1]),
    m: Number(m.split("=")[1]),
    a: Number(a.split("=")[1]),
    s: Number(s.split("=")[1]),
  };
});

// console.log(parts);

function executeWorkflow(part: Part, workflow: Workflow) {
  const { x, m, a, s } = part;
  for (let i = 0; i < workflow.rules.length; i++) {
    const conditionString = workflow.rules[i].condition;
    const evaluateCondition = new Function(
      "x",
      "m",
      "a",
      "s",
      `return ${conditionString};`
    );
    if (evaluateCondition(x, m, a, s)) {
      const destination = workflow.rules[i].destination;
      if (destination === "A" || destination === "R")
        return { part, result: destination };
      const nextWorkflow = workflows.find(
        (workflow) => workflow.name === destination
      );
      if (!nextWorkflow) throw new Error("next workflow not found");
      return executeWorkflow(part, nextWorkflow);
    }
  }
}

const startWorkflow = workflows.find((wf) => wf.name === "in");
if (!startWorkflow) throw new Error("start workflow not found");
const results = parts.map((part) => executeWorkflow(part, startWorkflow));
const answer = results
  .filter((result) => result?.result === "A")
  .reduce(
    (acc, result) =>
      acc + result!.part.x + result!.part.m + result!.part.a + result!.part.s,
    0
  );
console.log(answer);
