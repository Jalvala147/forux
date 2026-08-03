import { createClient } from "@/libs/supabase/server";

export async function listThreads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .select(
      `
      id,
      title,
      content,
      created_at,
      author:profiles!author_id ( id, username ),
      replies ( count )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    author: row.author,
    _count: {
      replies: row.replies?.[0]?.count ?? 0,
    },
  }));
}

export async function getThreadById(threadId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .select(
      `
      id,
      title,
      content,
      created_at,
      author:profiles!author_id ( id, username ),
      replies (
        id,
        content,
        created_at,
        author:profiles!author_id ( id, username )
      )
    `
    )
    .eq("id", threadId)
    .order("created_at", { referencedTable: "replies", ascending: true })
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    author: data.author,
    replies: (data.replies || []).map((reply) => ({
      id: reply.id,
      content: reply.content,
      createdAt: reply.created_at,
      author: reply.author,
    })),
  };
}

export async function createThread({ title, content, authorId }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .insert({
      title,
      content,
      author_id: authorId,
    })
    .select(
      `
      id,
      title,
      content,
      created_at,
      author:profiles!author_id ( id, username )
    `
    )
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    author: data.author,
  };
}

export async function createReply({ content, threadId, authorId }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("replies")
    .insert({
      content,
      thread_id: threadId,
      author_id: authorId,
    })
    .select(
      `
      id,
      content,
      created_at,
      author:profiles!author_id ( id, username )
    `
    )
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    content: data.content,
    createdAt: data.created_at,
    author: data.author,
  };
}

export async function threadExists(threadId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("threads")
    .select("id")
    .eq("id", threadId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}
