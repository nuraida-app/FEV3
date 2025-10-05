import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiRecap = createApi({
  reducerPath: "ApiRecap",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/recap",
    credentials: "include",
  }),
  tagTypes: ["recap"],
  endpoints: (builder) => ({
    getChapterRecap: builder.query({
      query: ({ classid, chapterid, month, search, page, limit }) => ({
        url: "/chapter-final-score",
        method: "GET",
        params: { classid, chapterid, month, search, page, limit },
      }),
      providesTags: ["reports"],
    }),
  }),
});

export const { useGetChapterRecapQuery } = ApiRecap;
