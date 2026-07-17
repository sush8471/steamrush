import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  steam_id: string | null;
  loyalty_tier: "bronze" | "silver" | "gold" | "platinum";
  total_spent: number;
  total_orders: number;
  birthday: string | null;
  created_at: string;
  updated_at: string;
}

export type UserProfileUpdate = Partial<
  Pick<
    UserProfile,
    "display_name" | "avatar_url" | "steam_id" | "loyalty_tier" | "birthday"
  >
>;

// ---------------------------------------------------------------------------
// Tier Calculation
// ---------------------------------------------------------------------------

function calculateLoyaltyTier(
  totalSpent: number
): UserProfile["loyalty_tier"] {
  if (totalSpent >= 15000) return "platinum";
  if (totalSpent >= 5000) return "gold";
  if (totalSpent >= 1000) return "silver";
  return "bronze";
}

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
      // PGRST116 = no rows found
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

/** Set or clear the steam_id field for a user profile. */
export async function updateSteamId(
  userId: string,
  steamId: string | null
): Promise<void> {
  const { error } = await supabase
    .from("user_profiles")
    .update({ steam_id: steamId, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    console.error("[user-db] updateSteamId error:", error.message);
  }
}

/**
 * Increment total_spent and total_orders after a purchase,
 * and recalculate the loyalty tier automatically.
 */
export async function updateLoyalty(
  userId: string,
  orderTotal: number
): Promise<void> {
  // Fetch current totals first
  const profile = await getProfile(userId);
  if (!profile) {
    console.warn("[user-db] updateLoyalty: no profile found for", userId);
    return;
  }

  const newTotalSpent = profile.total_spent + orderTotal;
  const newTotalOrders = profile.total_orders + 1;
  const newTier = calculateLoyaltyTier(newTotalSpent);

  const { error } = await supabase
    .from("user_profiles")
    .update({
      total_spent: newTotalSpent,
      total_orders: newTotalOrders,
      loyalty_tier: newTier,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error("[user-db] updateLoyalty error:", error.message);
  }
}
