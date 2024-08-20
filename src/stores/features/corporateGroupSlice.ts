import { ICorporateGroup } from "@/interfaces/CorporateGroup";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  corporateGroups: [] as ICorporateGroup[],
};

export const corporateGroupSlice = createSlice({
  name: "corporateGroup",
  initialState,
  reducers: {
    setCorporateGroups: (state, action: PayloadAction<ICorporateGroup[]>) => {
      state.corporateGroups = action.payload;
    },
    setCorporateGroup: (state, action: PayloadAction<ICorporateGroup>) => {
      state.corporateGroups.push(action.payload);
    },
  },
});

export const { setCorporateGroups, setCorporateGroup } =
  corporateGroupSlice.actions;
export default corporateGroupSlice.reducer;
