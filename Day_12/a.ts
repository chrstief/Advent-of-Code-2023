const input: string = await Bun.file("./Day_12/a.txt").text();

type Record = string;
type Groups = number[];
type Row = { record: Record; groups: Groups };

const rows: Row[] = input.split("\n").map((row) => ({
  record: row.split(" ")[0],
  groups: row
    .split(" ")[1]
    .split(",")
    .map((group) => Number(group)),
}));

const answer = rows
  .map((row) => recursivelyTryCombinations(row.record, row.groups))
  .reduce((acc, element) => acc + element);
console.log(answer);

function testRow(record: Record, groups: Groups) {
  const damagedGroups = record.match(/#+/g)?.map((match) => match.length) ?? [];
  if (
    damagedGroups.length == groups.length &&
    damagedGroups.every((length, index) => groups[index] == length)
  )
    return 1;
  return 0;
}

function recursivelyTryCombinations(record: Record, groups: Groups): number {
  if (record.includes("?")) {
    const nextSpringDamagedRecord = record.replace("?", "#");
    const nextSpringWorkingRecord = record.replace("?", ".");
    return (
      recursivelyTryCombinations(nextSpringDamagedRecord, groups) +
      recursivelyTryCombinations(nextSpringWorkingRecord, groups)
    );
  }
  return testRow(record, groups);
}
