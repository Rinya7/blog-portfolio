// components/ClientSideAuthCheck.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  authorId: string;
  children: React.ReactNode;
}

export default function ClientSideAuthCheck({ authorId, children }: Props) {
  const { user, loading } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.uid !== authorId) {
        setUnauthorized(true);
        setTimeout(() => router.push("/"), 1500);
      }
    }
  }, [user, loading, authorId, router]);

  if (loading) return null;
  if (unauthorized)
    return (
      <p className="text-red-600 text-center mt-4">
        You are not allowed to edit this post.
      </p>
    );

  return <>{children}</>;
}
