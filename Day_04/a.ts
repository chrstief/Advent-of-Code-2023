const input: string = await Deno.readTextFile("./Day_04/a.txt");

const lines = input.split("\n");

const scratchCards = lines.map((line) => {
  const [winningNumbers, yourNumbers] = line
    .split(":")[1]
    .split("|")
    .map((numbersString) =>
      numbersString.match(/\d+/g)?.map((numberString) => Number(numberString))
    );
  // console.log(line);
  // console.log({winningNumbers});
  // console.log({yourNumbers});

  return {
    winningNumbers: winningNumbers ?? [],
    yourNumbers: yourNumbers ?? [],
  };
});

const individualPoints = scratchCards.map((scratchCard) => {
  const yourWinningNumbers = scratchCard.yourNumbers.filter((yourNumber) =>
    scratchCard.winningNumbers?.includes(yourNumber)
  );
  // console.log({scratchCard});
  // console.log({yourWinningNumbers});

  const points = yourWinningNumbers.reduce((accumulator) => {
    // console.log({ accumulator })
    if (accumulator == 0) return 1;
    return accumulator * 2;
  }, 0);
  // console.log({ points });
  return points;
});

const overallPoints = individualPoints.reduce(
  (accumulator, currentValue) => accumulator + currentValue
);

console.log(overallPoints);
