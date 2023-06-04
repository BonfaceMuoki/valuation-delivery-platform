import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const accessorsFirmUsersSlliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getAccesorFirmUsers: builder.query({
            query: (firm) => ({
                url: `/api/commons/get-accesors-users-list/${firm}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})


export const {
    useGetAccesorFirmUsersQuery
} = accessorsFirmUsersSlliceApi ;