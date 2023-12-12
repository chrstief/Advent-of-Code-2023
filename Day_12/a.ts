const input: string = await Bun.file("./Day_12/a.txt").text();

const rows = input.split("\n").map((row) => ({
  record: row.split(" ")[0],
  groups: row
    .split(" ")[1]
    .split(",")
    .map((group) => Number(group)),
}));

const arrangements = rows.map((row) => recursivelyTryCombinations(row));
// console.log(arrangements);
const answer = arrangements.reduce((acc, element) => acc + element)
console.log(answer)


function testRow(row: (typeof rows)[number]) {
  const matches = row.record.match(/#+/g);
  const lengths = matches?.map((match) => match.length) ?? [];
  const sameLength = lengths.length == row.groups.length;
  const sameElements = lengths.every(
    (length, index) => row.groups[index] == length
  );
  // if (sameLength && sameElements) console.log(row.record);
  return Number(sameLength && sameElements);
}

function recursivelyTryCombinations(row: (typeof rows)[number]): number {
  const hasUnknown = row.record.includes("?");
  if (!hasUnknown) return testRow(row);
  const nextSpringDamaged = {
    ...row,
    record: row.record.replace("?", "#"),
  };
  const nextSpringWorking = {
    ...row,
    record: row.record.replace("?", "."),
  };
  return (
    recursivelyTryCombinations(nextSpringDamaged) +
    recursivelyTryCombinations(nextSpringWorking)
  );
}
