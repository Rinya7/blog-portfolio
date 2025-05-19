// app/posts/[id]/error.tsx
"use client";

import { useEffect } from "react";

export default function PostError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Post page error:", error);
  }, [error]);

  return (
    <main className="container mx-auto p-6 text-center">
      <h1 className="text-red-500 text-2xl font-bold mb-4">Сталася помилка</h1>
      <p className="text-gray-600">
        Не вдалося завантажити пост. Спробуйте пізніше.
      </p>
    </main>
  );
}
