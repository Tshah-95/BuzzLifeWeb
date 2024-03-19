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

export default function GameLoading() {
  return (
    <>
      <Header />
      <div className="w-full flex-auto flex flex-col justify-center items-center" />
      <Footer />
    </>
  );
}

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
