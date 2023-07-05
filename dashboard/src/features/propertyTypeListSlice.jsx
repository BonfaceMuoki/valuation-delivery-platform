import { apiSlice } from "./apiSlice";
import { useSelector } from "react-redux";

export const propertyTypeListSlice = apiSlice.injectEndpoints({   
    endpoints: builder => ({
        getPropertyTypeList: builder.query({
            query: () => `/api/commons/get-all-propertytypes`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        })
    })
})

export const {
    useGetPropertyTypeListQuery
} = propertyTypeListSlice ;