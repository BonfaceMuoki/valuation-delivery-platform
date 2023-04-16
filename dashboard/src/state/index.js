import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    mode:"light",
    userdetails:{},
    access_token:"" 
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
        },
        setUserDetails:(state,action)=>{
            state.userdetails=action.payload.user;
        },
        setUserAccessToken:(state,action)=>{
           state.access_token=action.payload.access_token;
        },      
    }
});

export const { setMode,setLightMode,setUserAccessToken,setUserDetails }= globalSlice.actions;

export default globalSlice.reducer;