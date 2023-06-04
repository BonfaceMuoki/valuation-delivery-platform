import { apiSlice } from "./apiSlice";

const rolesSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getRolesList: builder.query({
            query: () => ({
                url: `/api/admin/get-all-roles`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            }),
            skipCache:true
        })
    })
})
export const { useGetRolesListQuery } = rolesSlice;