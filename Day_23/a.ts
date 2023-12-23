const input: string = await Bun.file("./Day_23/a.txt").text();

const map = input.split("\n").map((line) => line.split(""));
const maxRow = map.length - 1;
const maxCol = map[0].length - 1;

type Node = {
  name: string;
  type: string;
  connections: string[];
};
const graph: Node[] = map
  .flatMap((row, rowIndex) =>
    row.map((char, colIndex) => {
      const connections: string[] = [];
      switch (char) {
        case "<":
          connections.push(`${rowIndex}-${colIndex - 1}`);
          break;
        case ">":
          connections.push(`${rowIndex}-${colIndex + 1}`);
          break;
        case "^":
          connections.push(`${rowIndex - 1}-${colIndex}`);
          break;
        case "v":
          connections.push(`${rowIndex + 1}-${colIndex}`);
          break;
        case ".":
          if (rowIndex > 0) {
            const neighborRow = rowIndex - 1;
            const neighborCol = colIndex;
            if (map[neighborRow][neighborCol] !== "#")
              connections.push(`${neighborRow}-${neighborCol}`);
          }
          if (colIndex > 0) {
            const neighborRow = rowIndex;
            const neighborCol = colIndex - 1;
            if (map[neighborRow][neighborCol] !== "#")
              connections.push(`${neighborRow}-${neighborCol}`);
          }
          if (rowIndex < maxRow) {
            const neighborRow = rowIndex + 1;
            const neighborCol = colIndex;
            if (map[neighborRow][neighborCol] !== "#")
              connections.push(`${neighborRow}-${neighborCol}`);
          }
          if (colIndex < maxCol) {
            const neighborRow = rowIndex;
            const neighborCol = colIndex + 1;
            if (map[neighborRow][neighborCol] !== "#")
              connections.push(`${neighborRow}-${neighborCol}`);
          }
      }
      const node = {
        name: `${rowIndex}-${colIndex}`,
        type: char,
        connections: connections,
      };
      return node;
    })
  )
  .filter((node) => node.type !== "#");

const startNode = graph[0];
const endNode = graph[graph.length - 1];
const steps = [startNode];
const paths: Node[][] = [];

dfs(steps);
const answer = Math.max(...paths.map((path) => path.length - 1));
console.log(answer);

function dfs(previousSteps: Node[]) {
  const currentStep = previousSteps[previousSteps.length - 1];
  const nextSteps = currentStep.connections.filter(
    (connection) =>
      !previousSteps
        .map((previousStep) => previousStep.name)
        .includes(connection)
  );
  nextSteps.forEach((nextStep) => {
    const nextNode = graph.find((node) => node.name === nextStep);
    if (!nextNode) throw new Error("nextNode wasn't found in graph");
    const steps = [...previousSteps, nextNode];
    if (nextStep === endNode.name) {
      paths.push(steps);
    } else {
      dfs(steps);
    }
  });
}
