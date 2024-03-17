import { CARD_TYPES, gameSettings } from "./variables";

export const getShuffledCards = (packList, numOfPlayers, removedCards) => {
  let restrictedCardTypes = [];

  if (numOfPlayers < 3)
    restrictedCardTypes = [CARD_TYPES.HEAD_TO_HEAD_PROCTORED];

  const cardIndicies = [];
  const cardsRaw = [];

  packList.forEach((pack) => {
    const filteredCards = pack.cards.filter((card) => {
      if (removedCards[card.uuid]) return false;
      if (restrictedCardTypes.includes(card.cardType)) return false;
      return true;
    });

    cardsRaw.push(
      ...filteredCards.map((card, i) => {
        return {
          ...card,
          format: gameSettings[card.game],
          drinkAmount: (Math.floor(Math.random() * 3) + 1) * card.sipFlag,
        };
      })
    );
    cardIndicies.push(
      ...generateUniqueNumbers(filteredCards.length, filteredCards.length)
    );
  });

  const cards = [];
  let lastJackpotIndex = -1;
  cardIndicies.forEach((cardIndex, arrayIndex) => {
    const card = cardsRaw[cardIndex];

    if (card.format) {
      const isJackpot =
        arrayIndex > lastJackpotIndex + 2 &&
        Math.random() < (arrayIndex - lastJackpotIndex - 2) * 0.05;

      let jackpotReduction = 0;

      if (isJackpot) {
        switch (card.cardType) {
          case CARD_TYPES.HEAD_TO_HEAD:
            jackpotReduction = 1;
            break;
          case CARD_TYPES.INDIVIDUAL:
            jackpotReduction = 1;
            break;
          default:
            jackpotReduction = 1;
        }
      }

      cards.push({
        ...card,
        isJackpot,
        jackpotReduction,
      });

      if (isJackpot) lastJackpotIndex = arrayIndex;
    } else console.log(card);
  });

  return cards;
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export const generateUniqueNumbers = (count, maxValue) => {
  if (count > maxValue) {
    throw new Error(
      "Count is larger than the range of unique numbers available."
    );
  }

  // Generate a sequence of numbers from 0 to maxValue - 1
  const numbers = Array.from({ length: maxValue }, (_, index) => index);

  // Shuffle the array
  shuffleArray(numbers);

  // Select the first 'count' numbers after shuffling
  return numbers.slice(0, count);
};
