"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { GAMES_DATABASE } from "@/data/games";
import { getSearchSuggestions } from "@/utils/search";
import { useSearch } from "@/context/SearchContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function NavbarSearch() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { searchQuery, setSearchQuery, addRecentSearch } = useSearch();
  const [localQuery, setLocalQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState(getSearchSuggestions(GAMES_DATABASE, ""));
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    if (localQuery.trim()) {
      const results = getSearchSuggestions(GAMES_DATABASE, localQuery, 5);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [localQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    addRecentSearch(query);
    setShowSuggestions(false);
    setLocalQuery("");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleInputChange = (value: string) => {
    setLocalQuery(value);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setLocalQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(localQuery);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B8D0]" />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search games... (try 'GTA', 'FIFA', 'Racing')"
          className="w-full h-10 pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#B0B8D0] focus:outline-none focus:ring-2 focus:ring-[#0074E4] focus:border-transparent transition-all"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 text-[#B0B8D0]" />
          </button>
        )}
      </div>

      {/* Instant Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {suggestions.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                addToCart({
                  id: game.id,
                  name: game.title,
                  price: game.price,
                  image: game.image,
                });
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              {/* Game Thumbnail */}
              <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
                {game.discount && (
                  <div className="absolute top-0 right-0 bg-[#0074E4] text-white text-[8px] font-bold px-1 py-0.5">
                    {game.discount}
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="flex-1 text-left min-w-0">
                <h4 className="text-white text-sm font-semibold truncate">
                  {game.title}
                </h4>
                <p className="text-[#B0B8D0] text-xs truncate">
                  {game.genre[0]} • {game.genre[1] || "Game"}
                </p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="text-[#0074E4] font-bold text-sm">
                  ₹{game.price}
                </div>
                <div className="text-[#B0B8D0] text-xs line-through">
                  ₹{game.originalPrice}
                </div>
              </div>
            </button>
          ))}

          {/* View All Results Link */}
          <button
            onClick={() => handleSearch(localQuery)}
            className="w-full p-3 text-center text-[#0074E4] text-sm font-semibold hover:bg-white/5 transition-colors border-t border-white/10"
          >
            View all results for "{localQuery}" →
          </button>
        </div>
      )}
    </div>
  );
}
