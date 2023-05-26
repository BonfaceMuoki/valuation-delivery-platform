import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const valuationFirmUsersSlliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuationFirmUsers: builder.query({
            query: (firm) => ({
                url: `/api/commons/get-uploaders-users-list/${firm}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetValuationFirmUsersQuery
} = valuationFirmUsersSlliceApi ;