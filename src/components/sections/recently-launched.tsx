"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rocket, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getGames, Game } from "@/lib/local-db";

export default function RecentlyLaunched() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRecentlyLaunched() {
            setIsLoading(true);
            const { data } = await getGames({ is_recently_launched: true, limit: 10 });
            if (data) setGames(data);
            setIsLoading(false);
        }
        fetchRecentlyLaunched();
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
                            <Rocket className="w-6 h-6 lg:w-8 lg:h-8 text-[#00FF88]" />
                            Recently Launched
                        </h2>
                        <p className="text-[#B0B8D0] text-sm lg:text-base">
                            Fresh arrivals - Get them now!
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    {!isLoading && games.length > 4 && (
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="p-2 rounded-lg bg-[#1A1F3A] hover:bg-[#2A2E4D] border border-[#2A2E4D] hover:border-[#00FF88]/30 text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="p-2 rounded-lg bg-[#1A1F3A] hover:bg-[#2A2E4D] border border-[#2A2E4D] hover:border-[#00FF88]/30 text-white transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]"
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
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        games.map((game) => {
                            const discount = game.discount_percentage || 0;

                            return (
                                <Link
                                    key={game.id}
                                    href={`/games/${game.slug}`}
                                    className="flex-shrink-0 snap-start"
                                >
                                    <div className="group relative bg-[#1A1F3A] rounded-xl overflow-hidden border border-[#2A2E4D] hover:border-[#00FF88]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.15)] flex-shrink-0 w-[60vw] max-w-[240px] h-full cursor-pointer">
                                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                                            <Image
                                                src={game.image_url}
                                                alt={game.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                sizes="(max-width: 768px) 70vw, 16vw"
                                            />

                                            {/* NEW Badge */}
                                            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#00FF88] to-[#00CC6E] text-[#0A0E27] text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                                                <Rocket className="w-3 h-3" />
                                                NEW
                                            </div>

                                            {/* Discount Badge */}
                                            {discount > 0 && (
                                                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg uppercase tracking-tighter">
                                                    -{discount}%
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">
                                            <p className="text-white font-bold text-sm truncate mb-1 group-hover:text-[#00FF88] transition-colors">{game.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-black text-xl">
                                                    ₹{game.price}
                                                </span>
                                                {game.original_price && (
                                                    <span className="text-[#B0B8D0] text-xs line-through opacity-50">
                                                        ₹{game.original_price}
                                                    </span>
                                                )}
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
