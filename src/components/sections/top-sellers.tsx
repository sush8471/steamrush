export default function TopSellersSection() {
  return (
    <section className="bg-background text-foreground py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Top Sellers Column */}
          <GameListColumn 
            title="Top Sellers" 
            games={topSellersData} 
            viewMoreSlug="/top-sellers"
          />

          {/* Most Played Column */}
          <GameListColumn 
            title="Most Played" 
            games={mostPlayedData} 
            viewMoreSlug="/most-played"
          />

          {/* Top Upcoming Wishlisted Column */}
          <GameListColumn 
            title="Top Upcoming Wishlisted" 
            games={topUpcomingData} 
            viewMoreSlug="/upcoming"
          />
        </div>
      </div>
    </section>
  );
}

// --- Components ---

interface Game {
  id: string;
  title: string;
  coverImage: string;
  price: string | null;
  originalPrice: string | null;
  discount: string | null;
  isFree: boolean;
  status: string | null;
}

const GameListColumn = ({ 
  title, 
  games, 
  viewMoreSlug 
}: { 
  title: string; 
  games: Game[];
  viewMoreSlug: string;
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <h2 className="flex items-center justify-between py-4 mb-2 group cursor-pointer select-none">
        <span className="text-[20px] md:text-[22px] font-bold leading-tight tracking-normal text-white group-hover:translate-x-1 transition-transform duration-300">
          {title}
        </span>
        <button 
          className="text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-border rounded-full hover:bg-white/10"
          aria-label={`View more ${title}`}
        >
          View More
        </button>
      </h2>

      {/* List */}
      <div className="flex flex-col gap-0.5">
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} />
        ))}
      </div>
    </div>
  );
};

const GameCard = ({ game, index }: { game: Game; index: number }) => {
  return (
    <Link 
      href="#" 
      className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-card/60 transition-colors duration-200 relative isolate"
    >
      {/* Image */}
      <div className="relative h-[85px] w-[64px] flex-shrink-0 rounded-lg overflow-hidden bg-secondary shadow-md group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
        <Image
          src={game.coverImage}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="64px"
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center flex-grow min-w-0 py-0.5 gap-1.5">
        <h3 className="text-[15px] font-normal leading-snug text-foreground truncate pr-6 group-hover:text-white">
          {game.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2">
          {game.status ? (
            <span className="text-[13px] text-muted-foreground font-light">
              {game.status}
            </span>
          ) : (
            <>
              {game.discount && (
                <span className="bg-primary text-[#000000] text-[11px] font-bold px-1.5 py-[2px] rounded-[4px] leading-tight flex items-center justify-center">
                  {game.discount}
                </span>
              )}
              
              <div className="flex items-center gap-2">
                {game.originalPrice && (
                  <span className="text-[13px] text-muted-foreground line-through decoration-muted-foreground/60">
                    {game.originalPrice}
                  </span>
                )}
                
                <span className="text-[13px] text-white font-medium">
                  {game.isFree ? "Free" : game.price}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add to Wishlist / Quick Action Hover */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/0 p-2">
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer" aria-label="Add to wishlist">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-4 h-4 translate-y-[0.5px]"
          >
             <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

// --- Mock Data ---

const topSellersData: Game[] = [
  {
    id: "fc26",
    title: "EA SPORTS FC™ 26 Standard Edition",
    coverImage: "https://placehold.co/128x170/1a1f3a/ffffff?text=FC26",
    price: "$27.99",
    originalPrice: "$69.99",
    discount: "-60%",
    status: null,
    isFree: false,
  },
  {
    id: "arc-raiders",
    title: "ARC Raiders",
    coverImage: "https://placehold.co/128x170/232946/ffffff?text=ARC",
    price: "$31.99",
    originalPrice: "$39.99",
    discount: "-20%",
    status: null,
    isFree: false,
  },
  {
    id: "battlefield-6",
    title: "Battlefield™ 6",
    coverImage: "https://placehold.co/128x170/2d3748/ffffff?text=BF6",
    price: "$48.99",
    originalPrice: "$69.99",
    discount: "-30%",
    status: null,
    isFree: false,
  },
  {
    id: "gta-v",
    title: "Grand Theft Auto V Enhanced",
    coverImage: "https://placehold.co/128x170/000000/ffffff?text=GTA+V",
    price: "$14.99",
    originalPrice: "$29.99",
    discount: "-50%",
    status: null,
    isFree: false,
  },
  {
    id: "rdr2",
    title: "Red Dead Redemption 2",
    coverImage: "https://placehold.co/128x170/8b0000/ffffff?text=RDR2",
    price: "$14.99",
    originalPrice: "$59.99",
    discount: "-75%",
    status: null,
    isFree: false,
  },
];

const mostPlayedData: Game[] = [
  {
    id: "fortnite",
    title: "Fortnite",
    coverImage: "https://placehold.co/128x170/00b4ff/ffffff?text=Fortnite",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Free",
    isFree: true,
  },
  {
    id: "hogwarts",
    title: "Hogwarts Legacy",
    coverImage: "https://placehold.co/128x170/2d2d2d/ffffff?text=Hogwarts",
    price: "Free",
    originalPrice: null,
    discount: null,
    status: "Free Now",
    isFree: true,
  },
  {
    id: "rocket-league",
    title: "Rocket League®",
    coverImage: "https://placehold.co/128x170/0055ff/ffffff?text=Rocket",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Free",
    isFree: true,
  },
  {
    id: "gta-v-mp",
    title: "Grand Theft Auto V Enhanced",
    coverImage: "https://placehold.co/128x170/000000/ffffff?text=GTA+V",
    price: "$14.99",
    originalPrice: "$29.99",
    discount: "-50%",
    status: null,
    isFree: false,
  },
  {
    id: "genshin",
    title: "Genshin Impact",
    coverImage: "https://placehold.co/128x170/f4d03f/000000?text=Genshin",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Free",
    isFree: true,
  },
];

const topUpcomingData: Game[] = [
  {
    id: "mongil",
    title: "MONGIL: STAR DIVE",
    coverImage: "https://placehold.co/128x170/4a148c/ffffff?text=MONGIL",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Coming Soon",
    isFree: false,
  },
  {
    id: "tides",
    title: "Tides of Annihilation",
    coverImage: "https://placehold.co/128x170/145a32/ffffff?text=Tides",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Coming Soon",
    isFree: false,
  },
  {
    id: "subnautica",
    title: "Subnautica 2",
    coverImage: "https://placehold.co/128x170/0b5345/ffffff?text=Subnautica",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Coming Soon",
    isFree: false,
  },
  {
    id: "out-of-words",
    title: "Out of Words",
    coverImage: "https://placehold.co/128x170/9c640c/ffffff?text=Words",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Coming Soon",
    isFree: false,
  },
  {
    id: "jurassic",
    title: "Jurassic Park: Survival",
    coverImage: "https://placehold.co/128x170/1b2631/ffffff?text=Jurassic",
    price: null,
    originalPrice: null,
    discount: null,
    status: "Coming Soon",
    isFree: false,
  },
];