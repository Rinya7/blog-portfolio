// app/page.tsx
import { PostForm } from "../components/PostForm";
import { PostList } from "../components/PostList";

export default function HomePage() {
  return (
    <main className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center">Мій блог</h1>
      <PostForm />
      <PostList />
    </main>
  );
}
