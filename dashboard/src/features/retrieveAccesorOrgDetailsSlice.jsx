import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const retrieveAccesorOrgDEtailsSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getAccesorOrgDetailsDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/accesor/retrieve-accesor-org-details`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAccesorOrgDetailsDetailsQuery
} = retrieveAccesorOrgDEtailsSliceApi ;