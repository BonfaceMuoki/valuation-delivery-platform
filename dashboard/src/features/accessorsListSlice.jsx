import { apiSlice } from "./apiSlice";
import { useSelector } from "react-redux";

export const accessorsListSlice = apiSlice.injectEndpoints({   
    endpoints: builder => ({
        getAccesorsList: builder.query({
            query: () => `/api/commons/get-accesors-list`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        })
    })
})

export const {
    useGetAccesorsListQuery
} = accessorsListSlice ;