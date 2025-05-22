"use client";
import { useAuth } from "@/hooks/useAuth";
import PostForm from "./PostForm";

export default function AuthenticatedPostForm() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return <PostForm />;
}
