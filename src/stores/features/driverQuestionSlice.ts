import { determineCompanySize } from "@/Features/Diagnosis/utils/functions";
import { DriverDTO, DriverQuestion } from "@/interfaces/Company";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  questions: [] as DriverQuestion[],
  driverData: [] as DriverDTO[],
  totalGeneral: 0,
  totalQuantity: 0,
};

const driverQuestionSlice = createSlice({
  name: "driverQuestion",
  initialState,
  reducers: {
    setDriverQuestions: (state, action: PayloadAction<DriverQuestion[]>) => {
      state.questions = action.payload;
    },
    clearDriverQuestions: (state) => {
      state.questions = [];
    },
    setDriverData: (state, action: PayloadAction<DriverDTO[]>) => {
      state.driverData = action.payload;
      calculateTotals(state);
    },
    updateDriverData: (state, action: PayloadAction<DriverDTO>) => {
      const updatedData = action.payload;
      const index = state.driverData.findIndex(
        (data) => data.driver_question === updatedData.driver_question
      );
      if (index !== -1) {
        state.driverData[index] = updatedData;
      } else {
        state.driverData.push(updatedData);
      }
      calculateTotals(state);
    },
    clearDriverData: (state) => {
      state.driverData = [];
    },
  },
});

const calculateTotals = (state: typeof initialState) => {
  state.totalQuantity = state.driverData.reduce(
    (total, item) => total + item.quantity,
    0
  );
};

export const {
  setDriverQuestions,
  clearDriverQuestions,
  setDriverData,
  updateDriverData,
  clearDriverData,
} = driverQuestionSlice.actions;

export default driverQuestionSlice.reducer;
