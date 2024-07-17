import { configureStore } from "@reduxjs/toolkit";

import searchReducer from "./openSearchSlice";

export const store = configureStore({
  reducer: {
    searchReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
