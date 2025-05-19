// app/login/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, redirectPath, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Sign in to continue</h1>
      <AuthButton />
    </main>
  );
}
