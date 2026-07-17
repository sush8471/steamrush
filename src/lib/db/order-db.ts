import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/context/CartContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  order_id: string; // e.g. SR12345678
  status: OrderStatus;
  total: number;
  payment_method: string;
  items: CartItem[]; // jsonb snapshot
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Generate a human-readable order ID like SR12345678 */
export function generateOrderId(): string {
  return `SR${Date.now().toString().slice(-8)}`;
}

/** Create a new order row in the database */
export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
  orderId?: string
): Promise<Order | null> {
  const oid = orderId ?? generateOrderId();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      order_id: oid,
      status: "pending",
      total,
      payment_method: "upi",
      items: items as unknown as object,
    })
    .select()
    .single();

  if (error) {
    console.error("[order-db] createOrder error:", error.message);
    return null;
  }

  return data as Order;
}

/** Fetch all orders for a user, newest first */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[order-db] getUserOrders error:", error.message);
    return [];
  }

  return data as Order[];
}

/** Fetch a single order by its human-readable order_id */
export async function getOrderById(
  orderId: string,
  userId: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[order-db] getOrderById error:", error.message);
    }
    return null;
  }

  return data as Order;
}

/** Update order status — primarily called from admin dashboard */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("order_id", orderId);

  if (error) {
    console.error("[order-db] updateOrderStatus error:", error.message);
  }
}
