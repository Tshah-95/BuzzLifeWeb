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
import {
  useAnimation,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import Image from "next/image";

const beerSize = 30;

export default function Game() {
  const { state, dispatch } = useAppContext();
  const { card, drinkLevel, players, jackpotEnabled, index, prevIndex } = state;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => dispatch({ type: "next" }),
    onSwipedRight: () => dispatch({ type: "prev" }),
    delta: 5,
  });

  const widthOffset = window.innerWidth / 2;
  const heightOffset = window.innerHeight / 2;

  const [jackpot, setJackpot] = useState(0);
  const [visualJackpot, setVisualJackpot] = useState(0);
  const potRef = useRef<any>(null);
  const sipsRef = useRef<any>(null);
  const [sipsAddedFromJackpot, setSipsAddedFromJackpot] = useState(0);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [beers, setBeers] = useState<any[]>([]);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const jackpotTimeout = useRef<NodeJS.Timeout | null>(null);
  const maxIndex = useRef(-1);
  const pastJackpotAddedAmounts = useRef<{
    [key: number]: number;
  }>({});
  const lastIndexCleared = useRef(-1);
  const progress = useMotionValue(0);
  const cardChangeAnimProgress = useMotionValue(0);

  const trueDrinkAmount = Math.abs(card.drinkAmount) + (drinkLevel - 1);

  useEffect(() => {
    if (beers.length !== 0) {
      progress.set(0);
      animate(progress, 1, { duration: 1.5 });
    }
  }, [beers]);

  useEffect(() => {
    if (jackpotEnabled) {
      setSipsAddedFromJackpot(pastJackpotAddedAmounts.current[index] ?? 0);

      if (
        prevIndex !== -1 &&
        visualJackpot !== jackpot &&
        index !== lastIndexCleared.current
      ) {
        setVisualJackpot(jackpot);
        clearTimeout(timeout.current);
        clearTimeout(jackpotTimeout.current);
      }

      lastIndexCleared.current = index;

      if (index > prevIndex && index > maxIndex.current && card.isJackpot) {
        //Vibration.vibrate();
        clearTimeout(timeout.current);
        clearTimeout(jackpotTimeout.current);
        const reduceJackpotBy = Math.floor(jackpot * card.jackpotReduction);
        pastJackpotAddedAmounts.current[index] = reduceJackpotBy;

        const newBeers = Array.from({ length: reduceJackpotBy }).map((_) => ({
          ...generateRandomOffsets(card.isJackpot),
          id: Math.random(), // Unique identifier for key prop
        }));

        setJackpot(jackpot - reduceJackpotBy);
        setBeers(newBeers);

        jackpotTimeout.current = setTimeout(() => {
          setSipsAddedFromJackpot(reduceJackpotBy);
        }, 1300);

        timeout.current = setTimeout(() => {
          setVisualJackpot(jackpot - reduceJackpotBy);
        }, 200);

        maxIndex.current = Math.max(maxIndex.current, index);
      } else if (index > prevIndex && index > maxIndex.current) {
        clearTimeout(timeout.current);
        clearTimeout(jackpotTimeout.current);
        setJackpot((jp) => jp + trueDrinkAmount ?? 0);

        const newBeers = Array.from({ length: trueDrinkAmount }).map((_) => ({
          ...generateRandomOffsets(),
          id: Math.random(), // Unique identifier for key prop
        }));

        setBeers(newBeers);

        timeout.current = setTimeout(() => {
          setVisualJackpot((jp) => jp + trueDrinkAmount ?? 0);
        }, 1300);

        maxIndex.current = Math.max(maxIndex.current, index);
      }
    }
  }, [index, startPosition.y]);

  let title = card.header ?? card.format.header;

  if (card.cardType === CARD_TYPES.INDIVIDUAL) {
    const activeIndex = card.activePlayersIndicies[0];
    title = formatPlayerName(players[activeIndex], activeIndex);
  } else if (card.cardType === CARD_TYPES.HEAD_TO_HEAD) {
    title = card.activePlayersIndicies
      .map((i: number) => formatPlayerName(players[i], i))
      .join(" vs ");
  }

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    setSipsAddedFromJackpot(0);
    setJackpot(0);
    setVisualJackpot(0);
  }, [jackpotEnabled]);

  useEffect(() => {
    if (jackpotEnabled) {
      if (sipsRef.current) {
        const {
          left: sx,
          top: sy,
          width: sWidth,
          height: sHeight,
        } = sipsRef.current.getBoundingClientRect();
        setStartPosition({
          x: sx + Math.floor(sWidth / 2) - beerSize / 2,
          y: sy + Math.floor(sHeight / 2) - beerSize / 2,
        });
      }

      if (potRef.current) {
        const potRect = potRef.current.getBoundingClientRect();
        const { left: px, top: py, width: pWidth, height: pHeight } = potRect;
        setEndPosition({
          x: px + Math.floor(pWidth / 2) - beerSize / 2,
          y: py + Math.floor(pHeight / 2) - beerSize / 2,
        });
      }
    }
  }, [jackpotEnabled]);

  const potScale = useTransform(
    progress,
    card.isJackpot ? [0, 0.025, 0.05, 1] : [0, 0.95, 0.975, 1],
    card.isJackpot ? [1, 0.8, 1, 1] : [1, 1, 1.2, 1]
  );

  const [displayText, setDisplayText] = useState(card?.prompt);
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayDrinkHeader, setDisplayDrinkHeader] = useState(
    card.drinkHeader
  );
  const [displayDrinkAmount, setDisplayDrinkAmount] = useState(trueDrinkAmount);

  useEffect(() => {
    const cardAnimation = async () => {
      cardChangeAnimProgress.set(prevIndex > index ? 1 : 0);
      await animate(cardChangeAnimProgress, 0.5, { duration: 0.2 });
      setDisplayText(card?.prompt);
      setDisplayTitle(title);
      setDisplayDrinkHeader(card.drinkHeader);
      setDisplayDrinkAmount(trueDrinkAmount);
      await animate(cardChangeAnimProgress, prevIndex > index ? 0 : 1, {
        duration: 0.2,
      });
    };

    isMounted && cardAnimation();
  }, [index]);

  const promptOpacity = useTransform(
    cardChangeAnimProgress,
    [0, 0.4, 0.6, 1],
    [1, 0, 0, 1]
  );
  const promptX = useTransform(
    cardChangeAnimProgress,
    [0, 0.4, 0.6, 1],
    [0, -200, 200, 0]
  );
  const drinkScale = useTransform(
    cardChangeAnimProgress,
    [0, 0.4, 0.6, 1],
    [1, 0.3, 0.3, 1]
  );

  return (
    <>
      <Header />
      <div {...swipeHandlers} className="w-full flex flex-col flex-auto">
        <motion.div
          className="flex-1 flex flex-col justify-center items-center gap-5 w-full relative"
          style={{ scale: potScale }}
        >
          <Image
            src="/pot-of-beer.png"
            alt="A pot with many little beers filling it"
            height={100}
            width={100}
          />
          <div className="absolute">
            <span
              ref={potRef}
              className="relative top-2 font-bold text-xl text-white"
            >
              {visualJackpot}
            </span>
          </div>
        </motion.div>
        <motion.div
          className="flex-2 flex flex-col justify-center items-center gap-5 md:gap-10 w-full select-none"
          style={{ opacity: promptOpacity, x: promptX }}
        >
          <Balancer
            ratio={0.3}
            className="w-full text-4xl md:text-6xl text-center font-bold"
          >
            {displayTitle}
          </Balancer>
          <Balancer ratio={0.5} className="text-xl md:text-3xl text-center">
            {displayText}
          </Balancer>
        </motion.div>
        <motion.div
          className="flex-1 flex flex-col justify-center items-center w-full gap-2 md:gap-5 select-none"
          style={{ scale: drinkScale }}
        >
          <h3 className="text-2xl md:text-4xl font-bold">
            {displayDrinkHeader}
          </h3>
          <p className="text-xl md:text-3xl">
            {card.sipFlag > 0 ? "take(s)" : "give(s) out"}{" "}
            <span ref={sipsRef}>
              {displayDrinkAmount + sipsAddedFromJackpot}
            </span>{" "}
            sip
            {displayDrinkAmount > 1 && "s"}
          </p>
        </motion.div>
      </div>
      <Footer />
      {beers.map((beer) => (
        <AnimatedBeerIcon
          key={beer.id}
          beerOffset={beer}
          progress={progress}
          startPosition={startPosition}
          endPosition={endPosition}
          isJackpot={card.isJackpot}
          heightOffset={heightOffset}
          widthOffset={widthOffset}
        />
      ))}
    </>
  );
}

