'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlusCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to match the requested pixel-perfect layout
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

interface Game {
  id: number;
  title: string;
  type: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  badges?: {
    type: 'first-run' | 'now-on-epic';
    label: string;
  }[];
}

const games: Game[] = [
  {
    id: 1,
    title: "Hotseat Wagons 2",
    type: "Base Game",
    image: "https://placehold.co/600x800/203040/FFFFFF.png?text=Hotseat+Wagons+2",
    price: 9.99,
    badges: [{ type: 'first-run', label: 'First Run' }]
  },
  {
    id: 2,
    title: "Military Logistics Simulator",
    type: "Base Game",
    image: "https://placehold.co/600x800/1F2937/FFFFFF.png?text=Military+Logistics",
    price: 24.99,
  },
  {
    id: 3,
    title: "What is Older?",
    type: "Base Game",
    image: "https://placehold.co/600x800/374151/FFFFFF.png?text=What+is+Older?",
    price: 2.49,
  },
  {
    id: 4,
    title: "Botany Manor",
    type: "Base Game",
    image: "https://placehold.co/600x800/111827/FFFFFF.png?text=Botany+Manor",
    price: 24.99,
    badges: [{ type: 'now-on-epic', label: 'Now On Epic' }]
  },
  {
    id: 5,
    title: "Brainrot Kart",
    type: "Base Game",
    image: "https://placehold.co/600x800/000000/FFFFFF.png?text=Brainrot+Kart",
    price: 1.49,
    originalPrice: 1.99,
    discount: 25,
  }
];

export default function NewReleasesHorizontal() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-[#0A0E27] py-8 md:py-12">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/new-releases" className="group flex items-center gap-1">
              <h2 className="text-[18px] font-bold text-white md:text-[20px] lg:text-[22px]">
                New Releases
              </h2>
              <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="hidden gap-3 md:flex">
            <button 
              onClick={() => scroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1F3A] text-white hover:bg-[#2D3748] transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1F3A] text-white hover:bg-[#2D3748] transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Grid */}
        <div 
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 scrollbar-hide md:gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game) => (
            <div 
              key={game.id} 
              className="group relative min-w-[160px] max-w-[160px] flex-none snap-start md:min-w-[210px] md:max-w-[210px]"
            >
              {/* Card Image Area */}
              <Link href={`/p/${game.title.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#1A1F3A] shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] group-hover:brightness-110">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 160px, 210px"
                  />
                  
                  {/* Hover Overlay with Add to Wishlist Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-3 right-3">
                      <button 
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white hover:text-black"
                        aria-label="Add to Wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          // Wishlist logic
                        }}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card Content */}
              <div className="mt-3 flex flex-col gap-1">
                {/* Type Label */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0B8D0] opacity-80">
                  {game.type}
                </span>

                {/* Title */}
                <Link href={`/p/${game.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <h3 className="line-clamp-1 truncate text-base font-bold text-white transition-colors group-hover:text-[#00B4FF]">
                    {game.title}
                  </h3>
                </Link>

                {/* Badges */}
                {game.badges && game.badges.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {game.badges.map((badge, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold",
                          badge.type === 'first-run' 
                            ? "bg-[#1A1F3A] border border-[#2D3748] text-white" 
                            : "bg-[#2D3748] text-white"
                        )}
                      >
                        {badge.type === 'first-run' && (
                          <Trophy className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                        )}
                        {badge.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Information */}
                <div className="mt-1 flex items-center flex-wrap gap-2">
                  {game.discount ? (
                    <>
                      <span className="rounded bg-[#00B4FF] px-1.5 py-0.5 text-[11px] font-bold text-white">
                        -{game.discount}%
                      </span>
                      <span className="text-[13px] text-[#B0B8D0] line-through decoration-[#B0B8D0]">
                        {formatCurrency(game.originalPrice || 0)}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(game.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(game.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Spacer for right padding on mobile */}
          <div className="w-1 shrink-0 md:hidden" />
        </div>
      </div>
    </section>
  );
}