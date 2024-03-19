"use client";

import { useAppContext } from "@/reducers/AppReducer";
import GameLoading from "./skeleton";

export default function GameLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { state, dispatch } = useAppContext();
  return !state.card ? <GameLoading /> : children;
}
