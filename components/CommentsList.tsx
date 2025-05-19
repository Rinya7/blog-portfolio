// components/CommentsList.tsx
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function CommentsList({ postId }: { postId: string }) {
  // SSR: подгружаем комментарии
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  const comments = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as { author: string; text: string }),
  }));

  if (comments.length === 0) {
    return <p className="text-center text-gray-500">Пока нет комментариев</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {c.author}
          </p>
          <p className="text-gray-800 dark:text-gray-200">{c.text}</p>
        </li>
      ))}
    </ul>
  );
}
