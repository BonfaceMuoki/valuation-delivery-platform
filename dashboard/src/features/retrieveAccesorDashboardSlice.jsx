import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const retrieveAccesorDashboardSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getAccesorDashboardDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/accesor/get-dashboard`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAccesorDashboardDetailsQuery
} = retrieveAccesorDashboardSliceApi ;