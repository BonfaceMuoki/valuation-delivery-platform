import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const valuationReportsApiSlice = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuationReports: builder.query({
            query: () => `/api/commons/get-reports-list`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        })
    })
})

export const {
    useGetValuationReportsQuery
} = valuationReportsApiSlice ;