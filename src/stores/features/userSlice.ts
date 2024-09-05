import { IUser } from "@/interfaces/IUser";
import {
  addItemToArray,
  deleteItemFromArray,
  updateItemInArray,
} from "@/utils/utilsMethods";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  users: [] as IUser[],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.users = addItemToArray(state.users, action.payload);
    },
    setUpdateUser: (state, action: PayloadAction<IUser>) => {
      state.users = updateItemInArray(state.users, action.payload);
    },
    setDeleteArl: (state, action: PayloadAction<number>) => {
      state.users = deleteItemFromArray(state.users, action.payload);
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
});

export const { setUsers, setUser, clearUsers, setUpdateUser, setDeleteArl } =
  userSlice.actions;

export default userSlice.reducer;
