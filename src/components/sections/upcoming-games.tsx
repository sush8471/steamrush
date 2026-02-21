"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getGames, Game } from "@/lib/local-db";

export default function UpcomingGames() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUpcoming() {
            setIsLoading(true);
            const { data } = await getGames({ is_upcoming: true, limit: 10 });
            if (data) setGames(data);
            setIsLoading(false);
        }
        fetchUpcoming();
    }, []);

    const scroll = useCallback((direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    if (!isLoading && games.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-[#0A0E27] py-8 lg:py-12">
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
                    {!isLoading && games.length > 4 && (
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="p-2 rounded-lg bg-[#1A1F3A] hover:bg-[#2A2E4D] border border-[#2A2E4D] hover:border-[#FFD700]/30 text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-2 rounded-lg bg-[#1A1F3A] hover:bg-[#2A2E4D] border border-[#2A2E4D] hover:border-[#FFD700]/30 text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div 
                    ref={scrollContainerRef} 
                    className="overflow-x-auto flex gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
                        </div>
                    ) : (
                        games.map((game) => {
                            return (
                                <Link
                                    key={game.id}
                                    href={`/games/${game.slug}`}
                                    className="flex-shrink-0 snap-start"
                                >
                                    <div className="group relative bg-[#1A1F3A]/40 rounded-xl overflow-hidden border border-[#2A2E4D]/50 transition-all duration-300 hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] flex-shrink-0 w-[60vw] max-w-[240px] h-full cursor-pointer">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            <Image
                                                src={game.image_url}
                                                alt={game.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                                sizes="(max-width: 768px) 60vw, 16vw"
                                            />

                                            <div className="absolute top-3 right-3 bg-[#FFD700]/90 text-[#0A0E27] text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg uppercase tracking-tighter">
                                                <Sparkles className="w-3 h-3" />
                                                Soon
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-white text-sm font-black truncate group-hover:text-[#FFD700] transition-colors">{game.title}</p>
                                                <p className="text-[#B0B8D0] text-[10px] mt-1 line-clamp-1">{game.genre?.join(' • ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
