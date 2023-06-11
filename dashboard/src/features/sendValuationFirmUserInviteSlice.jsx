import { apiSlice } from "./apiSlice";

export const sendValuationFirmUserInvite = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        sendValuationFirmUserInvite: bulder.mutation({
            query: (formData) => ({
                url: `/api/uploader/send-user-invite`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useSendValuationFirmUserInviteMutation} = sendValuationFirmUserInvite;

