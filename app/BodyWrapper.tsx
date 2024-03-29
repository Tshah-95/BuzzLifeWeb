"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import Image from "next/image";
import { useAppContext } from "@/reducers/AppReducer";
import { useAnimation, motion } from "framer-motion";
import { colors, gameColors } from "@/constants/variables";
import { usePathname } from "next/navigation";

export const BodyWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [pageWindow, setPageWindow] = useState<number | null>(null);
  const controls = useAnimation();

  const {
    state: { index },
  } = useAppContext();

  const pathname = usePathname();
  const isOnGameScreen = pathname === "/game";

  useEffect(() => {
    setPageWindow(window.innerHeight);
  }, []);

  useEffect(() => {
    if (isOnGameScreen) {
      controls.start({
        backgroundColor: gameColors[index % gameColors.length],
      });
    } else {
      controls.start({ backgroundColor: "#ccccff" });
    }
  }, [index, isOnGameScreen]);

  return (
    <main
      className="w-full"
      style={{
        height: pageWindow ?? "100%",
      }}
    >
      <motion.div
        className="relative flex w-full h-full justify-center items-center bg-primary bg-gradient-to-tr from-[rgba(255,255,255,0.1)] from-45% via-[rgba(255,255,255,0.3)] via-60% to-[rgba(255,255,255,0.1)] to-75% overflow-hidden z-10"
        animate={controls}
        initial={{ backgroundColor: "#ccccff" }}
        transition={{ duration: 0.8 }}
      >
        {!isOnGameScreen && (
          <div
            className="absolute w-[135%] max-w-screen-xl max-h-full top-[50%] left-[50%] transform translate-x-[-50%] pointer-events-none -z-10"
            style={{ aspectRatio: "6 / 5.5" }}
          >
            <Image
              alt="An image of a beer with foam in the background"
              src="/beer-with-foam.png"
              fill
              priority
            />
          </div>
        )}

        <div className="flex flex-col h-full w-full items-center justify-center max-w-screen-sm p-5 text-lightblack relative">
          {children}
        </div>
      </motion.div>
    </main>
  );
};
