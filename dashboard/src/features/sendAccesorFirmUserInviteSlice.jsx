import { apiSlice } from "./apiSlice";

export const sendAccesorFirmUserInvite = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        sendAccesorFirmUserInvite: bulder.mutation({
            query: (formData) => ({
                url: `/api/accesor/send-user-invite`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useSendAccesorFirmUserInviteMutation} = sendAccesorFirmUserInvite;

