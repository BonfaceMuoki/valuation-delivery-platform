import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
export const api = createApi({
    baseQuery:fetchBaseQuery(""),
    reducerPath:"authapi",
    tagTypes:["uaser"],
    endpoints: (build)=>({
        getUsers: build.query({
             query: ()=>`user/all`,
        })
    })
})