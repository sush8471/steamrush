import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WishlistItem {
  gameId: string;
  gameName: string;
  image: string;
  price: number | null;
}

interface DbWishlistItem {
  id: string;
  user_id: string;
  game_id: string;
  game_name: string;
  image: string | null;
  price: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toWishlistItem(row: DbWishlistItem): WishlistItem {
  return {
    gameId: row.game_id,
    gameName: row.game_name,
    image: row.image ?? "",
    price: row.price,
  };
}

function toDbRow(
  userId: string,
  item: WishlistItem
): Omit<DbWishlistItem, "id" | "created_at"> {
  return {
    user_id: userId,
    game_id: item.gameId,
    game_name: item.gameName,
    image: item.image ?? null,
    price: item.price ?? null,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all wishlist items for a user from the database. */
export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from("wishlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[wishlist-db] getWishlist error:", error.message);
    return [];
  }

  return (data as DbWishlistItem[]).map(toWishlistItem);
}

/** Add a single item to the database wishlist (upsert by user_id + game_id). */
export async function addWishlistItem(
  userId: string,
  item: WishlistItem
): Promise<void> {
  const { error } = await supabase
    .from("wishlists")
    .upsert(toDbRow(userId, item), { onConflict: "user_id,game_id" });

  if (error) {
    console.error("[wishlist-db] addWishlistItem error:", error.message);
  }
}

/** Remove a single item from the database wishlist. */
export async function removeWishlistItem(
  userId: string,
  gameId: string
): Promise<void> {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("game_id", gameId);

  if (error) {
    console.error("[wishlist-db] removeWishlistItem error:", error.message);
  }
}

/** Delete all wishlist items for a user. */
export async function clearWishlistDb(userId: string): Promise<void> {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("[wishlist-db] clearWishlistDb error:", error.message);
  }
}

/**
 * Merge local localStorage wishlist items into the database.
 * Uses upsert so existing DB items are not duplicated.
 * After merging, returns the full merged wishlist from the DB.
 */
export async function mergeLocalWishlist(
  userId: string,
  localItems: WishlistItem[]
): Promise<WishlistItem[]> {
  if (localItems.length > 0) {
    const rows = localItems.map((item) => toDbRow(userId, item));
    const { error } = await supabase
      .from("wishlists")
      .upsert(rows, { onConflict: "user_id,game_id", ignoreDuplicates: true });

    if (error) {
      console.error("[wishlist-db] mergeLocalWishlist error:", error.message);
    }
  }

  // Return the authoritative merged wishlist from DB
  return getWishlist(userId);
}
