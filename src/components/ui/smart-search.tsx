"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: number;
  title: string;
  type: string;
  image: string;
  price: string;
}

interface SmartSearchProps {
  gameData: SearchResult[];
  placeholder?: string;
  className?: string;
}

export function SmartSearch({ gameData, placeholder = "Search for games...", className }: SmartSearchProps) {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const router = useRouter();
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Smart search algorithm
  const searchGames = React.useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    
    const scored = gameData.map(game => {
      const titleLower = game.title.toLowerCase();
      const words = titleLower.split(' ');
      
      let score = 0;
      
      // Exact match
      if (titleLower === lowerQuery) score += 1000;
      
      // Starts with query
      if (titleLower.startsWith(lowerQuery)) score += 500;
      
      // Word starts with query
      if (words.some(word => word.startsWith(lowerQuery))) score += 300;
      
      // Contains query
      if (titleLower.includes(lowerQuery)) score += 200;
      
      // Abbreviation match (e.g., "gt" matches "Grand Theft Auto")
      const initials = words.map(w => w[0]).join('');
      if (initials.startsWith(lowerQuery)) score += 400;
      
      // Character sequence match (fuzzy)
      let queryIndex = 0;
      for (let i = 0; i < titleLower.length && queryIndex < lowerQuery.length; i++) {
        if (titleLower[i] === lowerQuery[queryIndex]) {
          queryIndex++;
          score += 10;
        }
      }
      if (queryIndex === lowerQuery.length) score += 100;
      
      return { game, score };
    });

    const filtered = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.game);

    setResults(filtered);
  }, [gameData]);

  // Handle search input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchGames(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle result selection
  const handleSelectResult = (gameId: number) => {
    router.push(`/games/${gameId}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelectResult(results[selectedIndex].id);
      } else if (results.length > 0) {
        handleSelectResult(results[0].id);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B8D0]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg pl-10 pr-10 py-2.5 text-white placeholder:text-[#B0B8D0] focus:outline-none focus:border-[#0074E4] focus:ring-2 focus:ring-[#0074E4]/20 transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B8D0] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.map((game, index) => (
            <button
              key={game.id}
              onClick={() => handleSelectResult(game.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors border-b border-[#2A2E4D] last:border-0",
                selectedIndex === index && "bg-white/10"
              )}
            >
              <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm truncate">
                  {game.title}
                </h4>
                <p className="text-[#B0B8D0] text-xs mt-0.5 truncate">
                  {game.type}
                </p>
                <p className="text-[#0074E4] font-bold text-sm mt-1">
                  {game.price}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg shadow-2xl p-4 text-center z-50">
          <p className="text-[#B0B8D0] text-sm">
            No games found for "{query}"
          </p>
          <button
            onClick={() => router.push('/games')}
            className="mt-2 text-[#0074E4] text-sm hover:underline"
          >
            Browse all games →
          </button>
        </div>
      )}
    </div>
  );
}
