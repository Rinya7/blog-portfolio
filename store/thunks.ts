import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostInput } from "@/lib/zodSchemas";
import { auth } from "@/lib/firebase";
import { Post } from "./postsSlice";

// Create Post
export const createPost = createAsyncThunk<
  Post,
  PostInput,
  { rejectValue: string }
>("posts/create", async (data, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authorized");

    const token = await user.getIdToken();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      return rejectWithValue(errData.message || "Failed to create post");
    }

    const result = (await res.json()) as Post;
    return result;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});

// Update Post
export const updatePost = createAsyncThunk<
  Post,
  { id: string; data: PostInput },
  { rejectValue: string }
>("posts/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authorized");

    const token = await user.getIdToken();

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      return rejectWithValue(errData.message || "Failed to update post");
    }

    return (await res.json()) as Post;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});

// Delete Post
export const deletePost = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("posts/delete", async (id, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not authorized");

    const token = await user.getIdToken();

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json();
      return rejectWithValue(errData.message || "Failed to delete post");
    }

    return id;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue("Unknown error");
  }
});
