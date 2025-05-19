// store/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import { PostInput } from "@/lib/zodSchemas";
import { addDoc, collection } from "firebase/firestore";
import { Post } from "./postsSlice";

export const createPost = createAsyncThunk(
  "posts/create",
  async (data: PostInput) => {
    const ref = await addDoc(collection(db, "posts"), data);
    return { id: ref.id, ...data } as Post;
  }
);
