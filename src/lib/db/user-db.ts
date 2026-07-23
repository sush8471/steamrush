import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  steam_id: string | null;
  created_at: string;
  updated_at: string;
}

export type UserProfileUpdate = Partial<
  Pick<UserProfile, "display_name" | "avatar_url">
>;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch a user's profile from the database. */
export async function getProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[user-db] getProfile error:", error.message);
    }
    return null;
  }

  return data as UserProfile;
}

/**
 * Insert or update a user profile.
 * Safe to call multiple times — uses upsert.
 */
export async function upsertProfile(
  userId: string,
  updates: UserProfileUpdate
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      { user_id: userId, ...updates, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("[user-db] upsertProfile error:", error.message);
    return null;
  }

  return data as UserProfile;
}
