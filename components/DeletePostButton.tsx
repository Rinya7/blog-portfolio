// components/DeletePostButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { deletePost } from "@/store/postsSlice";

interface Props {
  id: string;
  className?: string;
}

export default function DeletePostButton({ id, className = "" }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete this post permanently?")
    )
      return;
    setLoading(true);
    setError(null);
    try {
      await dispatch(deletePost(id)).unwrap();
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error while deleting";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className={`
          px-4 py-2 
          ${loading ? "opacity-50" : ""} 
          bg-red-600 hover:bg-red-700 
          text-white rounded-lg transition
          ${className}
        `}
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
    </>
  );
}
