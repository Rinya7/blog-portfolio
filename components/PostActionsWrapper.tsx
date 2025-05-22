// components/PostActionsWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const PostActions = dynamic(() => import("./PostActions"));

export default function PostActionsWrapper({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  return <PostActions postId={postId} authorId={authorId} />;
}
