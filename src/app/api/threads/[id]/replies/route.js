import { NextResponse } from "next/server";
import { requireProfile } from "@/libs/auth";
import { createReply, threadExists } from "@/libs/forum";

export async function POST(request, { params }) {
  try {
    const profile = await requireProfile();

    if (!profile) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const threadId = Number(id);

    if (!Number.isInteger(threadId) || threadId < 1) {
      return NextResponse.json({ message: "Invalid thread id" }, { status: 400 });
    }

    if (!(await threadExists(threadId))) {
      return NextResponse.json({ message: "Thread not found" }, { status: 404 });
    }

    const data = await request.json();
    const content = typeof data.content === "string" ? data.content.trim() : "";

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const reply = await createReply({
      content,
      threadId,
      authorId: profile.id,
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
