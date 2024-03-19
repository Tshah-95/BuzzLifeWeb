"use client";

import Lottie from "lottie-react";
import { Header } from "../Header";
import { useEffect, useRef } from "react";
import { useAppContext } from "@/reducers/AppReducer";

export default function Game() {
  const {
    state: { players, index, prevIndex, card, drinkLevel, jackpotEnabled },
    dispatch,
  } = useAppContext();

  useEffect(() => {
    dispatch({ type: "isOnGameScreen", payload: true });
    return () => {
      dispatch({ type: "isOnGameScreen", payload: false });
    };
  }, []);

  return (
    <>
      <Header />
      <div className="w-full flex-auto"></div>
      <Footer />
    </>
  );
}

const Footer = () => {
  const clinkingBeersRef = useRef(null);
  const { state, dispatch } = useAppContext();

  return (
    <div className="w-full py-4 flex items-center justify-between">
      <button
        onClick={() => dispatch({ type: "next", removal: true })}
        className="min-w-20 flex flex-col items-center justify-center gap-1"
      >
        <div className="bg-lightblack w-[56px] h-[56px] relative text-white p-3 rounded-full shadow-lg flex justify-center items-center">
          <p className="absolute text-center justify-center items-center font-bold text-3xl">
            -
          </p>
        </div>
        <p className="text-white text-sm text-center font-bold w-full">
          remove
        </p>
      </button>
      <button
        onClick={() => dispatch({ type: "changeDrinkLevel" })}
        className="min-w-20 flex flex-col items-center justify-center gap-1"
      >
        <div className="bg-primary max-w-fit text-white p-[10px] rounded-full shadow-lg">
          <Lottie
            className="w-9 h-9"
            lottieRef={clinkingBeersRef}
            animationData={require("@/public/clinking-beers.json")}
            loop={false}
          />
        </div>
        <p className="text-white text-sm text-center font-bold w-full">drunk</p>
      </button>
    </div>
  );
};
