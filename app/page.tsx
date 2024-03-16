"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import smileyBubbles from "../public/smiley-bubbles.json";
import { easeIn, easeInOut, motion } from "framer-motion";

const scaleAnimation = {
  scale: [1, 1.1, 1],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export default function Home() {
  return (
    <div className="flex flex-col h-full items-center justify-center max-w-screen-sm p-10">
      <motion.div
        className="flex justify-center items-center"
        animate={scaleAnimation}
      >
        <div className="h-full w-[90%] max-w-[450px] max-h-full relative justify-center items-center">
          <Image
            alt="Buzz Life Games Title Image"
            src="/title.png"
            width={400}
            height={400}
            priority
          />
        </div>
      </motion.div>
      <div className="flex flex-col relative bottom-[10%]">
        <div className="flex justify-center">
          <div className="w-[80%] max-w-[450px] min-h-[200px]">
            <Lottie animationData={smileyBubbles} loop />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <motion.div
            className="bg-tertiary rounded-lg shadow-md"
            animate={scaleAnimation}
          >
            <button className="text-[white] font-bold text-4xl py-5 px-12">
              Play
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
