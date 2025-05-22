"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import DeletePostButton from "./DeletePostButton";

interface Props {
  postId: string;
  authorId: string;
}

export default function PostActions({ postId, authorId }: Props) {
  const { user } = useAuth();

  if (!user || user.uid !== authorId) return null;

  return (
    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
      <Link
        href={`/posts/${postId}/edit`}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition text-center"
      >
        Edit
      </Link>
      <DeletePostButton id={postId} className="w-full sm:w-auto text-center" />
    </div>
  );
}
