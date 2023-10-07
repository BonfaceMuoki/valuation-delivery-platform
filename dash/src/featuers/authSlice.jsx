import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    mode: "light",
    user: null,
    roles: null,
    permissions: null,
    token: null,
    fetchvaluationreports: true,
    valuationLocationDetails: null,
    valuationPropertynDetails: null,
    valuationValuationDetails: null,
    reportDoc: null,
    reportSignatories: null,
    reportRecepient: null,
    selectedPropertyType: null,
    selectedRecipient: null,
    recipientUsernames: null,
    recipientEmails: null,
    recipientPhones: null,
    selectedAccesors: null
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, roles, permissions, access_token } = action.payload
            state.user = user
            state.roles = roles ? roles : state.roles
            state.permissions = permissions ? permissions : state.permissions
            state.token = access_token ? access_token : state.access_token
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        }, updateUserDetails: (state, action) => {
            const { user, roles, permissions, access_token } = action.payload
            state.user = user
        }, setfetchvaluationreports: (state, action) => {
            state.fetchvaluationreports = action.payload;
        }, setValuationLocationDetails: (state, action) => {
            state.valuationLocationDetails = action.payload;
        },
        setValuationPropertyDetails: (state, action) => {
            state.valuationPropertynDetails = action.payload;
        },
        setValuationDetails: (state, action) => {
            state.valuationValuationDetails = action.payload;
        },
        setReportRecipient: (state, action) => {
            state.reportRecepient = action.payload;
        },
        setReportSignatories: (state, action) => {
            state.reportSignatories = action.payload;
        },
        setSelectedPropertyType: (state, action) => {
            state.selectedPropertyType = action.payload;
        },
        setSelectedRecipient: (state, action) => {
            state.selectedRecipient = action.payload;
        },
        setRecipientUsernames: (state, action) => {
            state.recipientUsernames = action.payload;
        },
        setRecipientEmails: (state, action) => {
            state.recipientEmails = action.payload;
        },
        setRecipientPhone: (state, action) => {
            state.recipientPhones = action.payload;
        },
        setSelectedAccesors: (state, action) => {
            state.selectedAccesors = action.payload;
        }

    },
})

export const { setSelectedAccesors, setRecipientUsernames, setRecipientPhone, setRecipientEmails, setSelectedRecipient, setSelectedPropertyType, setReportSignatories, setReportRecipient, updateUserDetails, setCredentials, logOut, setMode, setfetchvaluationreports, setValuationLocationDetails, setValuationPropertyDetails, setValuationDetails } = authSlice.actions

export default authSlice.reducer
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentRecipient = (state) => state.auth.reportRecepient
export const selectCurrentSignatories = (state) => state.auth.reportSignatories
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentRoles = (state) => state.auth.roles
export const selectCurrentPermissions = (state) => state.auth.permissions
export const istofetchvaluationreports = (state) => state.auth.fetchvaluationreports
export const selectLocationDetails = (state) => state.auth.valuationLocationDetails
export const selectPropertyDetails = (state) => state.auth.valuationPropertynDetails
export const selectValuationDetails = (state) => state.auth.valuationValuationDetails
export const selectSelectedPropertyType = (state) => state.auth.selectedPropertyType
export const selectSelectedRecipient = (state) => state.auth.selectedRecipient
export const selecteedaccesors = (state) => state.auth.selectedAccesors
