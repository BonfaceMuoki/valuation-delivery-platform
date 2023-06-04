import { apiSlice } from "./apiSlice";

export const inviteAccesorSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        inviteAccesor: bulder.mutation({
            query: (formData) => ({
                url: `/api/register-accesor`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useInviteAccesorMutation} = inviteAccesorSlice;

