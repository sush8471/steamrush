"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { updateOrderStatus, type Order, type OrderStatus } from "@/lib/db/order-db";
import { Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "delivered", "cancelled"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { user_email?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[admin/orders] fetch error:", error.message);
        toast.error("Failed to load orders.");
      } else {
        setOrders((data as Order[]) ?? []);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
    );
    setUpdating(null);
    toast.success(`Order #${orderId} → ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">All Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#111111] border border-[#262626] rounded-xl p-12 text-center text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#262626] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.7fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[#262626] text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Order #</span>
            <span>Items</span>
            <span>Total</span>
            <span># Games</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const isUpdating = updating === order.order_id;

            return (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_1.2fr_0.8fr_0.7fr_1fr_1fr] gap-4 items-center px-5 py-4 border-b border-[#262626]/50 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                {/* Order ID */}
                <span className="text-white font-bold text-sm font-mono">
                  #{order.order_id}
                </span>

                {/* Game names */}
                <span className="text-muted-foreground text-xs truncate" title={items.map((i: { name: string }) => i.name).join(", ")}>
                  {items.map((i: { name: string }) => i.name).join(", ")}
                </span>

                {/* Total */}
                <span className="text-white font-bold text-sm">₹{order.total}</span>

                {/* Count */}
                <span className="text-muted-foreground text-sm">{items.length}</span>

                {/* Date */}
                <span className="text-muted-foreground text-xs">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                {/* Status selector */}
                <div className="relative">
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <div className="relative inline-flex items-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.order_id, e.target.value as OrderStatus)
                        }
                        className={`appearance-none text-xs font-bold px-3 py-1.5 pr-7 rounded-full border cursor-pointer bg-transparent focus:outline-none ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#111111] text-white">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
