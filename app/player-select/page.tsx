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

  const scrollableRef = useRef<any>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showShadows, setShowShadows] = useState(false);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", () => {
        setShowShadows(
          scrollableElement.scrollHeight > scrollableElement.clientHeight
        );
        setScrollPercent(
          scrollableElement.scrollTop /
            (scrollableElement.scrollHeight - scrollableElement.clientHeight)
        );
      });
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", () => {});
      }
    };
  }, [scrollableRef.current]);

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showRemovePlayer, setShowRemovePlayer] = useState(false);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center max-w-screen-sm p-5">
      <div className="flex-[1_0_200px] flex flex-col w-full items-stretch">
        <div className="flex-auto">header</div>
        <div className="text-3xl"># of Players</div>
      </div>
      {showShadows && scrollPercent > 0 && (
        <div className="shadow-[0_25px_20px_3px_rgba(0,0,0,0.3)] bg-secondary h-0 w-full z-50" />
      )}
      <div
        ref={scrollableRef}
        className="flex-3 flex flex-wrap justify-center content-start w-full my-2 gap-y-2 relative overflow-auto scroll-smooth"
      >
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
      </div>
      {showShadows && scrollPercent < 1 && (
        <div className="shadow-[0_-25px_20px_3px_rgba(0,0,0,0.3)] bg-secondary h-0 w-full z-50" />
      )}
      <div
        className="w-full data-[disabled=false]:active:scale-95"
        data-disabled={!anyPlayers}
      >
        <motion.div
          className="bg-tertiary rounded-lg shadow-md flex w-full data-[disabled=true]:opacity-75"
          animate={
            anyPlayers
              ? scaleAnimation
              : { scale: 1, transition: { duration: 0.3 } }
          }
          data-disabled={!playerCount}
        >
          <Link
            className="text-[white] w-full text-center font-bold text-4xl py-5 px-12"
            href={anyPlayers ? "/player-select" : "#"}
          >
            {!anyPlayers ? "No Selection" : "Select"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
