const input: string = await Bun.file("./Day_11/a.txt").text();

const expansionFactor = 1000000;

//duplicate rows
const duplicatedRows = input.split("\n").map((row) => {
  if (!/#/.test(row))
    return row
      .split("")
      .map((element) => ({ element, rowExpansion: expansionFactor }));
  return row.split("").map((element) => ({ element, rowExpansion: 1 }));
});

//duplicate columns
const map = duplicatedRows.map((row, _, array) =>
  row.map((region, colIndex) => {
    if (!array.some((row) => /#/.test(row[colIndex].element)))
      return { ...region, colExpansion: expansionFactor };
    return { ...region, colExpansion: 1 };
  })
);

//find galaxies
type Coordinates = { colIndex: number; rowIndex: number };
const galaxies: Coordinates[] = [];
map.forEach((row, rowIndex) => {
  row.forEach((region, colIndex) => {
    if (region.element == "#") {
      const expandedColIndex = map[rowIndex].slice(0, colIndex).reduce((acc, region) => acc + region.colExpansion, 0)
      const expandedRowIndex=map.slice(0,rowIndex).reduce((acc,row)=>acc+row[colIndex].rowExpansion,0)
      galaxies.push({ rowIndex:expandedColIndex, colIndex:expandedRowIndex });
    }
  });
});


//calculate paths
const pathLengths: number[] = [];

for (let i = 0; i < galaxies.length - 1; i++) {
  const partners = galaxies.slice(i + 1);
  partners.forEach((partner) => {
    const colDistance = Math.abs(partner.colIndex - galaxies[i].colIndex);
    const rowDistance = Math.abs(partner.rowIndex - galaxies[i].rowIndex);
    pathLengths.push(colDistance + rowDistance);
  });
}

const answer = pathLengths.reduce((acc, pathLength) => acc + pathLength);
console.log(answer);
