import { apiSlice } from "./apiSlice"

export const updateCompanyInfoSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateCompanyInfo: builder.mutation({
            query: (formData) => {
                console.log(formData);
                // console.log(userid);
                // const trimeedid = userid.toString().trim();
            return {
                url: `/api/uploader/update-company-information`,
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
    useUpdateCompanyInfoMutation
} = updateCompanyInfoSlice