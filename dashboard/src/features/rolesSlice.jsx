import { apiSlice } from "./apiSlice";

const rolesSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getRolesList: builder.query({
            query:()=>`/api/admin/get-all-roles`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        })
    })
})
export const { useGetRolesListQuery } = rolesSlice;