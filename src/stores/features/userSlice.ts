import { IUser } from "@/interfaces/IUser";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: null as Array<IUser> | null,
  };

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
    }
})