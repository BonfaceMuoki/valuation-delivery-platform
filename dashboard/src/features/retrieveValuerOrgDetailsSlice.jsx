import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const retrieveValuerOrgDEtailsSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuerOrgDetailsDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/uploader/retrieve-valuer-org-details`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetValuerOrgDetailsDetailsQuery
} = retrieveValuerOrgDEtailsSliceApi ;