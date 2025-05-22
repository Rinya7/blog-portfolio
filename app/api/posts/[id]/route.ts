import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { PostInputSchema } from "@/lib/zodSchemas";
import { verifyFirebaseToken } from "@/lib/auth";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * GET /api/posts/:id
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "ID not specified" },
        { status: 400 }
      );
    }

    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const { title, content, authorId, author, createdAt } = snap.data() as {
      title: string;
      content: string;
      authorId: string;
      author?: string;
      createdAt?: Timestamp;
    };

    return NextResponse.json({
      id: snap.id,
      title,
      content,
      authorId,
      author,
      createdAt: createdAt?.toMillis?.() ?? null,
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/posts/:id
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "ID not specified" },
        { status: 400 }
      );
    }

    // Проверка токена
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const user = await verifyFirebaseToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Проверяем, что пост существует
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Проверяем, что автор совпадает с пользователем
    const postData = snap.data();
    if (postData.authorId !== user.uid) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Валидация входных данных
    const body = await req.json();
    const parsed = PostInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    // Обновляем пост
    await updateDoc(ref, parsed.data);

    return NextResponse.json({ id, ...parsed.data });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "ID not specified" },
        { status: 400 }
      );
    }

    // Проверка токена
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const user = await verifyFirebaseToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Проверяем, что пост существует
    const ref = doc(db, "posts", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Проверяем, что автор совпадает с пользователем
    const postData = snap.data();
    if (postData.authorId !== user.uid) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Удаляем пост
    await deleteDoc(ref);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
