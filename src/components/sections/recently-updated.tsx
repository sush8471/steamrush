export default function RecentlyUpdated() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Approximate card width + gap
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const games = [
    {
      title: "Apex Legends™",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Apex+Legends"
    },
    {
      title: "Path of Exile 2",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Path+of+Exile+2"
    },
    {
      title: "Marvel Rivals",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Marvel+Rivals"
    },
    {
      title: "Asphalt Legends",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Asphalt+Legends"
    },
    {
      title: "Dead by Daylight",
      type: "Base Game",
      price: "$19.99",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Dead+by+Daylight"
    },
    {
      title: "Warframe",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Warframe"
    },
    {
      title: "Rocket League®",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Rocket+League"
    },
     {
      title: "Fortnite",
      type: "Base Game",
      price: "Free",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Fortnite"
    }
  ];

  return (
    <section className="w-full py-8 md:py-12 bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white hover:text-accent transition-colors cursor-pointer">
              Recently Updated
            </h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-white transition-colors cursor-pointer mt-1" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="group flex h-8 w-8 items-center justify-center rounded-full bg-card hover:bg-muted/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-white transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="group flex h-8 w-8 items-center justify-center rounded-full bg-card hover:bg-muted/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game, index) => (
            <div
              key={index}
              className="flex-none w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] snap-start group cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-card shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Hover Overlay */}
                <div className="absolute inset-0 z-10 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
                
                {/* Add to Wishlist Button (Hidden by default, shown on hover) */}
                <button className="absolute right-2 top-2 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/50 hover:bg-black/70 rounded-full p-1 text-white backdrop-blur-sm">
                   <PlusCircle className="w-6 h-6" />
                </button>

                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              </div>

              <div className="mt-3 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  {game.type}
                </span>
                <h3 className="text-sm md:text-base font-bold leading-tight text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs md:text-sm font-medium text-white/90">
                    {game.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';