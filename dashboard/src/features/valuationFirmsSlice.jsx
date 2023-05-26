import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const valuationFirmsSlliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuationFirms: builder.query({
            query: () => ({
                url: `/api/commons/get-uploaders-list`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetValuationFirmsQuery
} = valuationFirmsSlliceApi ;