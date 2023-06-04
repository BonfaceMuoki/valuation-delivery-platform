import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const retrieveAccesorInviteSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getAccesorInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-accesor-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAccesorInviteDetailsQuery
} = retrieveAccesorInviteSliceApi ;