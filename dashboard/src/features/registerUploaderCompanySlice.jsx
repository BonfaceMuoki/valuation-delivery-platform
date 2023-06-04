import { apiSlice } from "./apiSlice";

export const registerUploaderCompanySlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        registerUploader: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/register`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const { useRegisterUploaderMutation} = registerUploaderCompanySlice;

