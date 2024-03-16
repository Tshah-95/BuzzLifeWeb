import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

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
    <html lang="en">
      <body
        className={chaloops.className.concat(
          " max-h-screen w-full overflow-hidden"
        )}
      >
        <main className="flex h-screen max-h-screen justify-center items-center bg-primary">
          <div className="absolute top-[50%] w-[135%] max-w-screen-md aspect-[6/5.5]">
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
  );
}
