// app/posts/[id]/edit/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import { db } from "@/lib/firebase";
import EditPostForm from "@/components/EditPostForm";
import Link from "next/link";

interface AsyncParams {
  params: Promise<{ id: string }>;
}

// Метаданные для вкладки
export async function generateMetadata({
  params,
}: AsyncParams): Promise<Metadata> {
  const { id } = await params;
  const snap = await getDoc(doc(db, "posts", id));
  return {
    title: snap.exists()
      ? `Редагувати: ${snap.data().title}`
      : "Пост не знайден",
  };
}

export default async function EditPostPage({ params }: AsyncParams) {
  const { id } = await params;
  const snap = await getDoc(doc(db, "posts", id));

  if (!snap.exists()) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-2xl text-red-600">Пост не знайден</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600">
          На головну
        </Link>
      </main>
    );
  }

  // Передаём в форму текущие title и content
  const data = snap.data() as { title: string; content: string };

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Редагувати пост</h1>
      {/*Клиентская форма  @ts-expect-error Async Server Component */}
      <EditPostForm
        id={id}
        initialTitle={data.title}
        initialContent={data.content}
      />
    </main>
  );
}
