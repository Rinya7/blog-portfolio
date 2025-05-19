// components/withAuth.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { JSX } from "react";

export function withAuth<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
      }
    }, [loading, user]);

    if (!user) return <div>Checking authentication...</div>;

    return <Component {...props} />;
  };
}
