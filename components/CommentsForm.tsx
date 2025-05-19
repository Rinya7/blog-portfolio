// components/CommentsForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentInput, CommentSchema } from "@/lib/zodSchemas";
import { useRouter } from "next/navigation";

export default function CommentsForm({ postId }: { postId: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentInput>({ resolver: zodResolver(CommentSchema) });

  const onSubmit = async (data: CommentInput) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    reset();
    router.refresh(); // we update the server part (CommentsList)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register("author")}
          placeholder="Ваше ім'я"
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
        />
        {errors.author && (
          <p className="text-red-600">{errors.author.message}</p>
        )}
      </div>
      <div>
        <textarea
          {...register("text")}
          placeholder="Ваш коментарій"
          rows={3}
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
        />
        {errors.text && <p className="text-red-600">{errors.text.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
      >
        {isSubmitting ? "Saving..." : "Submit comment"}
      </button>
    </form>
  );
}
