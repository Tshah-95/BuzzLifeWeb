"use client";

import { useAppContext } from "@/reducers/AppReducer";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Link from "next/link";

const maxPlayers = 20;
const minPlayers = 0;
const scaleAnimation = {
  scale: [0.92, 1.02, 0.92],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export default function PlayerSelect() {
  const {
    state: { players },
    dispatch,
  } = useAppContext();
  const playerCount = players.length;
  const anyPlayers = players.length > 0;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    isMounted && dispatch({ type: "remapCards" });
  }, [players.length]);

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showRemovePlayer, setShowRemovePlayer] = useState(false);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center max-w-screen-sm p-5">
      <div className="flex-[1_0_200px] flex flex-col w-full items-stretch">
        <div className="flex-auto">header</div>
        <div className="text-3xl"># of Players</div>
      </div>
      <div className="flex-3 flex flex-wrap justify-center content-start w-full gap-y-2 bg-tertiary relative overflow-auto scroll-smooth">
        <div className="w-full bg-gradient-to-b from-lightBlack opacity-20 h-10 absolute -top-5 left-0 z-10" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="bg-secondary w-1/2 h-20 border-primary border-2" />
        <div className="w-full bg-gradient-to-t from-lightBlack opacity-20 h-10 absolute -bottom-5 left-0 z-10" />
      </div>
      <div
        className="w-full data-[disabled=false]:active:scale-95"
        data-disabled={!anyPlayers}
      >
        <motion.div
          className="rounded-lg shadow-md flex w-full data-[disabled=true]:opacity-75"
          animate={
            anyPlayers
              ? scaleAnimation
              : { scale: 1, transition: { duration: 0.3 } }
          }
          data-disabled={!playerCount}
        >
          <Link
            className="text-[white] w-[95%] text-center font-bold text-4xl py-5 px-12"
            href={anyPlayers ? "/player-select" : "#"}
          >
            {!anyPlayers ? "No Selection" : "Select"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
