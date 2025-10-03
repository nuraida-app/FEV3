import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ApiSubject = createApi({
  reducerPath: "ApiSubject",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/subject",
    credentials: "include",
  }),
  tagTypes: ["Subjects", "category", "branch"],
  endpoints: (builder) => ({
    getSubject: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/get-subjects`,
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Subjects"],
    }),
    addSubject: builder.mutation({
      query: (body) => ({
        url: "/add-subject",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subjects"],
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/delete-subject`,
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: ["Subjects"],
    }),
    uploadSubjects: builder.mutation({
      query: (body) => ({
        url: "/upload-subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subjects"],
    }),

    // Category
    getCategories: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/get-categories",
        params: { page, limit, search },
        method: "GET",
      }),
      providesTags: ["category"],
    }),
    saveCategory: builder.mutation({
      query: (body) => ({
        url: "/add-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["category"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: "/delete-category",
        params: { id },
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),

    // Branch
    getBranches: builder.query({
      query: ({ page, limit, search }) => ({
        url: "/get-branches",
        params: { page, limit, search },
        method: "GET",
      }),
      providesTags: ["branch"],
    }),
    saveBranch: builder.mutation({
      query: (body) => ({
        url: "/add-branch",
        method: "POST",
        body,
      }),
      invalidatesTags: ["branch"],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: "/delete-branch",
        params: { id },
        method: "DELETE",
      }),
      invalidatesTags: ["branch"],
    }),
  }),
});

export const {
  useGetSubjectQuery,
  useAddSubjectMutation,
  useDeleteSubjectMutation,
  useUploadSubjectsMutation,
  useGetCategoriesQuery,
  useSaveCategoryMutation,
  useDeleteCategoryMutation,
  useGetBranchesQuery,
  useSaveBranchMutation,
  useDeleteBranchMutation,
} = ApiSubject;
