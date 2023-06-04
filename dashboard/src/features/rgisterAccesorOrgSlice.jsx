import { apiSlice } from "./apiSlice";

export const registerAccesorOrgSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        registerAccesor: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/register`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useRegisterAccesorMutation} = registerAccesorOrgSlice;

