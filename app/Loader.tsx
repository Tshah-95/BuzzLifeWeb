"use client";

import { debounce } from "@/constants/utils";
import {
  AppContext,
  AppReducer,
  initialState,
  state,
} from "@/reducers/AppReducer";
import { useCallback, useEffect, useReducer, useRef } from "react";

export const Loader = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [state, dispatch] = useReducer(AppReducer, initialState, () => {
    const savedState = localStorage.getItem("myAppState");
    return savedState ? JSON.parse(savedState) : initialState;
  });

  // Wrap your save function in a useCallback hook with debounce
  const debouncedSave = useCallback(
    debounce((state: state) => {
      localStorage.setItem("myAppState", JSON.stringify(state));
    }, 2000),
    []
  ); // Adjust the debounce time (500ms) as needed

  useEffect(() => {
    // Call the debounced function inside your effect
    debouncedSave(state);
  }, [state, debouncedSave]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
