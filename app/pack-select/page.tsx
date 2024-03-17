"use client";

import { motion, useAnimate } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "@/reducers/AppReducer";
import { packConfig } from "@/constants/variables";
import Lottie, { LottieRef } from "lottie-react";
import Balancer from "react-wrap-balancer";

const { classic, pre, guys, gals, chaos } = packConfig;
const Packs = [classic, pre, guys, gals, chaos];

const scaleAnimation = {
  scale: [0.92, 1.02, 0.92],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export default function Home() {
  const {
    state: { selectedGames },
    dispatch,
  } = useContext(AppContext);

  const purchased = false;

  return (
    <div className="flex flex-col h-full w-full items-center justify-center max-w-screen-sm p-5">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col gap-1 w-full flex-auto justify-center">
          {Packs.map((pack, index) => (
            <GameTile
              key={pack.id}
              bgColor={pack.color}
              selected={selectedGames.includes(pack.id)}
              onSelect={() => {
                let updatedGames = null;

                if (selectedGames.includes(pack.id)) {
                  updatedGames = selectedGames.filter(
                    (id: string) => id !== pack.id
                  );
                } else updatedGames = [...selectedGames, pack.id];

                dispatch({
                  type: "setSelectedGames",
                  payload: updatedGames,
                });
              }}
              {...pack}
              paid={false && pack.paid && !purchased}
            />
          ))}
        </div>
        <motion.div
          className="bg-tertiary rounded-lg shadow-md flex w-full active:opacity-80"
          animate={scaleAnimation}
        >
          <Link
            className="text-[white] w-[95%] text-center font-bold text-4xl py-5 px-12"
            href="/pack-select"
          >
            Select
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

const GameTile = ({
  id,
  img,
  imgSpeed,
  bgColor,
  paid,
  title,
  caption,
  onSelect,
  selected,
}: {
  id: string;
  img: any;
  imgSpeed: number;
  bgColor: string;
  paid: boolean;
  title: string;
  caption: string;
  onSelect: () => void;
  selected: boolean;
}) => {
  const animRef = useRef<any>();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animRef.current?.setSpeed(imgSpeed);
  }, [animRef.current]);

  useEffect(() => {
    if (selected)
      animate(
        scope.current,
        { x: Math.min(window?.screen?.width * 0.7, 500) },
        { ease: "easeInOut", duration: 0.7 }
      );
    else animate(scope.current, { x: 0 }, { ease: "easeInOut", duration: 0.7 });
  }, [selected]);

  return (
    <button
      className="p-[6px] rounded-lg shadow-lg active:scale-95"
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
    >
      <div className="flex flex-auto flex-row items-stretch rounded-lg bg-gradient-to-r from-[rgba(255,255,255,0.1)] from-10% via-[rgba(255,255,255,0.3)] via-40% to-[rgba(255,255,255,0.1)] to-90%">
        <div className="flex justify-center items-center grow-[1]">
          <div className="h-20 w-20 justify-center items-center">
            <Lottie animationData={img} loop lottieRef={animRef} />
          </div>
        </div>
        <div className="flex relative flex-col justify-center items-center text-center grow-[3] rounded-lg gap-1 overflow-hidden">
          {selected && id === "chaos" ? (
            <div className="flex justify-center items-center text-4xl font-bold text-[white]">
              Good Luck!
            </div>
          ) : (
            <>
              <h1 className="text-lg text-[white] font-bold z-10">{title}</h1>
              <Balancer className="text-sm text-[white] w-[13em] z-10">
                {caption}
              </Balancer>
            </>
          )}
          <div
            className="absolute w-full h-full rounded-lg bg-lightBlack"
            style={{
              opacity: id === "classic" || id === "pre" ? 0.15 : 0.25,
            }}
            ref={scope}
          />
        </div>
      </div>
    </button>
  );
};