const generateRandomOffsets = (isJackpotActivation?: boolean) => {
  return {
    x: Math.random() * 300 - 150, // Random starting X offset
    y: isJackpotActivation
      ? Math.random() * 150 - 50
      : Math.random() * 50 - 150, // Random starting Y offset
  };
};

const AnimatedBeerIcon = ({
  beerOffset,
  progress,
  startPosition,
  endPosition,
  isJackpot,
  heightOffset,
  widthOffset,
}: {
  beerOffset: { x: number; y: number };
  progress: any;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  isJackpot: boolean;
  heightOffset: number;
  widthOffset: number;
}) => {
  const adjustedStart = {
    x: startPosition.x - widthOffset,
    y: startPosition.y - heightOffset,
  };
  const adjustedEnd = {
    x: endPosition.x - widthOffset + 15,
    y: endPosition.y - heightOffset,
  };
  const properStart = isJackpot ? adjustedEnd : adjustedStart;
  const properEnd = isJackpot ? adjustedStart : adjustedEnd;
  // Define the custom animation for the beer icon
  const y = useTransform(
    progress,
    [0, 0.5, 1],
    [properStart.y, properStart.y + beerOffset.y, properEnd.y]
  );
  const x = useTransform(
    progress,
    [0, 0.5, 1],
    [properStart.x, properStart.x + beerOffset.x, properEnd.x]
  );
  const opacity = useTransform(
    progress,
    [0, 0.2, 0.9, 0.95, 1],
    [0, 1, 1, 0, 0]
  );
  const rotation = useTransform(progress, [0, 0.5, 1], [0, 360, 360]);

  return (
    <motion.div
      className="absolute z-10"
      style={{ x, y, rotate: rotation, opacity }}
    >
      <Image src="/beer.png" height={beerSize} width={beerSize} alt="Beer" />
    </motion.div>
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
