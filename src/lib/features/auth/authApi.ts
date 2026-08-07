import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getSession: builder.query<any, void>({
      query: () => "/session",
    }),
  }),
});

export const { useGetSessionQuery } = authApi;
