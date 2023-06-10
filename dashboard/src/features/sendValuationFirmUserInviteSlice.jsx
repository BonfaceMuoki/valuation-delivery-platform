import { apiSlice } from "./apiSlice";

export const addPermissionSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        addPermission: bulder.mutation({
            query: (formData) => ({
                url: `/api/admin/add-permissions`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useAddPermissionMutation} = addPermissionSlice;

