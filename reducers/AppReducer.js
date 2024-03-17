import { createContext, useContext } from "react";
import { CARD_TYPES, packConfig } from "../constants/variables";
import { getShuffledCards } from "../constants/utils";
//import * as Haptics from "expo-haptics";

const { classic } = packConfig;

export const initialState = {
  offerings: [],
  entitlements: [],
  fontsLoaded: false,
  votes: {},
  players: [
    {
      id: 1,
      name: "",
      focused: false,
    },
    {
      id: 2,
      name: "",
      focused: false,
    },
  ],
  selectedGames: [classic.id],
  cards: [],
  removedCards: {},
  prevIndex: -1,
  index: 0,
  maxIndex: -1,
  prevCard: null,
  card: null,
  drinkLevel: 1,
  hapticsEnabled: 1,
  prevHapticsEnabled: 0,
  jackpotEnabled: 0,
  prevJackpotEnabled: 1,
  prevHapticsEnabled: 0,
  soundEnabled: 0,
  prevSoundEnabled: 1,
  openModal: null,
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case "setOfferings":
      return {
        ...state,
        offerings: action.payload,
      };
    case "setFontsLoaded":
      return {
        ...state,
        fontsLoaded: action.payload,
      };
    case "setEntitlements":
      return {
        ...state,
        entitlements: action.payload,
      };
    case "setPosthog":
      const posthog = action.payload;
      return {
        ...state,
        posthog,
        id: posthog?.getAnonymousId() ?? "unknown-user-id",
      };
    case "setVotes":
      return {
        ...state,
        votes: action.payload,
      };
    case "setSelectedGames":
      return {
        ...state,
        selectedGames: action.payload,
      };
    case "remapCards": {
      const { players } = state;
      const cards = remapCards(state.cards, players);

      return {
        ...state,
        cards,
      };
    }
    case "generateCards": {
      // Need to generate new cards for remapping to work
      // since otherwise cards already replace names

      const { players } = state;
      const cardsRaw = getShuffledCards(
        state.selectedGames.map((p) => packConfig[p]),
        state.players.length,
        state.votes
      );

      const cards = remapCards(cardsRaw, players);

      return {
        ...state,
        cards,
        card: cards[0],
        prevCard: cards[0],
      };
    }
    case "lightVibrate":
      if (state.hapticsEnabled)
        //Haptics.selectionAsync();
        return state;
    case "setHapticsEnabled":
      return {
        ...state,
        hapticsEnabled: action.payload,
        prevHapticsEnabled: state.hapticsEnabled,
      };
    case "setJackpotEnabled":
      return {
        ...state,
        jackpotEnabled: action.payload,
        prevJackpotEnabled: state.jackpotEnabled,
      };
    case "setSoundEnabled":
      return {
        ...state,
        soundEnabled: action.payload,
        prevSoundEnabled: state.soundEnabled,
      };
    case "toggleHaptics":
      return {
        ...state,
        hapticsEnabled: !state.hapticsEnabled,
      };
    case "setPlayers":
      return {
        ...state,
        players: action.payload,
      };
    case "addPlayer":
      return {
        ...state,
        players: [
          ...state.players,
          {
            id: (state.players.at(-1)?.id ?? 0) + 1,
            name: "",
            focused: false,
          },
        ],
      };
    case "removePlayer":
      return {
        ...state,
        players: state.players.length > 0 ? state.players.slice(0, -1) : [],
      };
    case "removePlayerById": {
      return {
        ...state,
        players: state.players.filter((player) => player.id !== action.payload),
      };
    }
    case "handleFocusChange": {
      return {
        ...state,
        players: state.players.map((player) => {
          if (player.id === action.payload.id) {
            return {
              ...player,
              focused: action.payload.focused,
            };
          }
          return player;
        }),
      };
    }
    case "handleNameChange":
      return {
        ...state,
        players: state.players.map((player) => {
          if (player.id === action.payload.id) {
            return {
              ...player,
              name: action.payload.name,
            };
          }
          return player;
        }),
      };
    case "setDrinkLevel":
      return {
        ...state,
        drinkLevel: action.payload,
      };
    case "changeDrinkLevel":
      return {
        ...state,
        drinkLevel: (state.drinkLevel % 3) + 1,
      };
    case "addVote":
      return {
        ...state,
        votes: {
          ...state.votes,
          [action.payload.cardUuid]: action.payload.voteValue,
        },
      };
    case "setRemovedCards":
      return {
        ...state,
        removedCards: action.payload,
      };
    case "next": {
      //if (state.hapticsEnabled)
      //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      let returnVal = {
        ...state,
        index: state.index + 1,
        prevIndex: state.index,
        prevCard: state.cards[state.index],
        card: state.cards[state.index + 1],
        maxIndex: Math.max(state.index, state.maxIndex),
        cards: action.removal
          ? moveToStart(state.cards, state.index)
          : state.cards,
        removedCards: action.removal
          ? { ...state.removedCards, [state.card.uuid]: state.card }
          : state.removedCards,
      };

      if (state.index === returnVal.cards.length - 5) {
        const newCards = getShuffledCards(
          state.selectedGames.map((p) => packConfig[p]),
          state.players.length,
          state.votes
        );

        const cards = remapCards(newCards, state.players);

        returnVal = {
          ...returnVal,
          cards: [...returnVal.cards, ...cards],
        };
      }

      return returnVal;
    }
    case "prev": {
      //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      return state.index === 0
        ? state
        : {
            ...state,
            index: state.index - 1,
            prevIndex: state.index,
            prevCard: state.cards[state.index],
            card: state.cards[state.index - 1],
            maxIndex: Math.max(state.index, state.maxIndex),
          };
    }
    case "openModal":
      return {
        ...state,
        openModal: action.payload,
      };
    default: {
      return state;
    }
  }
};

function moveToStart(array, index) {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }

  const item = array[index];
  return [item, ...array.slice(0, index), ...array.slice(index + 1)];
}

const remapCards = (cards, players) =>
  cards.map((c, cardIndex) => {
    // Get the index for the first player directly based on the card index
    const firstPlayerIndex = cardIndex % players.length;

    // Get two unique random indices excluding the first player's index
    const randomPlayerIndicies = getUniqueRandomIndices(
      firstPlayerIndex,
      players.length,
      c.cardType === CARD_TYPES.HEAD_TO_HEAD ? 1 : 0
    );

    return {
      ...c,
      activePlayersIndicies: [firstPlayerIndex, ...randomPlayerIndicies],
    };
  });

export function getUniqueRandomIndices(excludeIndex, length, count) {
  if (count >= length) {
    console.error("Requested more indices than are available.");
    return []; // Or handle this situation more gracefully as appropriate
  }

  let indices = [];
  while (indices.length < count) {
    let randomIndex = Math.floor(Math.random() * length);
    if (randomIndex !== excludeIndex && !indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices;
}

export function formatPlayerName(player, defaultIndex) {
  return player?.name && player.name.trim() !== ""
    ? player.name
    : `Player ${defaultIndex + 1}`;
}

const replaceNames = (str, players) => {
  return str.replace(/ERIK|TEJAS|KRISHNA/g, (match) => {
    if (match === "ERIK") return players[0];
    if (match === "TEJAS") return players[1];
    if (match === "KRISHNA") return players[2];
  });
};

// set up a context for the RevenueCat reducer
export const AppContext = createContext();

// set up hook for context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContext.Provider");
  }
  return context;
};
