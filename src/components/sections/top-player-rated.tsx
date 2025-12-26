import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

const GAMES = [
  {
    id: 1,
    title: "RAYMAN® LEGENDS",
    image: "https://placehold.co/480x640/2D3748/FFFFFF/png?text=Rayman+Legends",
    price: "$29.99",
    originalPrice: null,
    discount: null,
    isFree: false,
  },
  {
    id: 2,
    title: "Hades II",
    image: "https://placehold.co/480x640/2D3748/FFFFFF/png?text=Hades+II",
    price: "$23.99",
    originalPrice: "$29.99",
    discount: "-20%",
    isFree: false,
  },
  {
    id: 3,
    title: "FTL: Faster Than Light",
    image: "https://placehold.co/480x640/2D3748/FFFFFF/png?text=FTL",
    price: "$2.49",
    originalPrice: "$9.99",
    discount: "-75%",
    isFree: false,
  },
  {
    id: 4,
    title: "RimWorld",
    image: "https://placehold.co/480x640/2D3748/FFFFFF/png?text=RimWorld",
    price: "$27.99",
    originalPrice: "$34.99",
    discount: "-20%",
    isFree: false,
  },
  {
    id: 5,
    title: "Dating Killmulator",
    image: "https://placehold.co/480x640/2D3748/FFFFFF/png?text=Dating+Killmulator",
    price: "Free",
    originalPrice: null,
    discount: null,
    isFree: true,
  }
];

/**
 * TopPlayerRated Section Component
 * Displays a horizontally scrollable list of highly-rated games.
 */
export default function TopPlayerRated() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Scroll handler for button clicks
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of view width
      
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Update arrow visibility on scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // buffer of 10px
    }
  };

  return (
    <section className="w-full bg-[var(--color-background)] py-10 text-[var(--color-foreground)]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold md:text-2xl">
              Top Player Rated
            </h2>
            <ChevronRight className="h-5 w-5 cursor-pointer text-[var(--color-muted)] hover:text-white md:hidden" />
          </div>
          
          {/* Desktop Navigation Arrows */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              aria-label="Previous items"
              className={`rounded-full bg-[var(--color-card)] p-2 transition-colors duration-200 ${
                !showLeftArrow 
                  ? 'cursor-default opacity-50 text-[var(--color-muted)]' 
                  : 'cursor-pointer hover:bg-[var(--color-border)] hover:text-white text-white'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              aria-label="Next items"
              className={`rounded-full bg-[var(--color-card)] p-2 transition-colors duration-200 ${
                !showRightArrow 
                  ? 'cursor-default opacity-50 text-[var(--color-muted)]' 
                  : 'cursor-pointer hover:bg-[var(--color-border)] hover:text-white text-white'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {GAMES.map((game) => (
            <div 
              key={game.id} 
              className="group relative flex w-[calc(40%-12px)] flex-none snap-start flex-col sm:w-[calc(33.333%-16px)] md:w-[calc(25%-16px)] lg:w-[calc(20%-16px)]"
            >
              {/* Card Image Area */}
              <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl bg-[var(--color-card)] shadow-lg transition-transform duration-300 ease-out md:group-hover:-translate-y-1 md:group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                {/* Image Placeholder/Actual Image */}
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:brightness-110"
                  sizes="(max-width: 640px) 40vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />

                {/* Overlay Gradient on Hover (Optional, subtle) */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-white/5" />

                {/* Wishlist Button - Visible on Group Hover */}
                <button
                  aria-label="Add to Wishlist"
                  className="absolute right-2 top-2 z-10 translate-y-[-10px] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <div className="rounded-full bg-black/60 p-1 text-white backdrop-blur-sm hover:text-[var(--color-primary)]">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                </button>
              </div>

              {/* Card Content Area */}
              <div className="flex flex-col gap-1">
                <span className="font-display text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  Base Game
                </span>
                <h3 className="line-clamp-1 font-display text-sm font-bold text-[var(--color-foreground)] md:text-base">
                  {game.title}
                </h3>
                
                {/* Price Information */}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {game.discount && (
                    <span className="rounded bg-[var(--color-primary)] px-1.5 py-0.5 text-[11px] font-bold text-white">
                      {game.discount}
                    </span>
                  )}
                  
                  {game.originalPrice && (
                    <span className="text-xs text-[var(--color-muted)] line-through">
                      {game.originalPrice}
                    </span>
                  )}
                  
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {game.price}
                  </span>
                </div>
              </div>
              
              {/* Invisible Full Card Link */}
              <a 
                href="#" 
                className="absolute inset-0 z-0" 
                aria-label={`View details for ${game.title}`}
              ></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}