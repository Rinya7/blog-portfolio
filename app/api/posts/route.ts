// app/api/posts/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { PostInputSchema } from "@/lib/zodSchemas";
import { collection, getDocs, addDoc } from "firebase/firestore";

interface Post {
  id: string;
  title: string;
  content: string;
}

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "posts"));
    const posts: Post[] = snap.docs.map((d) => {
      const data = d.data() as { title: string; content: string };
      return { id: d.id, title: data.title, content: data.content };
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { message: "Не вдалося завантажити список постів" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = PostInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const ref = await addDoc(collection(db, "posts"), parsed.data);
    return NextResponse.json({ id: ref.id, ...parsed.data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { message: "Не вдалося створити пост" },
      { status: 500 }
    );
  }
}
