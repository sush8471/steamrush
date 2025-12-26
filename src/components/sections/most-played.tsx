import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, PlusCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- Types ---

interface GameData {
  id: string;
  title: string;
  coverImage: string;
  originalPrice?: number;
  currentPrice: number | 'Free';
  discountPercentage?: number;
}

interface GameListProps {
  title: string;
  games: GameData[];
  viewMoreLink: string;
}

// --- Mock Data ---

// Asset mappings (using real URLs found in context where possible, fallbacks otherwise)
const images = {
  fortnite: "https://cdn2.unrealengine.com/egs-fortnite-og-1s7-carousel-desktop-1920x1080-e6ee8ecfe10e.jpg?resize=1&w=300&h=400&quality=medium",
  hogwarts: "https://cdn2.unrealengine.com/egs-holidaysale-freegame-fn-gwp-desktop-carousel-asset-1920x1080-d2102e181293.jpg?resize=1&w=300&h=400&quality=medium",
  battlefield: "https://cdn2.unrealengine.com/egs-battlefield-6-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
  eafc: "https://cdn2.unrealengine.com/egs-ea-fc-26-carousel-desktop-1920x1080-cebdf43100f5.jpg?resize=1&w=300&h=400&quality=medium",
  outofwords: "https://cdn2.unrealengine.com/egs-out-of-words-flying-carousel-1920x1080-628cc4bda5c8.jpg?resize=1&w=300&h=400&quality=medium",
  generic: "https://cdn2.unrealengine.com/epic-games-store/static/webpack/img/placeholder_game_cover.png", // Fallback URL pattern
};

// Top Sellers Data
const topSellers: GameData[] = [
  {
    id: "ea-fc-26",
    title: "EA SPORTS FC™ 26 Standard Edition",
    coverImage: images.eafc,
    originalPrice: 69.99,
    currentPrice: 27.99,
    discountPercentage: 60,
  },
  {
    id: "arc-raiders",
    title: "ARC Raiders",
    coverImage: "https://cdn2.unrealengine.com/egs-arc-raiders-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium", // Deduced URL pattern or placeholder
    originalPrice: 39.99,
    currentPrice: 31.99,
    discountPercentage: 20,
  },
  {
    id: "battlefield-6",
    title: "Battlefield™ 6",
    coverImage: images.battlefield,
    originalPrice: 69.99,
    currentPrice: 48.99,
    discountPercentage: 30,
  },
  {
    id: "gta-v",
    title: "Grand Theft Auto V Enhanced",
    coverImage: "https://cdn2.unrealengine.com/grand-theft-auto-v-premium-edition-1-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium", 
    originalPrice: 29.99,
    currentPrice: 14.99,
    discountPercentage: 50,
  },
  {
    id: "rdr2",
    title: "Red Dead Redemption 2",
    coverImage: "https://cdn2.unrealengine.com/egs-red-dead-redemption-2-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    originalPrice: 59.99,
    currentPrice: 14.99,
    discountPercentage: 75,
  },
];

// Most Played Data (Target Section)
const mostPlayed: GameData[] = [
  {
    id: "fortnite",
    title: "Fortnite",
    coverImage: images.fortnite,
    currentPrice: "Free",
  },
  {
    id: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    coverImage: images.hogwarts,
    originalPrice: 59.99,
    currentPrice: "Free",
    discountPercentage: 100,
  },
  {
    id: "rocket-league",
    title: "Rocket League®",
    coverImage: "https://cdn2.unrealengine.com/rocket-league-start-screen-1920x1080-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    currentPrice: "Free",
  },
  {
    id: "gta-v-mp",
    title: "Grand Theft Auto V Enhanced",
    coverImage: "https://cdn2.unrealengine.com/grand-theft-auto-v-premium-edition-1-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    originalPrice: 29.99,
    currentPrice: 14.99,
    discountPercentage: 50,
  },
  {
    id: "genshin-impact",
    title: "Genshin Impact",
    coverImage: "https://cdn2.unrealengine.com/genshin-impact-4-3-asset-1920x1080-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    currentPrice: "Free",
  },
];

