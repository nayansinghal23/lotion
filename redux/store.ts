import { configureStore } from "@reduxjs/toolkit";

import searchReducer from "./openSearchSlice";
import moveToReducer from "./moveToSlice";
import selectedDocumentIdReducer from "./selectedDocumentIdSlice";

export const store = configureStore({
  reducer: {
    searchReducer,
    moveToReducer,
    selectedDocumentIdReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
