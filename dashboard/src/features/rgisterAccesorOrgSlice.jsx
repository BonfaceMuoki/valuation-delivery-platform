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
        })
    })
})

export const { useRegisterAccesorMutation,useRegisterAccesorUserMutation} = registerAccesorOrgSlice;

