import { ICorporateGroup } from "@/interfaces/CorporateGroup";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  corporateGroups: [] as ICorporateGroup[],
  corporate_group_id: 0, // Valor inicial
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
    setCorporateGroupId: (state, action: PayloadAction<number>) => {
      state.corporate_group_id = action.payload;
    },
  },
});

export const { setCorporateGroups, setCorporateGroup, setCorporateGroupId } =
  corporateGroupSlice.actions;
export default corporateGroupSlice.reducer;
