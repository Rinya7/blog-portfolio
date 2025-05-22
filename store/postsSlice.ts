import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createPost, updatePost, deletePost } from "./thunks";

// Post model
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: string;
  createdAt?: number;
}

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all posts via API
export const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {
  const res = await fetch("/api/posts");

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts = await res.json();
  return posts as Post[];
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.error.message ?? "Download error";
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;
export { createPost, updatePost, deletePost };
