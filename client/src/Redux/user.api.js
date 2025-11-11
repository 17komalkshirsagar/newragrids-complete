import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/auth`, }),

    tagTypes: ["User"],
    endpoints: (builder) => ({

        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/user/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "User registration failed!";
            },
        }),

        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/user/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "Invalid login credentials!";
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "/user/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                localStorage.removeItem("user");
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "Logout failed!";
            },
        }),

        uploadFile: builder.mutation({
            query: ({ userId, file }) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: `/upload/${userId}`, // ✅ backtick fixed
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["User"],
            transformResponse: (data) => data,
            transformErrorResponse: (error) => {
                return error?.data?.message || "File upload failed!";
            },
        }),

        getCustomers: builder.query({
            query: () => "/customers",
            providesTags: ["User"],
            transformResponse: (data) => data?.result || data,
            transformErrorResponse: (error) => {
                return error?.data?.message || "Failed to fetch customers!";
            },
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useUploadFileMutation,
    useGetCustomersQuery,
} = userApi;
