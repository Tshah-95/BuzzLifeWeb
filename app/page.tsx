"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import smileyBubbles from "../public/smiley-bubbles.json";
import { easeIn, easeInOut, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

const scaleAnimation = {
  scale: [1, 1.1, 1],
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

export default function Home() {
  const animRef = useRef<any>(null);

  useEffect(() => {
    animRef.current.setSpeed(0.5);
  }, [animRef.current]);

  return (
    <>
      <motion.div
        className="flex mt-5 justify-center items-center"
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
          <div className="w-[90%] max-w-[450px] min-h-[200px]">
            <Lottie animationData={smileyBubbles} lottieRef={animRef} loop />
          </div>
        </div>
        <div className="flex justify-center items-center active:scale-95">
          <motion.div
            className="bg-tertiary rounded-lg shadow-md flex w-1/2"
            animate={scaleAnimation}
          >
            <Link
              className="text-white text-center w-full font-bold text-3xl md:text-5xl py-5 md:py-10 px-12 select-none"
              href="/pack-select"
            >
              Play
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
