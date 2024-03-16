import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
      <body className={chaloops.className}>{children}</body>
    </html>
  );
}
