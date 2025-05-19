// app/posts/[id]/edit/error.tsx
"use client";

import { useEffect } from "react";

export default function EditError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Edit post error:", error);
  }, [error]);

  return (
    <main className="container mx-auto py-10 text-center">
      <h1 className="text-red-600 text-2xl font-bold mb-4">
        Помилка редагування
      </h1>
      <p className="text-gray-600">
        Не вдалося завантажити пост для редагування.
      </p>
    </main>
  );
}