// Top Upcoming Data
const topUpcoming: GameData[] = [
  {
    id: "mongil",
    title: "MONGIL: STAR DIVE",
    coverImage: "https://cdn2.unrealengine.com/mongil-star-dive-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    currentPrice: "Free", // Placeholder status for upcoming
  },
  {
    id: "tides",
    title: "Tides of Annihilation",
    coverImage: "https://cdn2.unrealengine.com/tides-of-annihilation-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    currentPrice: "Free",
  },
  {
    id: "subnautica-2",
    title: "Subnautica 2",
    coverImage: "https://cdn2.unrealengine.com/subnautica-2-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    currentPrice: "Free",
  },
  {
    id: "out-of-words",
    title: "Out of Words",
    coverImage: images.outofwords,
    currentPrice: "Free",
  },
  {
    id: "jurassic-park",
    title: "Jurassic Park: Survival",
    coverImage: "https://cdn2.unrealengine.com/jurassic-park-survival-1920x1080-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
    currentPrice: "Free",
  },
];

// --- Components ---

const GameList = ({ title, games, viewMoreLink }: GameListProps) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* List Header */}
      <div className="flex items-center justify-between py-2 group cursor-pointer">
        <div className="flex items-center gap-2">
          <h3 className="text-[18px] md:text-[22px] font-bold text-white tracking-tight">{title}</h3>
          <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
        </div>
        <Link 
          href={viewMoreLink} 
          className="hidden md:inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white border border-white/20 rounded hover:bg-white/10 transition-colors"
        >
          View More
        </Link>
      </div>

      {/* List Items */}
      <div className="flex flex-col gap-5">
        {games.map((game) => (
          <Link 
            key={game.id} 
            href={`/p/${game.id}`}
            className="group flex flex-row gap-4 items-center bg-transparent hover:bg-white/[0.04] p-2 -mx-2 rounded-lg transition-colors duration-200"
          >
            {/* Thumbnail */}
            <div className="relative w-[60px] h-[80px] flex-shrink-0 overflow-hidden rounded-[4px] bg-[#1A1F3A]">
              <Image 
                src={game.coverImage} 
                alt={game.title}
                fill
                sizes="60px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  // Fallback to placeholder color if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.backgroundColor = '#1e293b';
                }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center gap-1.5 flex-grow min-w-0">
              <h4 className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
                {game.title}
              </h4>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Discount Badge */}
                {game.discountPercentage && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-[#0074E4] text-white text-[11px] font-bold leading-none">
                    -{game.discountPercentage}%
                  </span>
                )}
                
                {/* Prices */}
                <div className="flex items-center gap-2 text-xs">
                  {game.originalPrice && (
                    <span className="text-[#B0B8D0] line-through decoration-1">
                      ${game.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className={cn(
                    "font-medium",
                    game.currentPrice === 'Free' ? "text-white" : "text-white"
                  )}>
                    {typeof game.currentPrice === 'number' 
                      ? `$${game.currentPrice.toFixed(2)}` 
                      : (
                        <span className="text-white">Free</span>
                      )
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Hover visual cue (optional plus button or similar often seen in these designs, though not explicitly in prompt, keeping clean) */}
            {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <PlusCircle className="w-5 h-5 text-white/50" />
            </div> */}
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- Main Layout Section ---

export default function MostPlayedSection() {
  return (
    <section className="w-full bg-[#0A0E27] text-foreground font-sans py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1440px]">
        {/*
          The design shows three columns side-by-side.
          Usually: Top Sellers | Most Played | Top Upcoming
          Each column is roughly equal width.
          On mobile, they stack text.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12 relative">
          
          {/* Column 1: Top Sellers */}
          <div className="relative">
             <GameList 
              title="Top Sellers" 
              games={topSellers} 
              viewMoreLink="/collection/top-sellers"
            />
            {/* Vertical Divider for desktop */}
            <div className="hidden lg:block absolute right-[-24px] top-4 bottom-0 w-[1px] bg-[#2D3748]" />
          </div>

          {/* Column 2: Most Played (Target) */}
          <div className="relative">
            <GameList 
              title="Most Played" 
              games={mostPlayed} 
              viewMoreLink="/collection/most-played"
            />
             {/* Vertical Divider for desktop */}
            <div className="hidden lg:block absolute right-[-24px] top-4 bottom-0 w-[1px] bg-[#2D3748]" />
          </div>

          {/* Column 3: Top Upcoming */}
          <div className="relative">
            <GameList 
              title="Top Upcoming Wishlisted" 
              games={topUpcoming} 
              viewMoreLink="/collection/top-upcoming"
            />
          </div>

        </div>
      </div>
    </section>
  );
}