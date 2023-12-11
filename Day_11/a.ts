const input: string = await Bun.file("./Day_11/a.txt").text();

//duplicate rows
const duplicatedRows = input
  .split("\n")
  .flatMap((row) => {
    if (!/#/.test(row)) return [row, row];
    return row;
  })
  .map((row) => row.split(""));

//duplicate columns
const map = duplicatedRows.map((row, _, array) =>
  row.flatMap((element, colIndex) => {
    if (!array.some((row) => /#/.test(row[colIndex])))
      return [element, element];
    return element;
  })
);

//find galaxies
type Coordinates = { colIndex: number; rowIndex: number };
const galaxies: Coordinates[] = [];
map.forEach((row, rowIndex) => {
  row.forEach((element, colIndex) => {
    if (element == "#") galaxies.push({ colIndex, rowIndex });
  });
});

const pathLengths: number[] = [];

for (let i = 0; i < galaxies.length - 1; i++) {
  const partners = galaxies.slice(i + 1);
  partners.forEach((partner) => {
    const colDistance = Math.abs(partner.colIndex - galaxies[i].colIndex);
    const rowDistance = Math.abs(partner.rowIndex - galaxies[i].rowIndex);
    pathLengths.push(colDistance + rowDistance);
  });
}

const answer=pathLengths.reduce((acc,pathLength)=>acc+pathLength)
console.log(answer);
