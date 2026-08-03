import { NextResponse } from "next/server";
import { requireProfile } from "@/libs/auth";
import { createThread, listThreads } from "@/libs/forum";

export async function GET() {
  try {
    const threads = await listThreads();
    return NextResponse.json(threads);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const profile = await requireProfile();

    if (!profile) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const content = typeof data.content === "string" ? data.content.trim() : "";

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { message: "Title must be 200 characters or less" },
        { status: 400 }
      );
    }

    const thread = await createThread({
      title,
      content,
      authorId: profile.id,
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
