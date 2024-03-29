"use client";

import { debounce } from "@/constants/utils";
import {
  AppContext,
  AppReducer,
  initialState,
  state,
} from "@/reducers/AppReducer";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

export const Loader = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Wrap your save function in a useCallback hook with debounce
  const debouncedSave = useCallback(
    debounce((state: state) => {
      localStorage.setItem("myAppState", JSON.stringify({ ...state }));
    }, 500),
    []
  ); // Adjust the debounce time (500ms) as needed

  useEffect(() => {
    const savedState = localStorage.getItem("myAppState");
    dispatch({
      type: "hydrate",
      payload: savedState ? JSON.parse(savedState) : initialState,
    });
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Call the debounced function inside your effect
    isMounted && debouncedSave(state);
  }, [state, debouncedSave]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
