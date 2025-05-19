// app/api/posts/[id]/comments/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { CommentSchema } from "@/lib/zodSchemas";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";

type AsyncParams = { params: Promise<{ id: string }> };

type CommentData = {
  author: string;
  text: string;
  createdAt: Timestamp;
};

/** GET /api/posts/:id/comments */
export async function GET(_request: Request, { params }: AsyncParams) {
  const { id } = await params;
  try {
    const commentsRef = collection(db, "posts", id, "comments");
    const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
    const snap = await getDocs(commentsQuery);

    const comments = snap.docs.map((doc) => {
      const data = doc.data() as CommentData;
      return {
        id: doc.id,
        author: data.author,
        text: data.text,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET comments error:", error);
    return NextResponse.json(
      { message: "Could not load comment." },
      { status: 500 }
    );
  }
}

/** POST /api/posts/:id/comments */
export async function POST(request: Request, { params }: AsyncParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = CommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const ref = await addDoc(collection(db, "posts", id, "comments"), {
      author: parsed.data.author,
      text: parsed.data.text,
      createdAt: serverTimestamp(),
    });
    return NextResponse.json(
      { id: ref.id, author: parsed.data.author, text: parsed.data.text },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST comments error:", error);
    return NextResponse.json(
      { message: "Could not load comment." },
      { status: 500 }
    );
  }
}
