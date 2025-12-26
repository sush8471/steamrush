export default function MostPopularSection() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-[#0A0E27] py-10">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Most Popular</h2>
            <ChevronRight className="h-4 w-4 text-[#B0B8D0] sm:h-5 sm:w-5" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1F3A] text-white transition-colors hover:bg-[#2D3748] active:scale-95 disabled:opacity-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1F3A] text-white transition-colors hover:bg-[#2D3748] active:scale-95 disabled:opacity-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0"
        >
          {GAMES.map((game, index) => (
            <GameCard key={game.id} game={game} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GameCard({ game, priority }: { game: Game; priority: boolean }) {
  return (
    <div className="group relative flex min-w-[200px] max-w-[240px] flex-none snap-start flex-col gap-3 sm:min-w-[220px] md:w-[calc((100%-80px)/6)]">
      {/* Image Container */}
      <a href="#" className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#1A1F3A] shadow-lg transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:brightness-110">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 640px) 200px, (max-width: 1024px) 220px, 260px"
          priority={priority}
        />
        
        {/* Wishlist Button Overlay (Visible on Hover/Focus usually, adding standardized overlay) */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-[#00B4FF]"
            aria-label="Add to Wishlist"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        </div>
      </a>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0B8D0] opacity-80">
          {game.type}
        </span>
        <a href="#" className="line-clamp-2 text-sm font-bold leading-tight text-white transition-colors hover:text-[#00B4FF]">
          {game.title}
        </a>
        
        {/* Price Section */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {game.discount && (
            <span className="rounded bg-[#0074E4] px-1.5 py-0.5 text-xs font-bold text-white">
              {game.discount}
            </span>
          )}
          
          {game.originalPrice && (
            <span className="text-xs text-[#B0B8D0] line-through decoration-[#B0B8D0]">
              {game.originalPrice}
            </span>
          )}
          
          <span className="text-sm font-bold text-white">
            {game.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// Data & Types
import React from 'react';

interface Game {
  id: string;
  title: string;
  type: string;
  image: string;
  price: string;
  originalPrice?: string;
  discount?: string;
}

const GAMES: Game[] = [
  {
    id: '1',
    title: 'Hogwarts Legacy: Digital Deluxe Edition',
    type: 'Edition',
    image: 'https://placehold.co/600x800/2a1b3d/ffffff?text=Hogwarts+Legacy',
    price: '$69.99',
  },
  {
    id: '2',
    title: 'Grand Theft Auto V Enhanced',
    type: 'Base Game',
    image: 'https://placehold.co/600x800/164e26/ffffff?text=GTA+V',
    price: '$14.99',
    originalPrice: '$29.99',
    discount: '-50%',
  },
  {
    id: '3',
    title: 'VALORANT',
    type: 'Base Game',
    image: 'https://placehold.co/600x800/ff4655/ffffff?text=VALORANT',
    price: 'Free',
  },
  {
    id: '4',
    title: 'Marvel Rivals',
    type: 'Base Game',
    image: 'https://placehold.co/600x800/a31f1e/ffffff?text=Marvel+Rivals',
    price: 'Free',
  },
  {
    id: '5',
    title: 'Crosshair X',
    type: 'Base Game',
    image: 'https://placehold.co/600x800/1f4068/ffffff?text=Crosshair+X',
    price: '$4.99',
  },
  {
    id: '6',
    title: 'Crosshair V2',
    type: 'Base Game',
    image: 'https://placehold.co/600x800/0f0f0f/ffffff?text=Crosshair+V2',
    price: 'Free',
  },
];