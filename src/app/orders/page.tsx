"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders, type Order } from "@/lib/db/order-db";
import { getUserRefixRequests, type RefixRequest } from "@/lib/db/refix-db";
import { OrderCard } from "@/components/ui/order-card";
import GamerBhiduNavbar from "@/components/sections/gamerbhidu-navbar";
import Footer from "@/components/sections/footer";
import Link from "next/link";
import { Package, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [refixMap, setRefixMap] = useState<Record<string, RefixRequest>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      if (!user) return;
      const [orderList, refixList] = await Promise.all([
        getUserOrders(user.id),
        getUserRefixRequests(user.id),
      ]);
      setOrders(orderList);

      // Build a map: order_id → most-recent refix request
      const map: Record<string, RefixRequest> = {};
      for (const req of refixList) {
        if (!map[req.order_id]) map[req.order_id] = req;
      }
      setRefixMap(map);
      setLoading(false);
    }
    fetchData();
  }, [isAuthenticated, user, authLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <GamerBhiduNavbar />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8 py-10 lg:py-16">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8" />
            My Orders
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your purchases and request re-fixes for delivered games.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Not signed in */}
        {!loading && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
            <div>
              <h2 className="text-xl font-bold text-white">Sign in to view your orders</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your order history is saved to your Google account.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && isAuthenticated && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
            <div>
              <h2 className="text-xl font-bold text-white">No orders yet</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Your future purchases will appear here.
              </p>
            </div>
            <Link href="/games">
              <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-lg px-6">
                Browse Games
              </Button>
            </Link>
          </div>
        )}

        {/* Orders grid */}
        {!loading && isAuthenticated && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                userId={user!.id}
                existingRefix={refixMap[order.order_id] ?? null}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
