import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../scenes/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8001',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        console.log("Sending request");
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    console.log(result);
    if ((result?.error?.status === 403)||(result?.error?.status === 401)) {
        console.log('sending refresh token');
        // send refresh token to get new access token 
        const refreshResult = await baseQuery({
            url: `/api/auth/refresh`,
            method: `GET`, 
            headers: {
                'Accept': 'Application/json'
              }
          }, api, extraOptions)
        if (refreshResult?.data) {
            const user = api.getState().auth.user 
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})