import { ChevronRight, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Types
interface Game {
  id: number;
  title: string;
  image: string;
  status: string;
  badge?: "First Run" | null;
  releaseDate?: string;
  price?: string;
}

// Mock Data matching the provided content and design instructions
const TOP_WISHLISTED_GAMES: Game[] = [
  {
    id: 1,
    title: "MONGIL: STAR DIVE",
    image: "https://placehold.co/300x400/1A1F3A/FFFFFF/png?text=MONGIL",
    status: "Coming Soon",
    badge: "First Run",
  },
  {
    id: 2,
    title: "Tides of Annihilation",
    image: "https://placehold.co/300x400/2D3748/FFFFFF/png?text=Tides",
    status: "Coming Soon",
  },
  {
    id: 3,
    title: "Subnautica 2",
    image: "https://placehold.co/300x400/2D3748/FFFFFF/png?text=Subnautica+2",
    status: "Coming Soon",
  },
  {
    id: 4,
    title: "Out of Words",
    image: "https://placehold.co/300x400/2D3748/FFFFFF/png?text=Out+of+Words",
    status: "Coming Soon",
  },
  {
    id: 5,
    title: "Jurassic Park: Survival",
    image: "https://placehold.co/300x400/2D3748/FFFFFF/png?text=Jurassic+Park",
    status: "Coming Soon",
  },
];

export default function TopWishlistedSection() {
  return (
    <div className="w-full flex justify-center py-12 bg-background">
      {/* 
        This component typically sits in a 3-column grid in the full page layout.
        We wrap it in a container that effectively mimics one of those columns
        for the sake of the standalone clone, but keep it flexible (w-full).
      */}
      <div className="w-full max-w-sm md:max-w-md lg:max-w-[420px] px-4 md:px-0">
        <Header />
        <div className="flex flex-col gap-0 mt-4">
          {TOP_WISHLISTED_GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between mb-2">
      <Link 
        href="#" 
        className="group flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200"
      >
        <h2 className="text-[1.25rem] md:text-[20px] font-bold font-display tracking-normal">
          Top Upcoming Wishlisted
        </h2>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href="#"
      className="group relative flex items-center gap-4 py-3.5 px-3 -mx-3 rounded-[12px] hover:bg-white/[0.06] transition-all duration-200 ease-out"
    >
      {/* Game Cover */}
      <div className="relative shrink-0 w-[60px] h-[80px] rounded-md overflow-hidden bg-card shadow-sm group-hover:shadow-md transition-shadow">
        <Image
          src={game.image}
          alt={game.title}
          width={60}
          height={80}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter brightness-90 group-hover:brightness-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-1.5 min-w-0">
        <h3 className="font-body text-[15px] leading-tight font-medium text-foreground truncate pr-2 group-hover:text-primary transition-colors">
          {game.title}
        </h3>
        
        <div className="flex flex-col items-start gap-1.5">
          {game.badge === "First Run" && (
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-black/40 border border-white/10 shrink-0">
              <Crown className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#FFD700] leading-none mb-[1px]">
                First Run
              </span>
            </div>
          )}
          
          <span className="text-[12px] text-muted-foreground font-medium">
            {game.status}
          </span>
        </div>
      </div>

      {/* Hover Plus Icon (Implicit specific interaction often seen on Epic, added for polish) */}
      <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-8 h-8 rounded-full bg-background/80 flex items-center justify-center shadow-sm backdrop-blur-sm border border-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
      </div>
    </Link>
  );
}