"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

interface Props {
  id: string;
  className?: string;
}

export default function DeletePostButton({ id, className = "" }: Props) {
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
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to delete a post.");

      const token = await user.getIdToken();

      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete post.");
      }

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
