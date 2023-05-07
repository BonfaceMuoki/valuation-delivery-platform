import { apiSlice } from "./apiSlice"

export const valuationReportUploadSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        uploadValuationReport: builder.mutation({
            query: (formData) => ({
                url: '/api/uploader/upload-valuation-report',
                method: 'POST',
                body: formData            
            })
        }),
    })
})

export const {
    useUploadValuationReportMutation
} = valuationReportUploadSlice