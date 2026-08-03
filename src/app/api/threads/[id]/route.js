import { NextResponse } from "next/server";
import { getThreadById } from "@/libs/forum";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const threadId = Number(id);

    if (!Number.isInteger(threadId) || threadId < 1) {
      return NextResponse.json({ message: "Invalid thread id" }, { status: 400 });
    }

    const thread = await getThreadById(threadId);

    if (!thread) {
      return NextResponse.json({ message: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
