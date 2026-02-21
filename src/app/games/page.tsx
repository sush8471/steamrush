"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Footer from "@/components/sections/footer";
import { SlidersHorizontal, X, ShoppingCart, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import SteamRushNavbar from "@/components/sections/steamrush-navbar";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getGames, getAllGenres, Game } from "@/lib/local-db";

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Highest Discount" },
];

const PRICE_RANGES = [
  { value: "all", label: "All Prices", min: 0, max: 99999 },
  { value: "under-100", label: "Under ₹100", min: 0, max: 100 },
  { value: "100-200", label: "₹100 - ₹200", min: 100, max: 200 },
  { value: "200-300", label: "₹200 - ₹300", min: 200, max: 300 },
  { value: "300-500", label: "₹300 - ₹500", min: 300, max: 500 },
  { value: "above-500", label: "Above ₹500", min: 500, max: 99999 },
];

function GamesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const genreFromUrl = searchParams.get("genre") || "All";

  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const [selectedGenre, setSelectedGenre] = useState(genreFromUrl);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    async function fetchGenres() {
      const data = await getAllGenres();
      setGenres(["All", ...data]);
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchGamesData() {
      setIsLoading(true);
      const priceRange = PRICE_RANGES.find(r => r.value === selectedPriceRange);
      
      const { data, count } = await getGames({
        genre: selectedGenre !== "All" ? [selectedGenre] : undefined,
        minPrice: priceRange?.min,
        maxPrice: priceRange?.max,
        search: searchTerm,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      });

      if (data) {
        // Handle client-side sorting for now as getGames doesn't support all sort options yet
        let sorted = [...data];
        if (sortBy === "name-asc") sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === "name-desc") sorted.sort((a, b) => b.title.localeCompare(a.title));
        if (sortBy === "price-low") sorted.sort((a, b) => Number(a.price) - Number(b.price));
        if (sortBy === "price-high") sorted.sort((a, b) => Number(b.price) - Number(a.price));
        if (sortBy === "discount") sorted.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
        
        setGames(sorted);
        setTotalCount(count || 0);
      }
      setIsLoading(false);
    }
    fetchGamesData();
  }, [selectedGenre, selectedPriceRange, sortBy, searchTerm, currentPage]);

  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    if (isInCart(game.id.toString())) {
      router.push('/cart');
    } else {
      addToCart({
        id: game.id.toString(),
        name: game.title,
        price: Number(game.price),
        image: game.image_url,
        originalPrice: Number(game.original_price || game.price)
      });
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="min-h-screen bg-[#0A0E27]">
      <SteamRushNavbar />
      <div className="pt-8 lg:pt-12 pb-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-2">
              Browse All Games
            </h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-[#B0B8D0] text-sm lg:text-base">
                {isLoading ? (
                  "Loading games..."
                ) : (
                  <>
                    Found {totalCount} game{totalCount !== 1 ? "s" : ""} 
                    {searchTerm && ` for "${searchTerm}"`}
                    {" • Original Steam keys • Instant delivery"}
                  </>
                )}
              </p>
              
              <div className="relative w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="Search in results..." 
                  className="w-full bg-[#1A1F3A] border border-[#2A2E4D] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1F3A] border border-[#2A2E4D] rounded-xl text-white hover:border-indigo-500 transition-all sm:min-w-[140px] justify-center group"
              >
                <SlidersHorizontal className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                <span className="font-bold">Filters</span>
              </button>
            </div>

            {/* Active Filters Chips */}
            {(selectedGenre !== "All" || selectedPriceRange !== "all" || sortBy !== "popular" || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-300">
                <span className="text-[#B0B8D0] text-sm font-medium">Active filters:</span>
                {selectedGenre !== "All" && (
                  <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5">
                    <span className="text-white text-xs font-bold">Genre: {selectedGenre}</span>
                    <button onClick={() => setSelectedGenre("All")} className="text-[#B0B8D0] hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                {selectedPriceRange !== "all" && (
                  <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5">
                    <span className="text-white text-xs font-bold">Price: {PRICE_RANGES.find(r => r.value === selectedPriceRange)?.label}</span>
                    <button onClick={() => setSelectedPriceRange("all")} className="text-[#B0B8D0] hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                {sortBy !== "popular" && (
                  <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5">
                    <span className="text-white text-xs font-bold">Sort: {SORT_OPTIONS.find(s => s.value === sortBy)?.label}</span>
                    <button onClick={() => setSortBy("popular")} className="text-[#B0B8D0] hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                {searchTerm && (
                  <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5">
                    <span className="text-white text-xs font-bold">Search: {searchTerm}</span>
                    <button onClick={() => setSearchTerm("")} className="text-[#B0B8D0] hover:text-white transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <button onClick={() => { setSelectedGenre("All"); setSelectedPriceRange("all"); setSortBy("popular"); setSearchTerm(""); }} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors ml-2 underline underline-offset-4">Clear all</button>
              </div>
            )}

            {showFilters && (
              <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-2xl p-6 space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-xl">Filter Games</h3>
                  <button onClick={() => setShowFilters(false)} className="text-[#B0B8D0] hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[#B0B8D0] text-xs font-black uppercase tracking-wider mb-2">Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-[#0A0E27] border border-[#2A2E4D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      {genres.map((genre) => (<option key={genre} value={genre}>{genre}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#B0B8D0] text-xs font-black uppercase tracking-wider mb-2">Price Range</label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => { setSelectedPriceRange(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-[#0A0E27] border border-[#2A2E4D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      {PRICE_RANGES.map((range) => (<option key={range.value} value={range.value}>{range.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#B0B8D0] text-xs font-black uppercase tracking-wider mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-[#0A0E27] border border-[#2A2E4D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
              <p className="text-slate-400 font-medium animate-pulse">Fetching your next adventure...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-24 bg-[#1A1F3A]/30 rounded-3xl border border-[#2A2E4D] border-dashed">
              <p className="text-[#B0B8D0] text-lg font-bold mb-2">No games found matching your filters.</p>
              <button onClick={() => { setSelectedGenre("All"); setSelectedPriceRange("all"); setSearchTerm(""); }} className="text-indigo-400 font-bold hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                {games.map((game) => {
                  const inCart = isInCart(game.id.toString());
                  return (
                    <div
                      key={game.id}
                      onClick={() => router.push(`/games/${game.slug}`)}
                      className="group relative bg-[#1A1F3A] rounded-2xl overflow-hidden border border-[#2A2E4D] hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <Image
                          src={game.image_url}
                          alt={game.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 16vw"
                        />
                        {game.discount_percentage && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                            -{game.discount_percentage}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-indigo-400 transition-colors h-10">
                            {game.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-white font-black text-xl">₹{game.price}</span>
                            {game.original_price && (
                              <span className="text-[#B0B8D0] text-xs line-through opacity-50">₹{game.original_price}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, game)}
                          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all transform active:scale-95 ${
                            inCart ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-900/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20'
                          }`}
                        >
                          {inCart ? (
                            <span className="flex items-center justify-center gap-2"><Check className="h-4 w-4" /> In Cart</span>
                          ) : (
                            <span className="flex items-center justify-center gap-2"><ShoppingCart className="h-4 w-4" /> Add to Cart</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-3 rounded-xl bg-[#1A1F3A] border border-[#2A2E4D] text-white hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 px-6 py-2 bg-[#1A1F3A] border border-[#2A2E4D] rounded-xl">
                    <span className="text-white font-black">{currentPage}</span>
                    <span className="text-[#B0B8D0] font-medium">/</span>
                    <span className="text-[#B0B8D0] font-medium">{totalPages}</span>
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-3 rounded-xl bg-[#1A1F3A] border border-[#2A2E4D] text-white hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    }>
      <GamesContent />
    </Suspense>
  );
}
