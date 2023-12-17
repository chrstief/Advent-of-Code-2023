const input: string = await Bun.file("./Day_17/a_sample.txt").text();
type Direction = "north" | "east" | "south" | "west";
type Node = {
  name: string;
  heat: number;
  neighbors: Record<Direction, string | undefined>;
};
function oppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "north":
      return "south";
    case "east":
      return "west";
    case "south":
      return "north";
    case "west":
      return "east";
  }
}
const graphArray = input.split("\n").map((row) => row.split(""));
const lastRow = graphArray.length - 1;
const lastColumn = graphArray[0].length - 1;
const graph: Node[] = graphArray.flatMap((row, rowIndex) =>
  row.map((char, columnIndex) => ({
    name: `${rowIndex}-${columnIndex}`,
    heat: Number(char),
    neighbors: {
      north: rowIndex > 0 ? `${rowIndex - 1}-${columnIndex}` : undefined,
      east:
        columnIndex + 1 <= lastColumn
          ? `${rowIndex}-${columnIndex + 1}`
          : undefined,
      south:
        rowIndex + 1 <= lastRow ? `${rowIndex + 1}-${columnIndex}` : undefined,
      west: columnIndex > 0 ? `${rowIndex}-${columnIndex - 1}` : undefined,
    },
  }))
);

function dijkstra(graph: Node[], startNode: Node, endNode: Node) {
  const distances = new Map<Node, number>(
    graph.map((node) => [node, node == startNode ? 0 : Infinity])
  );
  const previousNode = new Map<Node, { previous: Node; from: Direction }>();
  const unvisitedNodes = new Set<Node>(graph);

  while (unvisitedNodes.size) {
    //choose node with smallest current distance as next node to explore
    const nodeToExplore: Node = [...unvisitedNodes].reduce(
      (previousUnvisitedNode, unvisitedNode) =>
        distances.get(unvisitedNode)! < distances.get(previousUnvisitedNode)!
          ? unvisitedNode
          : previousUnvisitedNode
    );

    // return distance if reached the end
    if (nodeToExplore === endNode) return distances.get(nodeToExplore);

    //determine blocked directions
    const blockedDirections: Direction[] = [];
    if (previousNode.get(nodeToExplore))
      blockedDirections.push(
        oppositeDirection(previousNode.get(nodeToExplore)!.from)
      );
    const lastThreeDirections: Direction[] = [];
    let node = nodeToExplore;
    for (let i = 0; i < 3; i++) {
      if (!previousNode.get(node)) break;
      lastThreeDirections.push(previousNode.get(node)!.from);
      node = previousNode.get(node)!.previous;
    }
    if (
      lastThreeDirections.length === 3 &&
      lastThreeDirections.every(
        (direction) => direction === lastThreeDirections[0]
      )
    ) {
      blockedDirections.push(lastThreeDirections[0]);
    }

    //update distances to neighbors
    Object.entries(nodeToExplore.neighbors).forEach(([direction, neighborName]) => {
        if (!neighborName) return;
        const neighbor = graph.find((node) => node.name === neighborName)!;
        const newDistance = distances.get(nodeToExplore)! + neighbor.heat;
        if (
          !blockedDirections.includes(direction as Direction) &&
          newDistance < distances.get(neighbor)!
        ) {
          distances.set(neighbor, newDistance);
          previousNode.set(neighbor, {
            previous: nodeToExplore,
            from: direction as Direction,
          });
        }
      }
    );

    //current node has been explored
    unvisitedNodes.delete(nodeToExplore);
  }
}

console.log(dijkstra(graph, graph[0], graph[graph.length - 1]));
