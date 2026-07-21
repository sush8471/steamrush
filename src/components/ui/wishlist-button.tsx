"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import type { WishlistItem } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  /** The item to wishlist — pass all fields so DB can store them */
  item: WishlistItem;
  /**
   * Size variant.
   * - "sm"  → 28×28 button, 14×14 icon  (game cards)
   * - "md"  → 36×36 button, 16×16 icon  (game detail page)
   */
  size?: "sm" | "md";
  className?: string;
}

export function WishlistButton({
  item,
  size = "sm",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(item.gameId);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent the parent <Link> from navigating when the button is clicked
    e.preventDefault();
    e.stopPropagation();

    if (wishlisted) {
      removeFromWishlist(item.gameId);
    } else {
      addToWishlist(item);
    }
  };

  const sizeClasses =
    size === "md"
      ? "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4"
      : "h-7 w-7 [&_svg]:h-3.5 [&_svg]:w-3.5";

  return (
    <button
      id={`wishlist-btn-${item.gameId}`}
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={cn(
        "flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
        "border border-white/10 hover:border-white/30",
        wishlisted
          ? "bg-rose-500/80 hover:bg-rose-500 text-white"
          : "bg-black/40 hover:bg-black/70 text-white/70 hover:text-white",
        sizeClasses,
        className
      )}
    >
      <Heart
        className={cn("transition-all duration-200", wishlisted && "fill-white")}
      />
    </button>
  );
}
