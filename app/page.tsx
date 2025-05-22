import AuthenticatedPostForm from "@/components/AuthenticatedPostForm";
import PostList from "@/components/PostList";

export default function HomePage() {
  return (
    <div className=" ">
      <h1 className="max-w-2xl mx-auto text-4xl font-bold text-center">
        My blog
      </h1>

      <AuthenticatedPostForm />

      <PostList />
    </div>
  );
}
