import { apiSlice } from "./apiSlice";

const assignRolePermissionssSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        assignRolePermissionsList: builder.mutation({
            query: (formData) => ({
                url: `/api/admin/assign-role-permissions`,
                method: 'POST',
                body:formData,
                headers: {
                    'Accept': 'Application/json'
                  }          
            }),
            skipCache:true
        })
    })
})
export const { useAssignRolePermissionsListMutation } = assignRolePermissionssSlice;