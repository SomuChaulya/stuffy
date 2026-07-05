import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
    },
  });
};
