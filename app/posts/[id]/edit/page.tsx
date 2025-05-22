// app/posts/[id]/edit/page.tsx
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import { db } from "@/lib/firebase";
import EditPostForm from "@/components/EditPostForm";
import Link from "next/link";
import ClientSideAuthCheck from "@/components/ClientSideAuthCheck";

interface AsyncParams {
  params: Promise<{ id: string }>;
}

// Tab metadata
export async function generateMetadata({
  params,
}: AsyncParams): Promise<Metadata> {
  const { id } = await params;
  const snap = await getDoc(doc(db, "posts", id));
  return {
    title: snap.exists() ? `Edit: ${snap.data().title}` : "Post not found",
  };
}

export default async function EditPostPage({ params }: AsyncParams) {
  const { id } = await params;
  const snap = await getDoc(doc(db, "posts", id));

  if (!snap.exists()) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-2xl text-red-600">Post not found</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600">
          To the main page
        </Link>
      </main>
    );
  }

  // We transfer the current title and content to the form
  const data = snap.data() as {
    title: string;
    content: string;
    authorId: string;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit post</h1>
      <ClientSideAuthCheck authorId={data.authorId}>
        {/*Client form  @ts-expect-error Async Server Component */}
        <EditPostForm
          id={id}
          initialTitle={data.title}
          initialContent={data.content}
        />
      </ClientSideAuthCheck>
    </div>
  );
}
