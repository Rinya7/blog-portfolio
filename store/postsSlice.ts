// store/postsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { PostInput } from "@/lib/zodSchemas";
import { createPost } from "./thunks";

// Интерфейс поста
export interface Post {
  id: string;
  title: string;
  content: string;
  uid: string;
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

// Loading all posts
export const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {
  return (await getDocs(collection(db, "posts"))).docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      // Transforming createdAt → number (timestamp), if there is
      createdAt: data.createdAt?.toMillis?.() ?? null,
    } as Post;
  });
});

// Post update
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, data }: { id: string; data: PostInput }) => {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, data);
    return { id, ...data } as Post;
  }
);

// Deleting a post
export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id: string) => {
    await deleteDoc(doc(db, "posts", id));
    return id;
  }
);

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
export { createPost };
