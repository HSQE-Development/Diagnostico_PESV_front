import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  diagnosisCurrent: 0 as number,
  stepLenght: 0 as number,
  externalCurrent: 0 as number,
};

export const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setNextDiagnosisCurrent: (state) => {
      state.diagnosisCurrent += 1;
    },
    setPrevDiagnosisCurrent: (state) => {
      state.diagnosisCurrent -= 1;
    },
    setStepsLenght: (state, action: PayloadAction<number>) => {
      state.stepLenght = action.payload;
    },
    setDiagnosisCurrent: (state, action: PayloadAction<number>) => {
      state.diagnosisCurrent = action.payload;
    },
    setExternalCurrent: (state, action: PayloadAction<number>) => {
      state.externalCurrent = action.payload;
    },
    setNextExternalCurrent: (state) => {
      state.externalCurrent += 1;
    },
    setPrevExternalCurrent: (state) => {
      state.diagnosisCurrent -= 1;
    },
  },
});

export const {
  setNextDiagnosisCurrent,
  setPrevDiagnosisCurrent,
  setStepsLenght,
  setDiagnosisCurrent,
  setExternalCurrent,
  setNextExternalCurrent,
  setPrevExternalCurrent,
} = utilsSlice.actions;
export default utilsSlice.reducer;
