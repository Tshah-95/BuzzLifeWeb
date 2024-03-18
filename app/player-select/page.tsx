"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import Link from "next/link";
import { Header } from "../Header";
import {
  useAppContext,
  action,
  player as playerType,
} from "@/reducers/AppReducer";

const maxPlayers = 20;
const minPlayers = 2;
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
  const enoughPlayers = players.length >= minPlayers;
  const isMounted = useRef(false);

  console.log({ players, enoughPlayers });

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
      <Header />
      <div className="flex-[1_0_200px] flex flex-col w-full items-stretch">
        <div className="flex-auto">header</div>
        <div className="text-3xl"># of Players</div>
      </div>
      {showShadows && scrollPercent > 0 && (
        <div className="shadow-[0_25px_30px_3px_rgba(0,0,0,0.7)] bg-secondary h-0 w-full z-50" />
      )}
      <div
        ref={scrollableRef}
        className="flex-3 flex flex-wrap justify-center content-start w-full my-2 gap-2 relative overflow-auto scroll-smooth"
      >
        {players.map((player, index) => (
          <PlayerTile
            key={player.id}
            player={player}
            dispatch={dispatch}
            index={index}
          />
        ))}
      </div>
      {showShadows && scrollPercent < 0.99 && (
        <div className="shadow-[0_-25px_30px_3px_rgba(0,0,0,0.7)] bg-secondary h-0 w-full z-50" />
      )}
      <div
        className="w-full data-[disabled=false]:active:scale-95"
        data-disabled={!enoughPlayers}
      >
        <motion.div
          className="bg-tertiary rounded-lg shadow-md flex w-full data-[disabled=true]:opacity-75"
          animate={
            enoughPlayers
              ? scaleAnimation
              : { scale: 1, transition: { duration: 0.3 } }
          }
          data-disabled={!playerCount}
        >
          <Link
            className="text-[white] w-full text-center font-bold text-4xl py-5 px-12"
            href={enoughPlayers ? "/player-select" : "#"}
          >
            {!enoughPlayers ? "Need 2+ Players" : "Begin"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

const PlayerTile = ({
  player,
  dispatch,
  index,
}: {
  player: playerType;
  dispatch: (value: action) => void;
  index: number;
}) => {
  const { name, id } = player;
  const [focused, setFocused] = useState(false);

  return (
    <div
      key={id}
      className="flex items-center justify-center bg-secondary rounded-lg shadow-md max-w-[45%]"
    >
      <button
        className="p-4"
        onClick={() => dispatch({ type: "removePlayerById", payload: id })}
      >
        <p className="font-bold text-sm text-[white]">x</p>
      </button>
      <input
        className="text-2xl text-center text-[white] bg-secondary py-5 w-full flex rounded-lg placeholder:text-[white] placeholder:opacity-80"
        type="text"
        placeholder={name === "" && focused ? "" : `Player ${index + 1}`}
        value={name}
        onChange={(e) => {
          dispatch({
            type: "handleNameChange",
            payload: { id, name: e.target.value },
          });
        }}
      />
    </div>
  );
};

{
  /* <TextInput
        style={{
          fontSize: 22,
          textAlign: "center",
          color: "white",
          fontFamily: "chalupa",
          width: "100%",
          flex: 1,
          paddingVertical: 17,
          paddingRight: 25,
        }}
        placeholder={name === "" && focused ? "" : `Player ${index + 1}`}
        placeholderTextColor={"white"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={(text) =>
          dispatch({ type: "handleNameChange", payload: { id, name: text } })
        }
        value={name}
      /> */
}
