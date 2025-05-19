// store/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "@/lib/firebase";
import { PostInput } from "@/lib/zodSchemas";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Post } from "./postsSlice";
import { getAuth } from "firebase/auth";

export const createPost = createAsyncThunk(
  "posts/create",
  async (data: PostInput) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User is not authorized.");

    const docRef = await addDoc(collection(db, "posts"), {
      ...data,
      uid: user.uid,
      author: user.displayName ?? "Anonymous",
      createdAt: serverTimestamp(), // timestamp у Firestore
    });

    return {
      id: docRef.id,
      ...data,
      uid: user.uid,
      author: user.displayName ?? "Anonymous",
      createdAt: Date.now(),
    } as Post;
  }
);
