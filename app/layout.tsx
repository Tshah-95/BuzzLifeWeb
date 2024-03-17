import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import { Loader } from "./Loader";

const chaloops = localFont({
  src: [
    {
      path: "./chaloops/chalupa.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./chaloops/chalupa-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./chaloops/chalupa-thin.ttf",
      weight: "100",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Buzz Life Games",
  description: "The Ultimate Party Bundle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Loader>
      <html lang="en">
        <body className={chaloops.className}>
          <main className="relative flex h-screen w-full justify-center items-center bg-primary overflow-hidden z-10">
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
        </body>
      </html>
    </Loader>
  );
}
