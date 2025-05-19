// app/posts/[id]/loading.tsx
export default function LoadingPost() {
  return (
    <main className="container mx-auto p-6 text-center">
      <p className="text-gray-500 text-lg animate-pulse">Loading post…</p>
    </main>
  );
}
