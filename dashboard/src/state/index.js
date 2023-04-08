import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    mode:"light"
};
export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLightMode: (state)=>{
            state.mode = state.mode === "dark" ? "light" : "light";
        }      
    }
});

export const { setMode,setLightMode }= globalSlice.actions;

export default globalSlice.reducer;