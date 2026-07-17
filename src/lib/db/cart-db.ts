import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/context/CartContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DbCartItem {
  id: string;
  user_id: string;
  game_id: string;
  game_name: string;
  price: number;
  image: string | null;
  original_price: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toCartItem(row: DbCartItem): CartItem {
  return {
    id: row.game_id,
    name: row.game_name,
    price: row.price,
    image: row.image ?? "",
    originalPrice: row.original_price ?? undefined,
  };
}

function toDbRow(
  userId: string,
  item: CartItem
): Omit<DbCartItem, "id" | "created_at"> {
  return {
    user_id: userId,
    game_id: item.id,
    game_name: item.name,
    price: item.price,
    image: item.image ?? null,
    original_price: item.originalPrice ?? null,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all cart items for a user from the database. */
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[cart-db] getCartItems error:", error.message);
    return [];
  }

  return (data as DbCartItem[]).map(toCartItem);
}

/** Add a single item to the database cart (upsert by user_id + game_id). */
export async function addCartItem(
  userId: string,
  item: CartItem
): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .upsert(toDbRow(userId, item), { onConflict: "user_id,game_id" });

  if (error) {
    console.error("[cart-db] addCartItem error:", error.message);
  }
}

/** Remove a single item from the database cart. */
export async function removeCartItem(
  userId: string,
  gameId: string
): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("game_id", gameId);

  if (error) {
    console.error("[cart-db] removeCartItem error:", error.message);
  }
}

/** Delete all cart items for a user. */
export async function clearCartDb(userId: string): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("[cart-db] clearCartDb error:", error.message);
  }
}

/**
 * Merge local localStorage cart items into the database.
 * Uses upsert so existing DB items are not duplicated.
 * After merging, returns the full merged cart from the DB.
 */
export async function mergeLocalCart(
  userId: string,
  localItems: CartItem[]
): Promise<CartItem[]> {
  if (localItems.length > 0) {
    const rows = localItems.map((item) => toDbRow(userId, item));
    const { error } = await supabase
      .from("cart_items")
      .upsert(rows, { onConflict: "user_id,game_id", ignoreDuplicates: true });

    if (error) {
      console.error("[cart-db] mergeLocalCart error:", error.message);
    }
  }

  // Return the authoritative merged cart from DB
  return getCartItems(userId);
}
