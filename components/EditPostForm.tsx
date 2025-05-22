"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostInput, PostInputSchema } from "@/lib/zodSchemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";

interface Props {
  id: string;
  initialTitle: string;
  initialContent: string;
}

export default function EditPostForm({
  id,
  initialTitle,
  initialContent,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(PostInputSchema),
    defaultValues: {
      title: initialTitle,
      content: initialContent,
    },
  });

  const onSubmit = async (data: PostInput) => {
    setError(null);
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to update a post.");

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
        const result = await res.json();
        throw new Error(result.message || "Failed to update post.");
      }

      router.push(`/posts/${id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          {...register("title")}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Content</label>
        <textarea
          {...register("content")}
          rows={8}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
          loading ? "opacity-50" : ""
        }`}
      >
        {loading ? "Updating…" : "Update Post"}
      </button>
    </form>
  );
}
