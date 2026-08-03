import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/", url.origin), {
    status: 302,
  });
}

export async function GET(request) {
  return POST(request);
}
