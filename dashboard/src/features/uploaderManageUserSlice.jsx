import { apiSlice } from "./apiSlice";

export const uploaderManageUserSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        blockUser: bulder.mutation({
            query: (formData) => ({
                url: `/api/uploader/block-user`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        updateUserInformation: bulder.mutation({
            query: (formData) => ({
                url: `/api/uploader/update-user-information`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useBlockUserMutation,useUpdateUserInformationMutation} = uploaderManageUserSlice;

