import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const retrieveValuerInviteSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuerInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-valuer-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetValuerInviteDetailsQuery
} = retrieveValuerInviteSliceApi ;