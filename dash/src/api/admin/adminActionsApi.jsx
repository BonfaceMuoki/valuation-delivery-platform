import { apiSlice } from "../../featuers/apiSlice"
import { useSelector } from "react-redux";

export const retrieveAdminDashboardSliceApi = apiSlice.injectEndpoints({

    endpoints: builder => ({
        getAdminDashboardDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/admin/get-dashboard`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        getRolesList: builder.query({
            query: (invite_token) => ({
                url: `/api/admin/get-all-roles`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            })

        }),
        createPermission: builder.mutation({
            query: credentials => ({
                url: '/api/admin/add-permissions',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'Accept': 'Application/json'
                }
            })
        }),
        deletePermission: builder.mutation({
            query: (permission) => ({
                url: `/api/admin/delete-permission/${permission}`,
                method: 'DELETE',
                headers: {
                    'Accept': 'Application/json'
                }
            })
        }),
        updatePermission: builder.mutation({
            query: credentials => ({
                url: '/api/admin/update-permission',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'Accept': 'Application/json'
                }
            })
        }),
        updateRolePermission: builder.mutation({
            query: credentials => ({
                url: '/api/admin/update-role-permission',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'Accept': 'Application/json'
                }
            })
        }),
        getPermissionsList: builder.query({
            query: ({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder }) => {
                const url = `/api/admin/get-all-permissions?page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`;
                return {
                    url: url,
                    method: 'GET',
                    headers: {
                        'Accept': 'Application/json'
                    }
                };
            }
        }),
        getRolePermissions: builder.query({
            query: (invite_token) => ({
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
    useGetRolesListQuery,
    useGetPermissionsListQuery,
    useGetAdminDashboardDetailsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
    useUpdateRolePermissionMutation
} = retrieveAdminDashboardSliceApi;