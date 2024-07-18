import { Arl } from "@/interfaces/Arl";
import {
  addItemToArray,
  deleteItemFromArray,
  updateItemInArray,
} from "@/utils/utilsMethods";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  arls: [] as Arl[],
};

export const arlSlice = createSlice({
  name: "arls",
  initialState,
  reducers: {
    setArls: (state, action: PayloadAction<Arl[]>) => {
      state.arls = action.payload;
    },

    clearArls: (state) => {
      state.arls = [];
    },
    setArl: (state, action: PayloadAction<Arl>) => {
      state.arls = addItemToArray(state.arls, action.payload);
    },
    setUpdateArl: (state, action: PayloadAction<Arl>) => {
      state.arls = updateItemInArray(state.arls, action.payload);
    },
    setDeleteArl: (state, action: PayloadAction<number>) => {
      state.arls = deleteItemFromArray(state.arls, action.payload);
    },
  },
});

export const { setArls, setArl, clearArls, setUpdateArl, setDeleteArl } =
  arlSlice.actions;

export default arlSlice.reducer;
