import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
    reducerPath: "authapi",
    tagTypes: ["user"],
    endpoints: (build) => ({
        getUsers: build.query({
            query: () => `/api/auth/all-users`,

        }),
        loginUser: build.mutation({
            query: (payload) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: payload,
                headers: {
                },
            })
        }),
    })
})
export const { useGetUsersQuery,useLoginUserMutation } = api;