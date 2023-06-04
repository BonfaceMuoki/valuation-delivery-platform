import { apiSlice } from "./apiSlice";

export const inviteUploaderSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        inviteUploader: bulder.mutation({
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

export const { useInviteUploaderMutation} = inviteUploaderSlice;

