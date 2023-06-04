import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const downloadvaluationReportsApiSlice = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getDownloadValuationReports: builder.query({
            query: () => `/api/commons/get-reports-list`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        })
    })
})

export const {useGetDownloadValuationReportsQuery} = downloadvaluationReportsApiSlice ;