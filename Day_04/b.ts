const input: string = await Deno.readTextFile("./Day_04/a.txt");

const lines = input.split("\n");

const scratchCards = lines.map((line) => {
  const cardNumber = Number(line.split(":")[0].match(/\d+/g));
  const [winningNumbers, yourNumbers] = line
    .split(":")[1]
    .split("|")
    .map((numbersString) =>
      numbersString.match(/\d+/g)?.map((numberString) => Number(numberString))
    );
  // console.log(line);
  // console.log({ cardNumber });
  // console.log({winningNumbers});
  // console.log({yourNumbers});

  const matches = yourNumbers!.filter((yourNumber) =>
    winningNumbers?.includes(yourNumber)
  ).length;
  // console.log({matches});

  return {
    cardNumber: cardNumber ?? [],
    matches: matches ?? [],
    copies: 1,
  };
});

for (let cardNumber = 0; cardNumber < scratchCards.length; cardNumber++) {
  for (
    let matchNumber = 1;
    matchNumber <= scratchCards[cardNumber].matches;
    matchNumber++
  ) {
    const cardToCopy = cardNumber + matchNumber;
    for (
      let repitition = 1;
      repitition <= scratchCards[cardNumber].copies;
      repitition++
    ) {
      scratchCards[cardToCopy].copies++;
    }
  }
}

// console.log(scratchCards);

const numberOfCards = scratchCards.reduce(
  (accumulator, scratchCard) => accumulator + scratchCard.copies,
  0
);

console.log(numberOfCards);
