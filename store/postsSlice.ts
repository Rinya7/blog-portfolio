// store/postsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  //  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { PostInput } from "../lib/zodSchemas";
import { createPost } from "./thunks";

// Интерфейс одного поста
export interface Post {
  id: string;
  title: string;
  content: string;
}

// Состояние слайса
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

/**
 * Загрузка всех постов из Firestore
 */
export const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {
  const snap = await getDocs(collection(db, "posts"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Post, "id">),
  })) as Post[];
});

/**
 * Создание нового поста
 */
//export const createPost = createAsyncThunk(
//  "posts/create",
//  async (data: PostInput) => {
//    const ref = await addDoc(collection(db, "posts"), data);
//    return { id: ref.id, ...data } as Post;
//  }
//);

/**
 * Обновление существующего поста
 */
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, data }: { id: string; data: PostInput }) => {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, data);
    return { id, ...data } as Post;
  }
);

/**
 * Видалення поста
 */
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
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.error.message ?? "Ошибка загрузки";
        state.loading = false;
      })
      // createPost
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // updatePost
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;
export { createPost };
