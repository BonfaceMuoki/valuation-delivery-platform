import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const valuationReportsApiSlice = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuationReports: builder.query({
            query: () => ({
                url: `/api/commons/get-reports-list`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetValuationReportsQuery
} = valuationReportsApiSlice ;