export default function TrendingGames() {
  return (
    <section className="w-full py-12 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold font-display text-[var(--color-foreground)] sm:text-[1.75rem]">
            Trending
          </h2>
          
          <div className="flex items-center gap-4">
            {/* View More Button */}
            <a 
              href="#" 
              className="group flex h-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-transparent px-4 text-xs font-bold uppercase tracking-wide text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)] hover:text-white"
            >
              View More
            </a>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)] disabled:opacity-50"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
          {TRENDING_GAMES.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GameCard({ game }: { game: typeof TRENDING_GAMES[0] }) {
  return (
    <div className="group relative flex cursor-pointer flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-[var(--color-card)] shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:brightness-110">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        
        {/* Hover Overlay Gradient (Subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Wishlist Button (Visible on Hover) */}
        <button className="absolute right-3 top-3 flex h-8 w-8 translate-y-2 transform items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 group-hover:translate-y-0 group-hover:opacity-100">
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase text-[var(--color-text-secondary)]">
          {game.label}
        </span>
        <h4 className="truncate text-base font-bold text-[var(--color-foreground)]" title={game.title}>
          {game.title}
        </h4>
        
        {/* Price / Availability Meta */}
        <div className="flex flex-col text-sm text-[var(--color-text-secondary)]">
          {game.releaseDate && (
            <span className="text-xs">{game.releaseDate}</span>
          )}
          
          <div className="mt-1 flex items-center gap-2">
            {game.discountPercentage && (
              <span className="rounded bg-[var(--color-primary)] px-1.5 py-0.5 text-[11px] font-bold text-white">
                -{game.discountPercentage}%
              </span>
            )}
            
            <div className="flex items-center gap-2 text-white">
              {game.originalPrice && (
                <span className="text-[var(--color-text-secondary)] line-through">
                  {game.originalPrice}
                </span>
              )}
              <span>{game.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Data Mock
const TRENDING_GAMES = [
  {
    title: "Out of Words",
    label: "Base Game",
    image: "https://placehold.co/600x800/1e293b/FFFFFF/png?text=Out+of+Words",
    price: "Coming Soon",
    releaseDate: null,
    discountPercentage: null,
    originalPrice: null,
  },
  {
    title: "Lords of the Fallen II",
    label: "Base Game",
    image: "https://placehold.co/600x800/2a1a10/FFFFFF/png?text=Lords+of+the+Fallen+II",
    price: "Coming Soon",
    releaseDate: null,
    discountPercentage: null,
    originalPrice: null,
  },
  {
    title: "Phantom Blade Zero",
    label: "Base Game",
    image: "https://placehold.co/600x800/101010/FFFFFF/png?text=Phantom+Blade+Zero",
    price: "Coming Soon",
    releaseDate: null,
    discountPercentage: null,
    originalPrice: null,
  },
  {
    title: "Resident Evil Requiem",
    label: "Base Game",
    image: "https://placehold.co/600x800/500000/FFFFFF/png?text=Resident+Evil+Requiem",
    price: "$69.99",
    releaseDate: "Available 02/27/26",
    discountPercentage: null,
    originalPrice: null,
  },
  {
    title: "John Carpenter's Toxic Commando",
    label: "Base Game",
    image: "https://placehold.co/600x800/404010/FFFFFF/png?text=Toxic+Commando",
    price: "$39.99",
    releaseDate: "Available 03/12/26",
    discountPercentage: null,
    originalPrice: null,
  },
];

import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';