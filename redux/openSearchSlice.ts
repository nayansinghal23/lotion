import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

export interface IOpenSearch {
  open: boolean;
}

const initialState: IOpenSearch = {
  open: false,
};

export const openSearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    toggleSearch: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});
export const { toggleSearch } = openSearchSlice.actions;
export const searchSelector = (state: RootState) => state.searchReducer;
export default openSearchSlice.reducer;
