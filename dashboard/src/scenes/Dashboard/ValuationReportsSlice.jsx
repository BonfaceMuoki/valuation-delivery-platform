import { apiSlice } from "features/apiSlice"

export const valuationReportsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getValuationReports: builder.query({
            query: (page) => `/api/commons/get-reports-list?page=${page}`,
            keepUnusedDataFor: 5,
        })
    })
})

export const {
    useGetValuationReportsQuery
} = valuationReportsApiSlice ;