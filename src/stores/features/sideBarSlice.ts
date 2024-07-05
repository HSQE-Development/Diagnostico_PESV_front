import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCollapsed: false as boolean,
  };
  
export const sideBarSlice = createSlice({
    name:"sidebar",
    initialState,
    reducers:{
        setCollapsed: (state)=>{
            if(!state.isCollapsed)
                state.isCollapsed = true
            else state.isCollapsed = false
        }
    }
})
export const { setCollapsed } = sideBarSlice.actions;
export default sideBarSlice.reducer