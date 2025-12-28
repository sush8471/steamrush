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
  const [isExpanded, setIsExpanded] = useState(false); // For mobile expand
  const [suggestions, setSuggestions] = useState(getSearchSuggestions(GAMES_DATABASE, ""));
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        // Don't close expanded search on mobile when clicking suggestions
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Update suggestions when query changes
  useEffect(() => {
    if (localQuery.trim()) {
      const results = getSearchSuggestions(GAMES_DATABASE, localQuery, 10);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [localQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    addRecentSearch(query);
    setShowSuggestions(false);
    setIsExpanded(false);
    setLocalQuery("");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleClear = () => {
    setLocalQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setLocalQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(localQuery);
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      {/* Desktop: Inline Search (hidden on mobile) */}
      <div ref={searchRef} className="hidden lg:block relative w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B8D0]" />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search games..."
            className="w-full h-10 pl-10 pr-10 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#B0B8D0] focus:outline-none focus:ring-2 focus:ring-[#0074E4] focus:border-transparent transition-all"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-3.5 w-3.5 text-[#B0B8D0]" />
            </button>
          )}
        </div>

        {/* Desktop Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
            {suggestions.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  if (game.id === 'gta-v' || game.title.toLowerCase().includes('grand theft auto v')) {
                    router.push('/games/gta-v');
                    setShowSuggestions(false);
                    setLocalQuery("");
                  } else {
                    addToCart({
                      id: game.id,
                      name: game.title,
                      price: game.price,
                      image: game.image,
                    });
                  }
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                  <Image src={game.image} alt={game.title} fill className="object-cover" sizes="48px" />
                  {game.discount && (
                    <div className="absolute top-0 right-0 bg-[#0074E4] text-white text-[8px] font-bold px-1 py-0.5">
                      {game.discount}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-white text-sm font-semibold truncate">{game.title}</h4>
                  <p className="text-[#B0B8D0] text-xs truncate">{game.genre[0]} • {game.genre[1] || "Game"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#0074E4] font-bold text-sm">₹{game.price}</div>
                  <div className="text-[#B0B8D0] text-xs line-through">₹{game.originalPrice}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Search Icon Only */}
      <button
        onClick={() => setIsExpanded(true)}
        className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
        aria-label="Search games"
      >
        <Search className="h-5 w-5 text-white" />
      </button>

      {/* Mobile: Full-Screen Search Modal (Epic Games Style) */}
      {isExpanded && (
        <div className="fixed inset-0 bg-[#0A0E27] z-[100] lg:hidden min-h-screen flex flex-col">
          {/* Search Header - Fixed at top */}
          <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-white/10 bg-[#0A0E27]">
            <Search className="h-5 w-5 text-[#B0B8D0] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search games..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="flex-1 bg-transparent text-white text-lg placeholder:text-[#B0B8D0] focus:outline-none"
            />
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Results - Scrollable content area */}
          <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="p-4 pb-8">
              {suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        if (game.id === 'gta-v' || game.title.toLowerCase().includes('grand theft auto v')) {
                          router.push('/games/gta-v');
                        } else {
                          addToCart({
                            id: game.id,
                            name: game.title,
                            price: game.price,
                            image: game.image,
                          });
                        }
                        handleClose();
                      }}
                      className="w-full flex items-start gap-4 p-4 bg-[#1A1F3A]/50 rounded-xl hover:bg-[#1A1F3A] active:bg-[#1A1F3A] transition-all border border-white/5 hover:border-[#0074E4]/30"
                    >
                      {/* Game Image */}
                      <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={game.image} alt={game.title} fill className="object-cover" sizes="80px" />
                        {game.discount && (
                          <div className="absolute top-1 right-1 bg-[#0074E4] text-white text-xs font-bold px-2 py-1 rounded">
                            {game.discount}
                          </div>
                        )}
                      </div>

                      {/* Game Info - Full Names Visible */}
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="text-white font-semibold text-base leading-snug mb-2">
                          {game.title}
                        </h3>
                        <p className="text-[#B0B8D0] text-sm mb-3">
                          {game.genre.slice(0, 2).join(" • ")}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[#0074E4] font-bold text-lg">₹{game.price}</span>
                          <span className="text-[#B0B8D0] text-sm line-through">₹{game.originalPrice}</span>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* View All Link */}
                  {localQuery && (
                    <button
                      onClick={() => handleSearch(localQuery)}
                      className="w-full p-4 text-center text-[#0074E4] font-semibold hover:bg-white/5 active:bg-white/5 rounded-xl transition-colors mt-4"
                    >
                      View all results for "{localQuery}" →
                    </button>
                  )}
                </div>
              ) : localQuery ? (
                <div className="text-center text-[#B0B8D0] mt-12 px-4">
                  <p className="text-lg mb-2">No games found</p>
                  <p className="text-sm">Try searching for "GTA", "FIFA", or "Racing"</p>
                </div>
              ) : (
                <div className="text-center text-[#B0B8D0] mt-12 px-4">
                  <p className="text-lg mb-2">Start typing to search</p>
                  <p className="text-sm">Search from {GAMES_DATABASE.length}+ games</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
