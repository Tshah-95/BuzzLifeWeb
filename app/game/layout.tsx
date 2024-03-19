"use client";

import { useAppContext } from "@/reducers/AppReducer";
import GameLoading from "./skeleton";

export default function GameLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { state } = useAppContext();
  return !state.card ? <GameLoading /> : children;
}
