<file_path>
src/components/sections/top-addons.tsx
</file_path>

<content>
'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

// Types for our data
interface AddOnItem {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  imageColor: string;
  imageAccent: string;
}

// Mock data based on the content detection
const ADD_ON_ITEMS: AddOnItem[] = [
  {
    id: '1',
    title: 'Oneiric Shard ×6480',
    price: '$99.99',
    imageColor: 'from-indigo-600 to-purple-700',
    imageAccent: 'bg-indigo-500',
  },
  {
    id: '2',
    title: "Shaka Surfin' Pack",
    price: '$4.49',
    imageColor: 'from-blue-400 to-cyan-500',
    imageAccent: 'bg-cyan-400',
  },
  {
    id: '3',
    title: 'Hogwarts Legacy: Dark Arts Pack',
    price: '$7.99',
    originalPrice: '$19.99',
    discount: '-60%',
    imageColor: 'from-slate-800 to-slate-900',
    imageAccent: 'bg-slate-700',
  },
  {
    id: '4',
    title: 'Polar Legends Pack',
    price: '$19.99',
    imageColor: 'from-sky-300 to-blue-500',
    imageAccent: 'bg-sky-400',
  },
  {
    id: '5',
    title: 'Agency Renegades Pack',
    price: '$19.99',
    imageColor: 'from-red-600 to-slate-900',
    imageAccent: 'bg-red-500',
  },
  {
    id: '6',
    title: 'Midnight Drive Bundle',
    price: '$14.99',
    originalPrice: '$29.99',
    discount: '-50%',
    imageColor: 'from-fuchsia-600 to-pink-600',
    imageAccent: 'bg-pink-500',
  }
];

export default function TopAddonsSection() {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLe < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full py-8 md:py-12 bg-[#0A0E27] text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-[1440px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="#" className="group flex items-center gap-2">
            <h2 className="text-[18px] md:text-[22px] font-bold font-display tracking-tight text-white group-hover:text-[#00B4FF] transition-colors">
              Top Add-Ons
            </h2>
            <ChevronRight className="w-5 h-5 text-white group-hover:text-[#00B4FF] group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                canScrollLeft 
                  ? "bg-[#1A1F3A] hover:bg-[#2D3748] text-white cursor-pointer" 
                  : "bg-[#1A1F3A]/50 text-gray-500 cursor-default"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                canScrollRight
                  ? "bg-[#1A1F3A] hover:bg-[#2D3748] text-white cursor-pointer" 
                  : "bg-[#1A1F3A]/50 text-gray-500 cursor-default"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <ul 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex space-x-4 md:space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ADD_ON_ITEMS.map((item) => (
            <li 
              key={item.id} 
              className="flex-none w-[160px] md:w-[200px] lg:w-[220px] snap-start group"
            >
              <Link href="#" className="block h-full">
                {/* Card Top: Image */}
                <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden mb-3 md:mb-4 bg-[#1A1F3A] shadow-lg transition-all duration-300 group-hover:translate-y-[-4px] group-hover:shadow-2xl group-hover:shadow-black/50">
                  {/* Placeholder Gradient Art */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
                    item.imageColor
                  )}>
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    {/* Abstract Shapes for visual interest */}
                    <div className={cn("absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full opacity-20 blur-2xl", item.imageAccent)}></div>
                    <div className={cn("absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-xl bg-white")}></div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors duration-300"></div>

                  {/* Wishlist Button (Overlay) */}
                  <button 
                    className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 z-10"
                    aria-label="Add to Wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add wishlist logic here
                    }}
                  >
                     <PlusCircle className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-md fill-black/20" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm md:text-base font-medium leading-[1.4] text-white line-clamp-2 min-h-[2.8em] group-hover:text-[#00B4FF] transition-colors font-display">
                    {item.title}
                  </h3>
                  
                  {/* Price Row */}
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    {item.discount && (
                      <span className="bg-[#00B4FF] text-white text-[11px] md:text-xs font-bold px-[6px] py-[2px] rounded-[4px]">
                        {item.discount}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2">
                       {item.originalPrice && (
                        <span className="text-[11px] md:text-xs text-[#B0B8D0] line-through font-medium">
                          {item.originalPrice}
                        </span>
                      )}
                      <span className="text-sm md:text-[15px] font-medium text-white">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        
      </div>
    </section>
  );
}
</content>