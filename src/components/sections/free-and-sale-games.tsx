import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";

const FREE_GAMES = [
  {
    id: 1,
    title: "Hogwarts Legacy",
    image: "https://cdn2.unrealengine.com/egs-holidaysale-freegame-fn-gwp-desktop-carousel-asset-1920x1080-d2102e181293.jpg?resize=1&w=854&h=480&quality=medium",
    status: "FREE NOW",
    statusColor: "bg-[#0074E4]", // Epic Blue
    date: "Free Now - Dec 18 at 11:00 AM",
    isMystery: false,
    slug: "hogwarts-legacy"
  },
  {
    id: 2,
    title: "Mystery Game",
    image: null, // Placeholder for mystery game
    status: "MYSTERY GAME",
    statusColor: "bg-black/60 backdrop-blur-sm", // Dark transparent for Mystery
    date: "Unlocking in 04:10:43:36",
    isMystery: true,
    slug: "#"
  }
];

export default function FreeGamesSection() {
  return (
    <section className="w-full bg-background py-8 md:py-12">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
              Free Games
            </h2>
          </div>
          <Link 
            href="/free-games"
            className="group px-4 py-2 rounded-lg border border-white/20 text-sm font-bold text-white hover:bg-white/10 transition-colors duration-200 uppercase tracking-wide"
          >
            View More
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {FREE_GAMES.map((game) => (
            <Link 
              key={game.id} 
              href={game.slug}
              className="group flex flex-col gap-4 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#1A1F3A] transition-all duration-300 md:group-hover:-translate-y-1 md:group-hover:shadow-2xl md:group-hover:shadow-black/50">
                {game.image ? (
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  // Mystery Game Gradient Placeholder
                  <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#383152] via-[#242038] to-[#151221] p-4 flex items-center justify-center">
                    <div className="opacity-10 absolute inset-0 bg-[url('https://cdn2.unrealengine.com/epic-store-logo-384x384-257523190.png')] bg-repeat space-x-4 opacity-5 bg-[length:64px_64px]" />
                    <Gift className="w-16 h-16 text-white/20 animate-pulse" />
                  </div>
                )}
                
                {/* Status Bar Overlay */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-10 md:h-12 flex items-center justify-center ${game.statusColor}`}
                >
                  <span className="text-white text-sm md:text-base font-bold uppercase tracking-widest">
                    {game.status}
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-1">
                <h3 className="text-base md:text-lg font-bold text-white font-display leading-tight group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {game.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}