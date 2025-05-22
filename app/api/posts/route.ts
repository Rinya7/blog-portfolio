import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { PostInputSchema } from "@/lib/zodSchemas";
import { verifyFirebaseToken } from "@/lib/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "posts"));

    // Маппим документы в массив постов, фильтруем пустые
    const posts = snap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        const authorId = data.authorId ?? data.uid;
        if (!authorId) return null;

        return {
          id: docSnap.id,
          title: data.title,
          content: data.content,
          authorId,
          author: data.author ?? "Anonymous",
          createdAt: data.createdAt?.toMillis?.() ?? null,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию через Firebase ID токен
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const user = await verifyFirebaseToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Получаем и валидируем тело запроса через Zod схему
    const body = await req.json();
    const parsed = PostInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    // Создаем новый документ в Firestore с текущим временем
    const docRef = await addDoc(collection(db, "posts"), {
      ...parsed.data,
      authorId: user.uid,
      author: user.name ?? "Anonymous",
      createdAt: serverTimestamp(),
    });

    // Возвращаем созданный пост с id
    return NextResponse.json({
      id: docRef.id,
      ...parsed.data,
      authorId: user.uid,
      author: user.name ?? "Anonymous",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("POST /api/posts error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
