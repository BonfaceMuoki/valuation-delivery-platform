import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const valuationReportsApiSlice = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuationReports: builder.query({
            query: (page) => `/api/commons/get-reports-list`
        })
    })
})

export const {
    useGetValuationReportsQuery
} = valuationReportsApiSlice ;