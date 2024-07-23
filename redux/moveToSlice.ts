import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

export interface IMoveTo {
  openMoveToModal: boolean;
}

const initialState: IMoveTo = {
  openMoveToModal: false,
};

export const openMoveToModalSlice = createSlice({
  name: "move-to",
  initialState,
  reducers: {
    toggleMoveToModal: (state, action: PayloadAction<boolean>) => {
      state.openMoveToModal = action.payload;
    },
  },
});
export const { toggleMoveToModal } = openMoveToModalSlice.actions;
export const moveToSelector = (state: RootState) => state.moveToReducer;
export default openMoveToModalSlice.reducer;
