import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const rolePermissionsSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getRolePermissions: builder.query({
            query: () => ({
                url: `/api/admin/get-role-permissions`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetRolePermissionsQuery
} = rolePermissionsSliceApi ;