const input: string = await Bun.file("./Day_23/a.txt").text();

const map = input.split("\n").map((line) => line.split(""));
const maxRow = map.length - 1;
const maxCol = map[0].length - 1;

type Connection = { node: Node; weight: number };
type Node = {
  name: string;
  type: string;
  connectionNames: string[];
  connections: Connection[];
};
const graph: Node[] = map
  .flatMap((row, rowIndex) =>
    row.map((char, colIndex) => {
      const connections: string[] = [];
      switch (char) {
        case "<":
        // connections.push(`${rowIndex}-${colIndex - 1}`);
        // break;
        case ">":
        // connections.push(`${rowIndex}-${colIndex + 1}`);
        // break;
        case "^":
        // connections.push(`${rowIndex - 1}-${colIndex}`);
        // break;
        case "v":
        // connections.push(`${rowIndex + 1}-${colIndex}`);
        // break;
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
        connectionNames: connections,
        connections: [],
      };
      return node;
    })
  )
  .filter((node) => node.type !== "#");

graph.forEach((node) => {
  node.connections = node.connectionNames.map((connectionName) => ({
    node: graph.find((node) => node.name === connectionName)!,
    weight: 1,
  }));
});

const startNode = graph[0];
const endNode = graph[graph.length - 1];

const junctions: Node[] = graph
  .filter(
    (node) =>
      node.connections.length > 2 || node == startNode || node == endNode
  )
  .map((junction) => ({
    ...junction,
    connections: junction.connections.map((connection) =>
      getNextJunction(connection.node, junction)
    ),
  }));

//update references to point to elements of junctions array
junctions.forEach((node) => {
  // node.connections = node.connections.map((connection) => ({
  //   ...connection,
  //   node: junctions.find((node) => node === connection.node)!,
  // }));
  node.connectionNames = node.connections.map(
    (connection) => connection.node.name
  );
  node.connections = node.connections.map((connection) => ({
    ...connection,
    node: junctions.find((node) => node.name === connection.node.name)!,
  }));
});

function getNextJunction(
  currentStep: Node,
  previousStep: Node,
  steps = 1
): Connection {
  if (
    currentStep.connections.length > 2 ||
    currentStep.connections.length === 1
  )
    return { node: currentStep, weight: steps };
  const nextStep = currentStep.connections.find(
    (connection) => connection.node != previousStep
  )!.node;
  return getNextJunction(nextStep, currentStep, steps + 1);
}

const endNodeJunction = junctions[junctions.length - 1];
const steps = [junctions[0]];
const paths: number[] = [];

dfs(steps, endNodeJunction, paths);
// const answer = Math.max(...paths); //exceed maximum call stack size
const answer = paths.reduce((acc, path) => (path > acc ? path : acc));
console.log(answer);

function dfs(
  previousSteps: Node[],
  endNode: Node,
  paths: number[],
  previousWeight = 0
) {
  const currentStep = previousSteps[previousSteps.length - 1];
  const nextSteps = currentStep.connections
    .filter((connection) => !previousSteps.includes(connection.node))
    .map((connection) => connection.node);
  nextSteps.forEach((nextStep) => {
    const weight =
      previousWeight +
      currentStep.connections.find(
        (connection) => connection.node === nextStep
      )!.weight;
    const steps = [...previousSteps, nextStep];
    if (nextStep === endNode) {
      paths.push(weight);
    } else {
      dfs(steps, endNode, paths, weight);
    }
  });
}
