import { useRef } from "react";
import { Provider, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { Group } from "./lib/types";

// A "slice" is one piece of app state managed by Redux.
// - name: used in action type strings (e.g. "groups/...")
// - initialState: default values before any data is loaded (empty list)
// - reducers: functions that update this slice (none yet — we fill state via preloadedState)
const groupsSlice = createSlice({
  name: "groups",
  initialState: [] as Group[],
  reducers: {},
});

export type RootState = {
  groups: Group[];
};

// Creates the Redux store (the single place that holds all state).
// preloadedState lets us start with data from the React Router loader instead of an empty list.
export function makeStore(preloadedState?: RootState) {
  return configureStore({
    reducer: {
      groups: groupsSlice.reducer,
    },
    preloadedState,
  });
}

type AppStore = ReturnType<typeof makeStore>;

// Typed hook to read from the store in components.
export const useAppSelector = useSelector.withTypes<RootState>();

// Wrap the UI in this so any child can use the hook above.
// useRef keeps one store instance for the life of the component (don't recreate on re-render).
export function StoreProvider({
  children,
  preloadedState,
}: {
  children: React.ReactNode;
  preloadedState?: RootState;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = makeStore(preloadedState);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
