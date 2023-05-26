import { apiSlice } from "features/apiSlice"
import { useSelector } from "react-redux";

export const usersSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: `/api/commons/get-all-users`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetUsersQuery
} = usersSliceApi ;