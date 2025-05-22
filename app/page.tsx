import { PostForm } from "@/components/PostForm";
import { PostList } from "@/components/PostList";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className=" ">
      <h1 className="max-w-2xl mx-auto text-4xl font-bold text-center">
        My blog
      </h1>

      {user && (
        <>
          <PostForm />
        </>
      )}

      <PostList />
    </div>
  );
}
