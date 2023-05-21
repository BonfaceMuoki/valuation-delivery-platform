import { apiSlice } from "./apiSlice";

export const deleteRoleSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        deleteRole: builder.mutation({
            query: ({role}) => {
                console.log(role);
                return {
                    url: `/api/admin/delete-role/${role}`,
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                };
            },
        }),
    }),
});

export const { useDeleteRoleMutation } = deleteRoleSlice;
