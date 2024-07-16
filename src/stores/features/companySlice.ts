import { Company } from "@/interfaces/Company";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  companies: [] as Company[],
  company: null as Company | null,
};

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    clearCompanies: (state) => {
      state.companies = [];
    },
    setCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
    },
    setUpdateCompany: (state, action: PayloadAction<Company>) => {
      const updatedCompany = action.payload;
      const index = state.companies.findIndex(
        (company) => company.id === updatedCompany.id
      );
      if (index !== -1) {
        state.companies[index] = updatedCompany;
      }
    },
    setDeleteCompany: (state, action: PayloadAction<number>) => {
      const companyToDelete = action.payload;
      const index = state.companies.findIndex(
        (company) => company.id === companyToDelete
      );
      if (index !== -1) {
        state.companies.splice(index, 1); // Elimina el elemento en la posición `index`
      }
    },
  },
});

export const {
  setCompanies,
  clearCompanies,
  setCompany,
  setUpdateCompany,
  setDeleteCompany,
} = companySlice.actions;
export default companySlice.reducer;
