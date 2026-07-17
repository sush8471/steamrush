import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/**
 * Ensures a row exists in `public.user_profiles` for the given user.
 * Called once whenever AuthContext detects a new authenticated session.
 * Uses upsert (INSERT ... ON CONFLICT DO NOTHING) so it's idempotent.
 */
export async function ensureUserProfile(user: User): Promise<void> {
  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      display_name:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        "Gamer",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    {
      // Only insert if not exists — do not overwrite existing profile fields
      onConflict: "user_id",
      ignoreDuplicates: true,
    }
  );

  if (error) {
    // Non-fatal: profile creation failure shouldn't break auth
    console.warn("[auth-hooks] Failed to ensure user profile:", error.message);
  }
}
