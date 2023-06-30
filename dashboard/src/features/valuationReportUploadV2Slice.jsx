import { apiSlice } from "./apiSlice"

export const valuationReportUploadV2Slice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        uploadValuationReportV2: builder.mutation({
            query: (formData) => ({
                url: '/api/uploader/upload-valuation-report-v2',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
        }),
    })
})

export const {
    useUploadValuationReportV2Mutation
} = valuationReportUploadV2Slice