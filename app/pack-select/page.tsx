"use client";

import { motion, useAnimate } from "framer-motion";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, useAppContext } from "@/reducers/AppReducer";
import { packConfig } from "@/constants/variables";
import Lottie, { LottieRef } from "lottie-react";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Back from "@/public/back.png";
import Settings from "@/public/settings.png";

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

export default function PackSelect() {
  const {
    state: { selectedGames },
    dispatch,
  } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    dispatch({ type: "generateCards" });
  }, [selectedGames]);

  const purchased = false;
  const anySelected = selectedGames.length > 0;

  return (
    <div className="flex flex-col h-full w-full items-center justify-center max-w-screen-sm p-5">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex w-full justify-between items-center">
          <div className="p-3 -m-3">
            <Image
              className="cursor-pointer"
              width={25}
              height={25}
              src={Back}
              alt="back button"
              onClick={() => router.back()}
            />
          </div>
          <div className="p-3 -m-3">
            <Image
              className="cursor-pointer"
              width={25}
              height={25}
              src={Settings}
              alt="settings button"
              onClick={() => router.back()}
            />
          </div>
        </div>
        <div className="flex flex-col w-full flex-1 justify-center overflow-auto">
          <div className="flex flex-col gap-1 w-full h-full max-h-[90%] justify-center">
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
        </div>
        <div
          className="w-full data-[disabled=false]:active:scale-95"
          data-disabled={!anySelected}
        >
          <motion.div
            className="bg-tertiary rounded-lg shadow-md flex justify-center data-[disabled=true]:opacity-75"
            animate={
              anySelected
                ? scaleAnimation
                : { scale: 1, transition: { duration: 0.3 } }
            }
            data-disabled={!anySelected}
          >
            <Link
              className="text-[white] w-full text-center font-bold text-4xl py-5 px-12"
              href={anySelected ? "/player-select" : "#"}
            >
              {!anySelected ? "No Selection" : "Select"}
            </Link>
          </motion.div>
        </div>
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
  const [showGoodLuck, setShowGoodLuck] = useState(false);
  const goodLuckTimeout = useRef<any>(null);

  useEffect(() => {
    animRef.current?.setSpeed(imgSpeed);
  }, [animRef.current]);

  useEffect(() => {
    if (id === "chaos") {
      clearTimeout(goodLuckTimeout.current);

      goodLuckTimeout.current = setTimeout(() => {
        setShowGoodLuck(selected);
      }, 300);
    }

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
      className="p-[6px] max-h-[20%] rounded-lg shadow-lg active:scale-95"
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
    >
      <div className="flex flex-auto h-full flex-row items-stretch rounded-lg bg-gradient-to-r from-[rgba(255,255,255,0.1)] from-10% via-[rgba(255,255,255,0.3)] via-40% to-[rgba(255,255,255,0.1)] to-90%">
        <div className="flex justify-center items-center flex-1 h-full aspect-square">
          <div className="h-[90%] aspect-square justify-center items-center">
            <Lottie animationData={img} loop lottieRef={animRef} />
          </div>
        </div>
        <div className="flex relative flex-col justify-center items-center text-center flex-[2_2_0%] rounded-lg gap-1 md:gap-3 overflow-hidden">
          {showGoodLuck ? (
            <div className="flex justify-center items-center text-4xl font-bold text-[white]">
              Good Luck!
            </div>
          ) : (
            <>
              <h1 className="text-lg md:text-2xl text-[white] font-bold z-10">
                {title}
              </h1>
              <Balancer className="text-sm md:text-lg font-thin text-[white] w-[11em] z-10">
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
