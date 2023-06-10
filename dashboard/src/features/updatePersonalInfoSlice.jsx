import { apiSlice } from "./apiSlice"

export const updatePersonalInfoSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updatePersonalInfo: builder.mutation({
            query: (formData) => {
                console.log(formData);
                // console.log(userid);
                // const trimeedid = userid.toString().trim();
            return {
                url: `/api/uploader/update-personal-information`,
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
    useUpdatePersonalInfoMutation
} = updatePersonalInfoSlice