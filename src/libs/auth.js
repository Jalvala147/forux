import { createClient } from "@/libs/supabase/server";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function ensureProfile(user) {
  if (!user) return null;

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, email, username")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const username =
    user.user_metadata?.username?.trim() ||
    user.email?.split("@")[0] ||
    `user_${user.id.slice(0, 8)}`;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        username,
      },
      { onConflict: "id" }
    )
    .select("id, email, username")
    .single();

  if (error) {
    console.error("ensureProfile:", error.message);
    return {
      id: user.id,
      email: user.email,
      username,
    };
  }

  return data;
}

export async function requireProfile() {
  const user = await getAuthUser();
  if (!user) return null;
  return ensureProfile(user);
}
