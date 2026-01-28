import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BlogState,
  DeleteBlogPayload,
  FetchBlogResponse,
  FetchBlogsResponse,
  UpdateBlogPayload,
} from "./blogType";
import { Blog } from "@/lib/models/BlogModel";

export const initialBlogState: BlogState = {
  blogs: null,
  blog: null,
  loading: false,
  error: null,
};

export const BlogSlice = createSlice({
  name: "blog",
  initialState: initialBlogState,
  reducers: {
    setBlogList: (state, action: PayloadAction<FetchBlogsResponse>) => {
      state.blogs = action.payload.blogs;
    },

    setBlog: (state, action: PayloadAction<FetchBlogResponse>) => {
      state.blog = action.payload.blog;
    },

    addBlog: (state, action: PayloadAction<Blog>) => {
      if (state.blogs) {
        state.blogs.push(action.payload);
      } else {
        state.blogs = [action.payload];
      }
    },

    updateBlog: (state, action: PayloadAction<UpdateBlogPayload>) => {
      if (!state.blogs) return;
      const index = state.blogs.findIndex(
        (blog) => blog.slug === action.payload.slug,
      );
      if (index !== -1) {
        state.blogs[index] = { ...state.blogs[index], ...action.payload };
      }
    },

    deleteBlog: (state, action: PayloadAction<DeleteBlogPayload>) => {
      if (!state.blogs) return;
      state.blogs = state.blogs.filter(
        (blog) => blog.slug !== action.payload.slug,
      );
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBlogList,
  setBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  setLoading,
  setError,
} = BlogSlice.actions;

export default BlogSlice.reducer;
