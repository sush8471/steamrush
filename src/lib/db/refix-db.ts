import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RefixStatus = "pending" | "scheduled" | "resolved" | "closed";

export interface RefixRequest {
  id: string;
  user_id: string;
  order_id: string;       // SR12345678
  game_names: string;     // comma-separated snapshot
  issue: string;          // user's description
  status: RefixStatus;
  scheduled_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// User-facing
// ---------------------------------------------------------------------------

/** Submit a new re-fix support ticket */
export async function submitRefixRequest(
  userId: string,
  orderId: string,
  gameNames: string,
  issue: string
): Promise<RefixRequest | null> {
  const { data, error } = await supabase
    .from("refix_requests")
    .insert({ user_id: userId, order_id: orderId, game_names: gameNames, issue })
    .select()
    .single();

  if (error) {
    console.error("[refix-db] submitRefixRequest error:", error.message);
    return null;
  }
  return data as RefixRequest;
}

/** Get all re-fix requests for the signed-in user */
export async function getUserRefixRequests(
  userId: string
): Promise<RefixRequest[]> {
  const { data, error } = await supabase
    .from("refix_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[refix-db] getUserRefixRequests error:", error.message);
    return [];
  }
  return data as RefixRequest[];
}

/** Check if an open ticket already exists for a given order (avoids duplicates) */
export async function getRefixForOrder(
  userId: string,
  orderId: string
): Promise<RefixRequest | null> {
  const { data, error } = await supabase
    .from("refix_requests")
    .select("*")
    .eq("user_id", userId)
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[refix-db] getRefixForOrder error:", error.message);
    return null;
  }
  return data as RefixRequest | null;
}

// ---------------------------------------------------------------------------
// Admin-facing
// ---------------------------------------------------------------------------

/** Get ALL re-fix requests (admin only — requires admin RLS policy) */
export async function getAllRefixRequests(): Promise<RefixRequest[]> {
  const { data, error } = await supabase
    .from("refix_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[refix-db] getAllRefixRequests error:", error.message);
    return [];
  }
  return data as RefixRequest[];
}

/** Update a re-fix request status, optional scheduled time and admin note */
export async function updateRefixRequest(
  id: string,
  updates: {
    status?: RefixStatus;
    scheduled_at?: string | null;
    admin_note?: string | null;
  }
): Promise<void> {
  const { error } = await supabase
    .from("refix_requests")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[refix-db] updateRefixRequest error:", error.message);
  }
}
