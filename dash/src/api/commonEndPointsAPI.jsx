import { apiSlice } from "../featuers/apiSlice";
import { useSelector } from "react-redux";


export const CommonEnpointsApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: `/api/commons/get-all-users`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        getAccesorsList: builder.query({
            query: () => `/api/commons/get-accesors-list`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        }),
        getPropertyTypeList: builder.query({
            query: () => `/api/commons/get-all-propertytypes`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        }),
        uploadValuationReportV2: builder.mutation({
            query: (formData) => ({
                url: '/api/uploader/upload-valuation-report-v2',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
        })
    })
})

export const {
    useGetUsersQuery,
    useGetAccesorsListQuery,
    useGetPropertyTypeListQuery,
    useUploadValuationReportV2Mutation
} = CommonEnpointsApi ;