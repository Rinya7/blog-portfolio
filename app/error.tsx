// app/error.tsx
"use client";

import { useEffect } from "react";

export default function RootError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("App root error:", error);
  }, [error]);

  return (
    <main className="container mx-auto py-10 text-center">
      <h1 className="text-red-600 text-2xl font-bold mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-gray-600">Please try again later.</p>
    </main>
  );
}
