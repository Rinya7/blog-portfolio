// app/posts/[id]/page.tsx

import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentsList from "@/components/CommentsList";
import CommentsForm from "@/components/CommentsForm";
import PostActionsWrapper from "@/components/PostActionsWrapper";

interface AsyncParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AsyncParams): Promise<Metadata> {
  const { id } = await params;
  try {
    const snap = await getDoc(doc(db, "posts", id));
    return snap.exists()
      ? { title: snap.data().title as string }
      : { title: "Пост не знайден" };
  } catch {
    return { title: "Помилка завантаження" };
  }
}

export default async function PostPage({ params }: AsyncParams) {
  const { id } = await params;
  let title = "";
  let content = "";
  let authorId = "";

  try {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) {
      notFound();
    }
    const data = snap.data() as {
      title: string;
      content: string;
      authorId: string;
    };
    title = data.title;
    content = data.content;
    authorId = data.authorId;
  } catch (err) {
    console.error(`Error loading post ${id}:`, err);
    throw new Error("Failed to load post");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="  text-gray-900 dark:text-white ">
        ← to posts
      </Link>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Card cap */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center  md:px-8">
            {title}
          </h1>

          <PostActionsWrapper postId={id} authorId={authorId} />
        </header>
        {/* Content */}
        <article className="prose prose-lg dark:prose-invert px-6 py-8">
          <p className="content text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        </article>
        <section className="px-6 pb-8 space-y-6">
          <h2 className="text-2xl font-semibold text-yellow-200">Comments</h2>
          <CommentsList postId={id} />
          <CommentsForm postId={id} />
        </section>
      </div>
    </div>
  );
}
