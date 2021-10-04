import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type IPost = {
  userId: string;
  id: number;
  title: string;
  body: string;
};

// Define a service using a base URL and expected endpoints
export const placeholderApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<IPost[], void>({
      query: () => `posts`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsQuery } = placeholderApi;

// A mock function to mimic making an async request for data
export async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}
