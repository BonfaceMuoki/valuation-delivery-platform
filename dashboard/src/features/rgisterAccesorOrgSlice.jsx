import { apiSlice } from "./apiSlice";

export const registerAccesorOrgSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        registerAccesor: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-accesor`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        registerAccesorUser: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-accesor-user`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),requestAccesorAccess: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/request-accesor-access`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestAccesorRegistrationStatus: bulder.query({
            query: (request) => ({
                url: `/api/admin/get-accesor-request-registration-status?req=${request}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        archiveAccesorRegistrationRequest: bulder.mutation({
            query: (formdata) => ({
                url: `/api/admin/archive-accesor-registration-request`,
                method: 'POST',
                body:formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const {useArchiveAccesorRegistrationRequestMutation,useRequestAccesorAccessMutation,useRequestAccesorRegistrationStatusQuery,useRegisterAccesorMutation,useRegisterAccesorUserMutation} = registerAccesorOrgSlice;

