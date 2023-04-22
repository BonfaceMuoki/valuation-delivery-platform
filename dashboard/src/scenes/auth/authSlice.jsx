import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    mode:"light",
    user:null,
    token:null
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, access_token } = action.payload
            state.user = user
            state.token = access_token
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        },
        setMode: (state,action)=>{
            state.mode = state.mode === "light" ? "dark" : "light";
        }
    },
})

export const { setCredentials, logOut,setMode } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token