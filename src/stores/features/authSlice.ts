import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuth } from "../../interfaces/IAuth";
import { IUser } from "@/interfaces/IUser";

const initialState = {
  authUser: null as IAuth | null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<IAuth>) => {
      state.authUser = action.payload;
    },
    clearAuthUser: (state) => {
      state.authUser = null;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      if (state.authUser) {
        state.authUser.user = action.payload;
      }
    },
  },
});


export const { setAuthUser, clearAuthUser, updateUser } = authSlice.actions;
export default authSlice.reducer