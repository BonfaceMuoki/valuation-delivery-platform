import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const accessorsFirmsSlliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getAccesorsFirms: builder.query({
            query: () => ({
                url: `/api/commons/get-accesors-list`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAccesorsFirmsQuery
} = accessorsFirmsSlliceApi ;