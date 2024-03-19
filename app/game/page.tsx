"use client";

import Lottie from "lottie-react";
import { Header } from "../Header";
import { useEffect, useRef, useState } from "react";
import {
  action,
  formatPlayerName,
  state,
  useAppContext,
} from "@/reducers/AppReducer";
import { useSwipeable } from "react-swipeable";
import Balancer from "react-wrap-balancer";
import { CARD_TYPES, colors } from "@/constants/variables";
import { useAnimation, motion } from "framer-motion";

export default function Game() {
  const { state, dispatch } = useAppContext();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => dispatch({ type: "next", removal: undefined }),
    onSwipedRight: () => dispatch({ type: "prev" }),
    delta: 5,
  });

  const [sipsAddedFromJackpot, setSipsAddedFromJackpot] = useState(0);

  useEffect(() => {
    dispatch({ type: "isOnGameScreen", payload: true });
    return () => dispatch({ type: "isOnGameScreen", payload: false });
  }, []);

  return (
    <>
      <Header />
      <div {...swipeHandlers} className="w-full flex flex-col flex-auto">
        {state.card && (
          <Card
            state={state}
            dispatch={dispatch}
            sipsAddedFromJackpot={sipsAddedFromJackpot}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

const Card = ({
  state,
  dispatch,
  sipsAddedFromJackpot,
}: {
  state: state;
  dispatch: (value: action) => void;
  sipsAddedFromJackpot: number;
}) => {
  const { card, drinkLevel, players } = state;
  const trueDrinkAmount = Math.abs(card.drinkAmount) + (drinkLevel - 1);

  let title = card.header ?? card.format.header;

  if (card.cardType === CARD_TYPES.INDIVIDUAL) {
    const activeIndex = card.activePlayersIndicies[0];
    title = formatPlayerName(players[activeIndex], activeIndex);
  } else if (card.cardType === CARD_TYPES.HEAD_TO_HEAD) {
    title = card.activePlayersIndicies
      .map((i: number) => formatPlayerName(players[i], i))
      .join(" vs ");
  }

  return (
    <>
      <div className="flex-1 flex flex-col justify-center gap-5 w-full" />
      <div className="flex-2 flex flex-col justify-center items-center gap-5 w-full">
        <Balancer ratio={0.3} className="w-full text-4xl text-center font-bold">
          {title}
        </Balancer>
        <Balancer ratio={0.3} className="text-xl text-center">
          {card.prompt}
        </Balancer>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h3 className="text-2xl font-bold">{card.drinkHeader}</h3>
        <p className="text-xl">
          {card.sipFlag > 0 ? "take(s)" : "give(s) out"}{" "}
          <span>{trueDrinkAmount + sipsAddedFromJackpot}</span> sip
          {trueDrinkAmount > 1 && "s"}
        </p>
      </div>
    </>
  );
};

const options = [
  {
    bgColor: colors.primary,
    text: "buzzed",
  },
  {
    bgColor: colors.secondary,
    text: "drunk",
  },
  {
    bgColor: colors.lightblack,
    text: "wasted",
  },
];

const Footer = () => {
  const clinkingBeersRef = useRef<any>(null);
  const {
    state: { drinkLevel },
    dispatch,
  } = useAppContext();

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      backgroundColor: options[drinkLevel - 1].bgColor,
    });
  }, [drinkLevel]);

  return (
    <div className="w-full flex items-center justify-between">
      <button
        onClick={() => dispatch({ type: "next", removal: true })}
        className="min-w-20 flex flex-col items-center justify-center gap-1 active:scale-95"
      >
        <div className="bg-lightblack w-[56px] h-[56px] relative text-white p-3 rounded-full shadow-lg flex justify-center items-center">
          <p className="absolute text-center justify-center items-center font-bold text-3xl">
            -
          </p>
        </div>
        <p className="text-sm text-center font-bold w-full">remove</p>
      </button>
      <button
        onClick={() => {
          clinkingBeersRef.current.play();
          dispatch({ type: "changeDrinkLevel" });
        }}
        className="min-w-20 flex flex-col items-center justify-center gap-1 active:scale-95"
      >
        <motion.div
          className="max-w-fit p-[10px] rounded-full shadow-lg"
          animate={controls}
          initial={{ backgroundColor: options[drinkLevel - 1].bgColor }}
          transition={{ duration: 0.8 }}
        >
          <Lottie
            className="w-9 h-9"
            lottieRef={clinkingBeersRef}
            animationData={require("@/public/clinking-beers.json")}
            loop={false}
          />
        </motion.div>
        <p className="text-sm text-center font-bold w-full">
          {options[drinkLevel - 1].text}
        </p>
      </button>
    </div>
  );
};
