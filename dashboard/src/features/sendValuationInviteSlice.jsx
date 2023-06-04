import { apiSlice } from "./apiSlice";

export const sendValuationSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        sendValuationFirmInvite: bulder.mutation({
            query: (formData) => ({
                url: `/api/admin/send-valuation-firm-invite`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useSendValuationFirmInviteMutation} = sendValuationSlice;

