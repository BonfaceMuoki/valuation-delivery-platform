import { apiSlice } from "./apiSlice";

export const getUserDetailsSlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        getUserDetails: bulder.query({
            query: (userid) => ({
                url: `/api/auth/user-information?user_id=${userid}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useGetUserDetailsQuery } = getUserDetailsSlice;

