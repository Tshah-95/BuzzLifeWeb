"use client";

import { AppContext, AppReducer, initialState } from "@/reducers/AppReducer";
import { useReducer } from "react";

export const Loader = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
