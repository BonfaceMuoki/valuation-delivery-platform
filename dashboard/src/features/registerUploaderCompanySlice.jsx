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
        requestUploaderRegistrationStatus: bulder.query({
            query: (request) => ({
                url: `/api/admin/get-Valuer-request-registration-status?req=${request}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        archiveUploaderRegistrationRequest: bulder.mutation({
            query: (formdata) => ({
                url: `/api/admin/archive-valuer-registration-request`,
                method: 'POST',
                body:formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
    })
})

export const {useArchiveUploaderRegistrationRequestMutation,useRegisterUploaderUserMutation,useRegisterUploaderMutation,useRequestUploaderAccessMutation,useRequestUploaderRegistrationStatusQuery} = registerUploaderCompanySlice;

