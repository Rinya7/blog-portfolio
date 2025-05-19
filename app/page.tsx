"use client";
import { auth } from "@/lib/firebase";
import { AuthButton } from "@/components/AuthButton";
import { PostForm } from "@/components/PostForm";
import { PostList } from "@/components/PostList";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <main className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center">My blog</h1>

      {!user && (
        <div className="text-center space-y-2">
          <p className="text-red-500 text-sm">
            You must be logged in to create a post.
          </p>
          <AuthButton />
        </div>
      )}

      {user && (
        <>
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              👋 Greetings, {user.displayName || "Користувач"}
            </span>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Log out
            </button>
          </div>
          <PostForm />
        </>
      )}

      <PostList />
    </main>
  );
}
