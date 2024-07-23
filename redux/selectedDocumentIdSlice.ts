import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { Id } from "@/convex/_generated/dataModel";

export interface ISelectedDocumentId {
  currentId: Id<"documents"> | undefined;
}

const initialState: ISelectedDocumentId = {
  currentId: undefined,
};

export const selectedDocumentIdSlice = createSlice({
  name: "selected-document-id",
  initialState,
  reducers: {
    selectedDocumentId: (
      state,
      action: PayloadAction<Id<"documents"> | undefined>
    ) => {
      state.currentId = action.payload;
    },
  },
});
export const { selectedDocumentId } = selectedDocumentIdSlice.actions;
export const selectedDocumentIdSelector = (state: RootState) =>
  state.selectedDocumentIdReducer;
export default selectedDocumentIdSlice.reducer;
