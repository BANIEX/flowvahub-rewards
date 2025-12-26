import { supabase } from "./supabase";

export async function getOrCreateProfile(userId: string) {
  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("Profile fetch error:", fetchError);
    throw fetchError;
  }

  if (existing) return existing;

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert([{ id: userId, points: 0 }])
    .select()
    .single();

  if (insertError) {
    console.error("Profile creation error:", insertError);
    if (insertError.code === "23505") {
      return fetchProfile(userId);
    }
    throw insertError;
  }

  return inserted;
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}