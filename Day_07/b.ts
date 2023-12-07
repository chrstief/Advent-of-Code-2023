import { couldStartTrivia } from "typescript";

const input: string = await Bun.file("./Day_07/a.txt").text();

const lines = input.split("\n");
const hands = lines.map((line) => {
  const [cardsString, bidString] = line.split(" ");
  const cards = cardsString.split("");
  // console.log(cards);
  const bid = Number(bidString);
  const strength = determineStrength(cards);

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

const totalWinnings = sortedByStrength.reduce(
  (acc, hand, currentIndex) => acc + hand.bid * (currentIndex + 1),
  0
);

console.log(totalWinnings);

function determineStrength(cards: string[]): number {
  const cardsWithoutJokers = cards
  .filter((card) => card != "J")
  const duplicates = cardsWithoutJokers
    .map((card, index) => {
      // console.log({card},cardsWithoutJokers.slice(0, index))
      if (cardsWithoutJokers.slice(0, index).includes(card)) return 0;
      return cardsWithoutJokers.filter((c) => c == card).length;
    });
  const jokers = cards.filter((card) => card == "J").length;

  const debug = false&& jokers == 1;

  const highest = Math.max(...duplicates);
  duplicates[duplicates.indexOf(highest)] += jokers;
  const triple = duplicates.some((duplicate) => duplicate == 3);
  const pairs = duplicates.filter((duplicate) => duplicate == 2).length;

  if (debug) console.log(cards);
  if (debug) console.log(duplicates, { triple }, { pairs }, { jokers });

  const onePair = pairs == 1;
  const twoPair = pairs == 2;
  const fullHouse = triple && pairs == 1;
  const four = duplicates.some((duplicate) => duplicate == 4);
  const five = duplicates.some((duplicate) => duplicate == 5) || jokers == 5;

  if (five) {
    if (debug) console.log("Five of a kind");
    return 7;
  }
  if (four) {
    if (debug) console.log("Four of a kind");
    return 6;
  }
  if (fullHouse) {
    if (debug) console.log("Full house");
    return 5;
  }
  if (triple) {
    if (debug) console.log("Three of a kind");
    return 4;
  }
  if (twoPair) {
    if (debug) console.log("Two pair");
    return 3;
  }
  if (onePair) {
    if (debug) console.log("One pair");
    return 2;
  }
  if (debug) console.log("High card");
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
    return 1;
  }
  if (card == "T") {
    return 10;
  }
  return Number(card);
}
