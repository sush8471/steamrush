export default function ComingSoonGames() {
  return (
    <ComingSoonSection />
  );
}

// Client component for interactivity
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  releaseDate: string;
  image: string;
  status: string;
  type: string;
}

const games: Game[] = [
  {
    id: '1',
    title: 'Aaero2',
    releaseDate: 'Available 12/16/25',
    image: 'https://placehold.co/600x800/1A1F3A/FFFFFF?text=Aaero2',
    status: 'Coming Soon',
    type: 'Base Game',
  },
  {
    id: '2',
    title: 'Super-B',
    releaseDate: 'Available 12/18/25',
    image: 'https://placehold.co/600x800/1A1F3A/FFFFFF?text=Super-B',
    status: 'Coming Soon',
    type: 'Base Game',
  },
  {
    id: '3',
    title: 'Tales from The Dancing Moon',
    releaseDate: 'Available 12/18/25',
    image: 'https://placehold.co/600x800/1A1F3A/FFFFFF?text=Tales+Desc.',
    status: 'Coming Soon',
    type: 'Base Game',
  },
  {
    id: '4',
    title: 'nightreaper2',
    releaseDate: 'Available 12/19/25',
    image: 'https://placehold.co/600x800/1A1F3A/FFFFFF?text=nightreaper2',
    status: 'Coming Soon',
    type: 'Base Game',
  },
  {
    id: '5',
    title: 'KAKU: Ancient Seal',
    releaseDate: 'Available 12/18/25',
    image: 'https://placehold.co/600x800/1A1F3A/FFFFFF?text=KAKU',
    status: 'Coming Soon',
    type: 'Base Game',
  },
];

function ComingSoonSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of view
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-[#0A0E27] py-12 text-[#FFFFFF]">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h2 className="text-[1.5rem] md:text-[2.25rem] font-bold tracking-tight text-white font-display group-hover:opacity-90 transition-opacity">
              Coming Soon
            </h2>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#FFFFFF] group-hover:translate-x-1 transition-transform duration-300 mt-1" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              aria-label="Previous slide"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#2D3748] transition-colors hover:bg-[#4A5568] disabled:opacity-50 disabled:cursor-not-allowed ${
                !showLeftArrow ? 'opacity-50' : ''
              }`}
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              aria-label="Next slide"
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#2D3748] transition-colors hover:bg-[#4A5568] disabled:opacity-50 disabled:cursor-not-allowed ${
                !showRightArrow ? 'opacity-50' : ''
              }`}
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Grid */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative flex-none w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(20%-19.2px)] snap-start"
            >
              <Link href="#" className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-[#2D3748] shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-white/5">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button 
                      aria-label="Add to Wishlist"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-white hover:bg-[#00B4FF] hover:text-white transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to wishlist logic
                      }}
                    >
                      <PlusCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3 md:mt-4 flex flex-col gap-1">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#B0B8D0]">
                    {game.type}
                  </span>
                  <h3 className="line-clamp-1 text-base font-bold leading-tight text-white group-hover:text-[#00B4FF] transition-colors font-display">
                    {game.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    {game.releaseDate && (
                      <span className="text-[#B0B8D0] text-[12px] md:text-[14px]">
                        {game.releaseDate}
                      </span>
                    )}
                  </div>
                  {/* Status Label if needed */}
                  {/* <div className="mt-2 flex">
                    <span className="rounded-sm bg-[#2D3748] px-2 py-0.5 text-[11px] font-medium text-white">
                      Coming Soon
                    </span>
                  </div> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}