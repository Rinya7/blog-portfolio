// app/posts/[id]/page.tsx

import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePostButton";
import CommentsList from "@/components/CommentsList";
import CommentsForm from "@/components/CommentsForm";

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
  let loadError: string | null = null;

  try {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) {
      loadError = "Пост не знайден або видален";
    } else {
      const data = snap.data() as { title: string; content: string };
      title = data.title;
      content = data.content;
    }
  } catch (err) {
    console.error(`Error loading post ${id}:`, err);
    loadError = "Не вдалося завантажити пост";
  }

  if (loadError) {
    return (
      <main className="container mx-auto p-6 text-center">
        <p className="text-red-500 mb-6">{loadError}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          На головну
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <Link href="/" className="  text-white  ">
        ← до постів
      </Link>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Шапка карточки */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
            <Link
              href={`/posts/${id}/edit`}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition text-center"
            >
              Редагувати
            </Link>
            <DeletePostButton
              id={id}
              className="w-full sm:w-auto text-center"
            />
          </div>
        </header>
        {/* Контент */}
        <article className="prose prose-lg dark:prose-invert px-6 py-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        </article>
        <section className="px-6 pb-8 space-y-6">
          <h2 className="text-2xl font-semibold">Коментарії</h2>
          <CommentsList postId={id} />
          <CommentsForm postId={id} />
        </section>
      </div>
    </main>
  );
}
