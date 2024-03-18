import { createContext, useContext, useReducer } from "react";
import { CARD_TYPES, packConfig } from "../constants/variables";
import { getShuffledCards } from "../constants/utils";
//import * as Haptics from "expo-haptics";

const { classic } = packConfig;

export type player = {
  id: number;
  name: string;
  focused: boolean;
};

export const initialState: state = {
  offerings: [],
  entitlements: [],
  fontsLoaded: false,
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
  soundEnabled: 0,
  prevSoundEnabled: 1,
  openModal: null,
};

export type state = {
  offerings: any[];
  entitlements: any[];
  fontsLoaded: boolean;
  players: player[];
  selectedGames: any[];
  cards: any[];
  removedCards: any;
  prevIndex: number;
  index: number;
  maxIndex: number;
  prevCard: any;
  card: any;
  drinkLevel: number;
  hapticsEnabled: number;
  prevHapticsEnabled: number;
  jackpotEnabled: number;
  prevJackpotEnabled: number;
  soundEnabled: number;
  prevSoundEnabled: number;
  openModal: any;
};

export type baseCard = {
  uuid: string;
  cardType: string;
  header: string | undefined;
  prompt: string;
  drinkHeader: string | undefined;
  sipFlag: -3 | -2 | -1 | 0 | 1 | 2 | 3;
};

export type card = baseCard & {
  drinkAmount: number;
  activePlayersIndicies: number[];
};

export type action =
  | {
      type: "setOfferings";
      payload: any[];
    }
  | {
      type: "setFontsLoaded";
      payload: boolean;
    }
  | {
      type: "setEntitlements";
      payload: any[];
    }
  | {
      type: "setPosthog";
      payload: any;
    }
  | {
      type: "setSelectedGames";
      payload: any[];
    }
  | {
      type: "remapCards";
    }
  | {
      type: "generateCards";
    }
  | {
      type: "lightVibrate";
      payload: any;
    }
  | {
      type: "setHapticsEnabled";
      payload: any;
    }
  | {
      type: "setJackpotEnabled";
      payload: any;
    }
  | {
      type: "setSoundEnabled";
      payload: any;
    }
  | {
      type: "toggleHaptics";
      payload: any;
    }
  | {
      type: "setPlayers";
      payload: player[];
    }
  | {
      type: "addPlayer";
    }
  | {
      type: "removePlayer";
    }
  | {
      type: "removePlayerById";
      payload: number;
    }
  | {
      type: "handleFocusChange";
      payload: any;
    }
  | {
      type: "handleNameChange";
      payload: any;
    }
  | {
      type: "setDrinkLevel";
      payload: any;
    }
  | {
      type: "changeDrinkLevel";
      payload: any;
    }
  | {
      type: "setRemovedCards";
      payload: any;
    }
  | {
      type: "next";
      payload: any;
      removal: boolean | undefined;
    }
  | {
      type: "prev";
      payload: any;
    }
  | {
      type: "openModal";
      payload: any;
    };

export const AppReducer = (state: state, action: action) => {
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
        state.selectedGames.map((p: keyof typeof packConfig) => packConfig[p]),
        state.players.length,
        state.removedCards
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
          state.selectedGames.map(
            (p: keyof typeof packConfig) => packConfig[p]
          ),
          state.players.length,
          state.removedCards
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

function moveToStart(array: any[], index: number) {
  if (index < 0 || index >= array.length) {
    return array; // Return the original array if index is out of bounds
  }

  const item = array[index];
  return [item, ...array.slice(0, index), ...array.slice(index + 1)];
}

const remapCards = (cards: card[], players: player[]) =>
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

export function getUniqueRandomIndices(
  excludeIndex: number,
  length: number,
  count: number
) {
  if (count >= length) {
    console.error("Requested more indices than are available.");
    return []; // Or handle this situation more gracefully as appropriate
  }

  let indices: number[] = [];
  while (indices.length < count) {
    let randomIndex = Math.floor(Math.random() * length);
    if (randomIndex !== excludeIndex && !indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  return indices;
}

export function formatPlayerName(player: player, defaultIndex: number) {
  return player?.name && player.name.trim() !== ""
    ? player.name
    : `Player ${defaultIndex + 1}`;
}

// set up a context for the RevenueCat reducer
export const AppContext = createContext({
  state: initialState,
  dispatch: (value: action) => {},
});

// set up hook for context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContext.Provider");
  }
  return context;
};
