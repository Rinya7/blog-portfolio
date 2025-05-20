// components/PostForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostInput, PostInputSchema } from "@/lib/zodSchemas";
import { useAppDispatch, useAppSelector } from "@/store";
//import { createPost } from "@/store/postsSlice";
import { createPost } from "../store/thunks";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function PostForm() {
  const dispatch = useAppDispatch();
  const { error: createError } = useAppSelector((s) => s.posts);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(PostInputSchema),
  });

  const onSubmit = async (data: PostInput) => {
    setLocalError(null);
    try {
      await dispatch(createPost(data));
      reset();
    } catch (err: unknown) {
      setLocalError(getErrorMessage(err) || "Error sending");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
    >
      <div className="px-6 py-4 border-b dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Create new Post
        </h2>
      </div>

      <div className="px-6 py-4 space-y-4">
        {(createError || localError) && (
          <p className="text-red-600">{localError ?? createError}</p>
        )}

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            {...register("title")}
            placeholder="Enter a title"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            {...register("content")}
            placeholder="Enter the post text"
            rows={6}
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.content && (
            <p className="mt-1 text-red-600">{errors.content.message}</p>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
