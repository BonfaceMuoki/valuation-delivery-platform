import { apiSlice } from "./apiSlice"

export const updateAccesorCompanyInfoSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateAccesorCompanyInfo: builder.mutation({
            query: (formData) => {
                console.log(formData);
                // console.log(userid);
                // const trimeedid = userid.toString().trim();
            return {
                url: `/api/accesor/update-company-information`,
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
    useUpdateAccesorCompanyInfoMutation
} = updateAccesorCompanyInfoSlice