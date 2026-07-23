"use client";

import { useState } from "react";
import { Search, X, RotateCcw, Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  selectedVisibility: string;
  onVisibilityChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  sortBy: "name" | "price" | "created";
  onSortChange: (value: "name" | "price" | "created") => void;
  allGenres: string[];
  onReset: () => void;
  onAdd: () => void;
  hasActiveFilters: boolean;
};

export default function GamesFilterBar({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedVisibility,
  onVisibilityChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  allGenres,
  onReset,
  onAdd,
  hasActiveFilters,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCount =
    (selectedGenre !== allGenres[0] ? 1 : 0) +
    (selectedVisibility !== "All" ? 1 : 0) +
    (selectedStatus !== "All" ? 1 : 0) +
    (sortBy !== "name" ? 1 : 0);

  return (
    <div className="bg-card border border-border p-3 lg:p-4 rounded-xl space-y-3">
      {/* Search + Add Game row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, series, or slug..."
            className="w-full bg-background border border-border focus:border-primary rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white rounded transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters toggle — mobile only */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="sm:hidden relative flex items-center gap-1.5 px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-white hover:border-primary/40 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        <Button onClick={onAdd} className="sm:w-auto font-black active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          Add Game
        </Button>
      </div>

      {/* Filters — always visible on sm+, collapsible on mobile */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap gap-2 items-center">
          <select value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)} className="flex-1 min-w-[130px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
            {allGenres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select value={selectedVisibility} onChange={(e) => onVisibilityChange(e.target.value)} className="flex-1 min-w-[130px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
            <option value="All">Visible: All</option>
            <option value="Visible">Visible</option>
            <option value="Hidden">Hidden</option>
          </select>
          <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className="flex-1 min-w-[130px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
            <option value="All">Status: All</option>
            <option value="released">Released</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value as "name" | "price" | "created")} className="flex-1 min-w-[110px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="created">Sort: Created</option>
          </select>
          {hasActiveFilters && (
            <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg border border-border transition-all cursor-pointer" title="Clear all filters">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Collapsible filters — mobile only */}
      <div className="sm:hidden">
        {filtersOpen && (
          <div className="flex flex-wrap gap-2 items-center">
            <select value={selectedGenre} onChange={(e) => onGenreChange(e.target.value)} className="flex-1 min-w-[130px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
              {allGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select value={selectedVisibility} onChange={(e) => onVisibilityChange(e.target.value)} className="flex-1 min-w-[130px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
              <option value="All">Visible: All</option>
              <option value="Visible">Visible</option>
              <option value="Hidden">Hidden</option>
            </select>
            <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className="flex-1 min-w-[130px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
              <option value="All">Status: All</option>
              <option value="released">Released</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value as "name" | "price" | "created")} className="flex-1 min-w-[110px] bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
              <option value="created">Sort: Created</option>
            </select>
            {hasActiveFilters && (
              <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg border border-border transition-all cursor-pointer" title="Clear all filters">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
