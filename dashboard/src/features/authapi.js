import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
export const api = createApi({
    baseQuery:fetchBaseQuery({baseUrl: "http://localhost:8000"}),
    reducerPath:"authapi",
    tagTypes:["uaser"],
    endpoints: (build)=>({
        getUsers: build.query({
             query: ()=>`/api/auth/all-users`,
              
        })
    })
})
export const { useGetUsersQuery } = api;