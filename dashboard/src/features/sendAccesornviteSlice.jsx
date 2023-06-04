import { apiSlice } from "./apiSlice";

export const sendAccesorSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        sendAccesorInvite: bulder.mutation({
            query: (formData) => ({
                url: `/api/admin/send-accesor-invite`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useSendAccesorInviteMutation} = sendAccesorSlice;

