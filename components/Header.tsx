"use client";

import { useUser } from "@/context/UserContext"; // или используешь хук useAuth напрямую
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function Header() {
  const { user, loading } = useUser();

  if (loading) return null;

  return (
    <header className="container mx-auto p-6 space-y-8        ">
      {user ? (
        <div className="max-w-2xl mx-auto flex justify-between items-center ">
          <span>👋 Greetings, {user.displayName || "Користувач"}</span>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Log out
          </button>
        </div>
      ) : (
        <span>Please log in</span>
      )}
    </header>
  );
}
