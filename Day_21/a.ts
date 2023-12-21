const input: string = await Bun.file("./Day_21/a.txt").text();

const map = input.split("\n").map((row) => row.split(""));
const maxRow = map.length - 1;
const maxCol = map[0].length - 1;

let reachableNodes = new Set<string>();
const graph = new Map<string, string[]>();
map.forEach((row, rowIndex) =>
  row.forEach((char, colIndex) => {
    if (char === "#") return;
    if (char === "S") reachableNodes.add(`${rowIndex}-${colIndex}`);
    let neighbors: string[] = [];
    if (rowIndex > 0) {
      const neighborRow = rowIndex - 1;
      const neighborCol = colIndex;
      const neighborType = map[neighborRow][neighborCol];
      if (neighborType !== "#") neighbors.push(`${neighborRow}-${neighborCol}`);
    }
    if (rowIndex < maxRow) {
      const neighborRow = rowIndex + 1;
      const neighborCol = colIndex;
      const neighborType = map[neighborRow][neighborCol];
      if (neighborType !== "#") neighbors.push(`${neighborRow}-${neighborCol}`);
    }
    if (colIndex > 0) {
      const neighborRow = rowIndex;
      const neighborCol = colIndex - 1;
      const neighborType = map[neighborRow][neighborCol];
      if (neighborType !== "#") neighbors.push(`${neighborRow}-${neighborCol}`);
    }
    if (colIndex < maxCol) {
      const neighborRow = rowIndex;
      const neighborCol = colIndex + 1;
      const neighborType = map[neighborRow][neighborCol];
      if (neighborType !== "#") neighbors.push(`${neighborRow}-${neighborCol}`);
    }

    graph.set(`${rowIndex}-${colIndex}`, neighbors);
  })
);

for (let step = 1; step <= 64; step++) {
  const nextReachableNodes = new Set<string>();
  reachableNodes.forEach((node) => {
    const neighbors = graph.get(node)!;
    neighbors.forEach((neighbor) => nextReachableNodes.add(neighbor));
  });
  reachableNodes = nextReachableNodes;
  console.log("step:", step, "nodesToVisit.size:", reachableNodes.size);
  // debugVisualisation();
}

function debugVisualisation() {
  const mapCopy: string[][] = JSON.parse(JSON.stringify(map));
  reachableNodes.forEach((node) => {
    const [row, col] = node.split("-").map((string) => Number(string));
    mapCopy[row][col] = "0";
  });
  console.log(
    "*",
    Array.from({ length: maxCol + 1 }, (_, colIndex) => colIndex).join(" ")
  );
  mapCopy.forEach((row, rowIndex) => console.log(rowIndex, row.join(" ")));
}
