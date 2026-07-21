"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import GamerBhiduNavbar from "@/components/sections/gamerbhidu-navbar";
import Footer from "@/components/sections/footer";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, count } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (item: (typeof wishlist)[0]) => {
    if (!item.price) {
      toast.error("This game has no price yet — check back soon!");
      return;
    }
    addToCart({
      id: item.gameId,
      name: item.gameName,
      price: item.price,
      image: item.image,
    });
  };

  const handleAddAllToCart = () => {
    const pricedItems = wishlist.filter((i) => i.price !== null);
    if (pricedItems.length === 0) {
      toast.error("None of your wishlisted games have prices yet.");
      return;
    }
    pricedItems.forEach((item) => {
      if (!isInCart(item.gameId)) {
        addToCart({
          id: item.gameId,
          name: item.gameName,
          price: item.price!,
          image: item.image,
        });
      }
    });
    toast.success(`${pricedItems.length} game${pricedItems.length > 1 ? "s" : ""} added to cart 🛒`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <GamerBhiduNavbar />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8 py-10 lg:py-16">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {count} {count === 1 ? "game" : "games"} saved
            </p>
          </div>

          {count > 0 && (
            <Button
              onClick={handleAddAllToCart}
              className="bg-white text-black hover:bg-white/90 font-bold gap-2 rounded-lg px-5 py-2.5 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </Button>
          )}
        </div>

        {/* Empty state */}
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-card border border-white/10 flex items-center justify-center">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground max-w-sm">
                Save games you love by clicking the heart ❤️ icon on any game
                card or the game detail page.
              </p>
            </div>
            <Link href="/games">
              <Button className="bg-white text-black hover:bg-white/90 font-bold gap-2 rounded-lg px-6 py-2.5">
                <ShoppingBag className="w-4 h-4" />
                Browse Games
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {wishlist.map((item) => {
              const inCart = isInCart(item.gameId);
              return (
                <div
                  key={item.gameId}
                  className="group relative bg-card rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col"
                >
                  {/* Cover image */}
                  <Link
                    href={`/games/${item.gameId}`}
                    className="relative aspect-[3/4] w-full overflow-hidden block"
                  >
                    <Image
                      src={item.image}
                      alt={item.gameName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Info + actions */}
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <Link href={`/games/${item.gameId}`} className="hover:no-underline">
                      <p className="text-white text-xs font-semibold line-clamp-2 leading-snug group-hover:text-white/80 transition-colors">
                        {item.gameName}
                      </p>
                    </Link>

                    <div className="mt-auto space-y-1.5">
                      {item.price ? (
                        <p className="text-white font-black text-base">₹{item.price}</p>
                      ) : (
                        <p className="text-muted-foreground text-xs">Price TBD</p>
                      )}

                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={inCart || !item.price}
                          className={`flex-1 h-7 text-[10px] font-bold gap-1 rounded ${
                            inCart
                              ? "bg-white/5 text-white/40 cursor-default border border-white/10"
                              : "bg-white text-black hover:bg-white/90"
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          {inCart ? "In Cart" : "Add"}
                        </Button>

                        <button
                          onClick={() => removeFromWishlist(item.gameId)}
                          aria-label="Remove from wishlist"
                          className="h-7 w-7 flex items-center justify-center rounded bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/50 text-muted-foreground hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
