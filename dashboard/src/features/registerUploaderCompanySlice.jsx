import { apiSlice } from "./apiSlice";

export const registerUploaderCompanySlice = apiSlice.injectEndpoints({
    endpoints: bulder => ({
        registerUploaderUser: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-valuer-user`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        registerUploader: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/register`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestUploaderAccess: bulder.mutation({
            query: (formData) => ({
                url: `/api/auth/request-valuer-access`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
    })
})

export const { useRegisterUploaderUserMutation,useRegisterUploaderMutation,useRequestUploaderAccessMutation} = registerUploaderCompanySlice;

