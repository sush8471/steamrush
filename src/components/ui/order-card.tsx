"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Circle, Package, Wrench } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/db/order-db";
import type { RefixRequest } from "@/lib/db/refix-db";
import { RefixModal } from "@/components/ui/refix-modal";
import type { CartItem } from "@/context/CartContext";

// ---------------------------------------------------------------------------
// Status progress steps
// ---------------------------------------------------------------------------

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending",   label: "Ordered"   },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: OrderStatus) {
  if (status === "cancelled") return -1;
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

// ---------------------------------------------------------------------------
// Refix status badge (if a ticket exists)
// ---------------------------------------------------------------------------

const REFIX_BADGE: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Re-Fix: Pending",   cls: "bg-amber-500/15 text-amber-400 border-amber-500/30"  },
  scheduled: { label: "Re-Fix: Scheduled", cls: "bg-blue-500/15 text-blue-400 border-blue-500/30"    },
  resolved:  { label: "Re-Fix: Resolved",  cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  closed:    { label: "Re-Fix: Closed",    cls: "bg-white/5 text-muted-foreground border-white/10"   },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface OrderCardProps {
  order: Order;
  userId: string;
  existingRefix?: RefixRequest | null;
}

export function OrderCard({ order, userId, existingRefix }: OrderCardProps) {
  const [refixOpen, setRefixOpen] = useState(false);

  const items = order.items as CartItem[];
  const stepIndex = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  const gameNames = items.map((i) => i.name).join(", ");
  const refixBadge = existingRefix ? REFIX_BADGE[existingRefix.status] : null;

  return (
    <>
      <div className="bg-card border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 space-y-4">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-white font-bold text-sm tracking-tight">
              #{order.order_id}
            </p>
            <p className="text-muted-foreground text-xs">
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Refix badge */}
            {refixBadge && (
              <button
                onClick={() => setRefixOpen(true)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${refixBadge.cls} transition-opacity hover:opacity-80`}
              >
                {refixBadge.label}
              </button>
            )}
            {/* Cancelled pill */}
            {isCancelled && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                Cancelled
              </span>
            )}
          </div>
        </div>

        {/* ── Status progress bar ── */}
        {!isCancelled && (
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  {/* Circle */}
                  <div className="relative flex flex-col items-center">
                    {done ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${active ? "text-white" : "text-white/50"}`}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Circle className="w-4 h-4 text-white/15" strokeWidth={2} />
                    )}
                    <span
                      className={`absolute top-5 text-[9px] font-bold whitespace-nowrap ${
                        done ? (active ? "text-white" : "text-white/50") : "text-white/20"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-1 ${i < stepIndex ? "bg-white/40" : "bg-white/10"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Spacer for step labels */}
        <div className="h-3" />

        {/* ── Game items ── */}
        <div className="space-y-2">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.image ? (
                <div className="relative w-8 h-11 shrink-0 rounded overflow-hidden border border-white/10">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-8 h-11 shrink-0 rounded bg-white/5 flex items-center justify-center border border-white/10">
                  <Package className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">₹{item.price}</p>
              </div>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-[10px] text-muted-foreground pl-11">
              +{items.length - 3} more game{items.length - 3 > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ── Footer: Total + Re-Fix button ── */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <p className="text-white font-black text-base">₹{order.total}</p>

          {isDelivered && !existingRefix && (
            <button
              onClick={() => setRefixOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 text-xs font-semibold transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              Request Re-Fix
            </button>
          )}

          {isDelivered && existingRefix && (
            <button
              onClick={() => setRefixOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white text-xs font-semibold transition-all"
            >
              <Wrench className="w-3.5 h-3.5" />
              View Re-Fix
            </button>
          )}
        </div>
      </div>

      {/* Re-Fix modal */}
      <RefixModal
        open={refixOpen}
        onClose={() => setRefixOpen(false)}
        userId={userId}
        orderId={order.order_id}
        gameNames={gameNames}
        existingRequest={existingRefix}
      />
    </>
  );
}
