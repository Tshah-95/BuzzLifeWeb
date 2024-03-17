"use client";

import "./globals.css";
import Image from "next/image";

export const BodyWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main
      className="relative flex w-full justify-center items-center bg-primary overflow-hidden z-10"
      style={{ height: window?.innerHeight }}
    >
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
      {children}
    </main>
  );
};
