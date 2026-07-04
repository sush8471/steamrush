"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { getGamesBySection } from "@/lib/local-db";

type Game = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  genre: string[];
};

export default function UpcomingGames() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const { data } = await getGamesBySection("upcoming-games");
        if (data) {
          setGames(data);
        }
      } catch (err) {
        console.error("Failed to load upcoming games:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return null; // Don't render anything while loading
  }

  return (
    <section className="w-full bg-[#080A10] py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-[#FFD700]" />
              Upcoming Games
            </h2>
            <p className="text-[#B0B8D0] text-sm lg:text-base">
              New releases arriving soon
            </p>
          </div>

          {/* Navigation Buttons */}
          {games.length > 6 && (
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-lg bg-[#121622] hover:bg-[#202838] border border-[#202838] hover:border-[#FFD700]/30 text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-lg bg-[#121622] hover:bg-[#202838] border border-[#202838] hover:border-[#FFD700]/30 text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div ref={scrollContainerRef} className="overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {games.length === 0 ? (
            // Empty state
            <div className="w-full text-center py-12">
              <p className="text-gray-400 text-lg">No upcoming games at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for new releases!</p>
            </div>
          ) : (
            games.map((game) => {
              const CardContent = (
                <div
                  className="group relative bg-[#121622]/40 rounded-lg overflow-hidden border border-[#202838]/50 transition-all duration-300 hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] cursor-pointer flex-shrink-0 w-[60vw] max-w-[240px] snap-start h-full"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={game.image_url}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 768px) 60vw, 16vw"
                    />

                    <div className="absolute top-2 right-2 bg-[#FFD700]/90 text-[#080A10] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Coming Soon
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-bold truncate">{game.title}</p>
                      <p className="text-[#FFD700] text-xs">{game.genre.join(', ')}</p>
                    </div>
                  </div>
                </div>
              );

              return (
                <Link key={game.id} href={`/games/${game.slug}`} className="flex-shrink-0 snap-start">
                  {CardContent}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
