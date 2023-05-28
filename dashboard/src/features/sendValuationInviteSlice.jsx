import { apiSlice } from "./apiSlice";

export const addRoleSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        addRole: bulder.mutation({
            query: (formData) => ({
                url: `/api/admin/add-role`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useAddRoleMutation} = addRoleSlice;

