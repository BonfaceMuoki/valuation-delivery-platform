import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    mode:"light",
    user:null,
    roles:null,
    permissions:null,
    token:null,
    fetchvaluationreports:true
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user,roles,permissions,access_token } = action.payload
            state.user = user
            state.roles = roles?roles :state.roles
            state.permissions = permissions?permissions :state.permissions 
            state.token =  access_token?access_token :state.access_token
        },
        updateUserDetails: (state, action) => {            
            const { user,roles,permissions,access_token } = action.payload
            state.user = user
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        },
        setMode: (state,action)=>{
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setfetchvaluationreports: (state,action)=>{
            state.fetchvaluationreports=action.payload;
        }

    },
})

export const {updateUserDetails, setCredentials, logOut,setMode,setfetchvaluationreports } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentRoles = (state) => state.auth.roles
export const selectCurrentPermissions = (state) => state.auth.permissions
export const istofetchvaluationreports = (state)=>state.auth.fetchvaluationreports