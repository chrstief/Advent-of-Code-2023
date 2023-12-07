const input: string = await Bun.file("./Day_07/a.txt").text();

const lines = input.split("\n");
const hands = lines.map((line) => {
  const [cardsString, bidString] = line.split(" ");
  const cards = cardsString.split("");
  const bid = Number(bidString);
  const strength = determineStrength(cards);
  //   console.log(cards);
  return { cards: cards, bid: bid, strength: strength };
});

// console.log(hands);

const sortedByStrength = hands.sort((a, b) => {
  if (a.strength == b.strength) {
    for (let i = 0; i < a.cards.length; i++) {
      const compare =
        singleCardStrength(a.cards[i]) - singleCardStrength(b.cards[i]);
      if (compare != 0) return compare;
    }
  }

  return a.strength - b.strength;
});

// console.log(sortedByStrength);

const totalWinnings=sortedByStrength.reduce((acc,hand,currentIndex)=>acc+hand.bid*(currentIndex+1),0)

console.log(totalWinnings);

function determineStrength(cards: string[]): number {
  const duplicates = cards.map((card) => cards.filter((c) => c == card).length);
  const triple = duplicates.some((duplicate) => duplicate == 3);
  const pairs = duplicates.filter((duplicate) => duplicate == 2).length / 2;
  //   console.log(duplicates, { triple }, { doubles: pairs });

  if (duplicates.some((duplicate) => duplicate == 5)) {
    // console.log("Five of a kind");
    return 7;
  }
  if (duplicates.some((duplicate) => duplicate == 4)) {
    // console.log("Four of a kind");
    return 6;
  }
  if (triple && pairs == 1) {
    // console.log("Full house");
    return 5;
  }
  if (triple) {
    // console.log("Three of a kind");
    return 4;
  }
  if (pairs == 2) {
    // console.log("Two pair");
    return 3;
  }
  if (pairs == 1) {
    // console.log("One pair");
    return 2;
  }
  //   console.log("High card");
  return 1;
}

function singleCardStrength(card: string): number {
  if (card == "A") {
    return 14;
  }
  if (card == "K") {
    return 13;
  }
  if (card == "Q") {
    return 12;
  }
  if (card == "J") {
    return 11;
  }
  if (card == "T") {
    return 10;
  }
  return Number(card);
}
