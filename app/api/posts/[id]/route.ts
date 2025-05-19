import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { PostInputSchema } from "@/lib/zodSchemas";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * GET /api/posts/:id
 */
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
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

    const { title, content } = snap.data() as {
      title: string;
      content: string;
    };
    return NextResponse.json({ id: snap.id, title, content });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/posts/:id
 */
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { message: "ID not specified" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = PostInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }

    const ref = doc(db, "posts", id);
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
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { message: "ID not specified" },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "posts", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
