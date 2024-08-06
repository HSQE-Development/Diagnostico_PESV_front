// slices/vehicleQuestionSlice.ts
import { FleetDTO, VehicleQuestion } from "@/interfaces/Company";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  questions: [] as VehicleQuestion[],
  fleetData: [] as FleetDTO[],
  totalOwned: 0,
  totalThirdParty: 0,
  totalArrended: 0,
  totalContractors: 0,
  totalIntermediate: 0,
  totalLeasing: 0,
  totalRenting: 0,
  totalQuantity: 0,
};

const vehicleQuestionSlice = createSlice({
  name: "vehicleQuestions",
  initialState,
  reducers: {
    setVehicleQuestions: (state, action: PayloadAction<VehicleQuestion[]>) => {
      state.questions = action.payload;
    },
    clearVehicleQuestions: (state) => {
      state.questions = [];
    },
    setFleetData: (state, action: PayloadAction<FleetDTO[]>) => {
      state.fleetData = action.payload;
      calculateTotals(state);
    },
    updateFleetData: (state, action: PayloadAction<FleetDTO>) => {
      const updatedData = action.payload;
      const index = state.fleetData.findIndex(
        (data) => data.vehicle_question === updatedData.vehicle_question
      );
      if (index !== -1) {
        state.fleetData[index] = updatedData;
      } else {
        state.fleetData.push(updatedData);
      }
      calculateTotals(state);
    },
    clearFleetData: (state) => {
      state.fleetData = [];
    },
  },
});

const calculateTotals = (state: typeof initialState) => {
  state.totalOwned = state.fleetData.reduce(
    (total, item) => total + item.quantity_owned,
    0
  );
  state.totalThirdParty = state.fleetData.reduce(
    (total, item) => total + item.quantity_third_party,
    0
  );
  state.totalArrended = state.fleetData.reduce(
    (total, item) => total + item.quantity_arrended,
    0
  );
  state.totalContractors = state.fleetData.reduce(
    (total, item) => total + item.quantity_contractors,
    0
  );
  state.totalIntermediate = state.fleetData.reduce(
    (total, item) => total + item.quantity_intermediation,
    0
  );
  state.totalLeasing = state.fleetData.reduce(
    (total, item) => total + item.quantity_leasing,
    0
  );
  state.totalRenting = state.fleetData.reduce(
    (total, item) => total + item.quantity_renting,
    0
  );
  state.totalRenting = state.fleetData.reduce(
    (total, item) => total + item.quantity_employees,
    0
  );
  state.totalQuantity = state.fleetData.reduce(
    (total, item) =>
      total +
      item.quantity_owned +
      item.quantity_third_party +
      item.quantity_arrended +
      item.quantity_contractors +
      item.quantity_intermediation +
      item.quantity_leasing +
      item.quantity_employees +
      item.quantity_renting,
    0
  );
};

export const {
  setVehicleQuestions,
  clearVehicleQuestions,
  setFleetData,
  updateFleetData,
  clearFleetData,
} = vehicleQuestionSlice.actions;

export default vehicleQuestionSlice.reducer;
