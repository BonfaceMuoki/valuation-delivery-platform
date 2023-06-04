import { apiSlice } from "./apiSlice";

export const updateRoleSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateRole: builder.mutation({
      query: ({ data, role }) => {
        console.log("Data:", data);
        console.log("Role:", role);
        return {
          url: `/api/admin/update-role/${role}`,
          method: "PATCH",
          body: data,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        };
      },
    }),
  }),
});

export const { useUpdateRoleMutation } = updateRoleSlice;
