"use client";
import { useAuth } from "@/hooks/useAuth";
import { PostForm } from "./PostForm";
import { PostList } from "./PostList";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <main className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center">My Blog</h1>

      {/* Only if authorized - we show the form */}
      {user ? (
        <PostForm />
      ) : !loading ? (
        <div className="text-center text-sm text-red-500">
          You need to sign in to create a post.
        </div>
      ) : null}

      {/* Posts are visible to everyone */}
      <PostList />
    </main>
  );
}
