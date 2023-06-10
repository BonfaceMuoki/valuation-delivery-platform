import { apiSlice } from "./apiSlice"

export const updateAccesorPersonalInfoSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateAccesorPersonalInfo: builder.mutation({
            query: (formData) => {
                console.log(formData);
                // console.log(userid);
                // const trimeedid = userid.toString().trim();
            return {
                url: `/api/accesor/update-personal-information`,
                method: 'POST',
                body: formData,
                headers: {
                    "Accept": "application/json",
                  }          
            }
        }
        }),
    })
})

export const {
    useUpdateAccesorPersonalInfoMutation
} = updateAccesorPersonalInfoSlice