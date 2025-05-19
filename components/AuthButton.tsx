// components/AuthButton.tsx
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
const provider = new GoogleAuthProvider();

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
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
    );
  }

  return (
    <button
      onClick={async () => {
        try {
          await signInWithPopup(auth, provider);
        } catch (err: any) {
          console.warn("Login canceled or failed", err.message);
        }
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  );
}
