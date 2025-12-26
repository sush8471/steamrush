export default function TopFreeToPlay() {
  const games = [
    {
      title: "Fortnite",
      image: "https://cdn2.unrealengine.com/egs-fortnite-og-1s7-carousel-desktop-1920x1080-e6ee8ecfe10e.jpg?resize=1&w=150&h=200&quality=medium",
      status: "Free",
    },
    {
      title: "Rocket League®",
      image: "https://cdn2.unrealengine.com/rocket-league-store-portrait-1200x1600-1200x1600-9118c72477c9.jpg?resize=1&w=150&h=200&quality=medium",
      status: "Free",
    },
    {
      title: "Genshin Impact",
      image: "https://cdn2.unrealengine.com/genshin-impact-3-8-asset-pack-1200x1600-1200x1600-47b8508ae302.jpg?resize=1&w=150&h=200&quality=medium",
      status: "Free",
    },
    {
      title: "Wuthering Waves",
      image: "https://cdn2.unrealengine.com/wuthering-waves-portrait-1200x1600-1200x1600-754645c91350.jpg?resize=1&w=150&h=200&quality=medium",
      status: "Free",
    },
    {
      title: "Honkai: Star Rail",
      image: "https://cdn2.unrealengine.com/honkai-star-rail-1-1-asset-pack-1200x1600-1200x1600-7b2447470659.jpg?resize=1&w=150&h=200&quality=medium",
      status: "Free",
    },
  ];

  return (
    <section className="w-full h-full flex flex-col font-body text-foreground">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 group cursor-pointer">
        <h3 className="text-[20px] font-display font-bold text-white tracking-normal leading-[1.4]">
          Top Free to Play
        </h3>
        <button 
          aria-label="View more Top Free to Play games"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Vertical List */}
      <div className="flex flex-col gap-3">
        {games.map((game, index) => (
          <div 
            key={index}
            className="group/item relative flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-card transition-colors cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative shrink-0 w-[64px] h-[85px] rounded-md overflow-hidden bg-muted/20 shadow-sm">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/150x200/1A1F3A/FFFFFF?text=${encodeURIComponent(game.title)}`;
                }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center flex-grow min-w-0 gap-1.5">
              <h4 className="text-[16px] font-medium text-white truncate group-hover/item:text-primary transition-colors leading-[1.4]">
                {game.title}
              </h4>
              
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-blue-500 rounded-sm">
                  {game.status}
                </span>
              </div>
            </div>

            {/* Hover Action Button */}
            <button 
              aria-label={`Add ${game.title} to wishlist`}
              className="absolute right-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-white text-white hover:text-black shadow-lg"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}