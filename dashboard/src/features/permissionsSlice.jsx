import { apiSlice } from "./apiSlice";

const permissionssSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getPermissionsList: builder.query({
            query: () => ({
                url: `/api/admin/get-all-permissions`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            }),
            skipCache:true
        })
    })
})
export const { useGetPermissionsListQuery } = permissionssSlice;