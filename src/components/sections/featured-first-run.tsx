export default function FeaturedFirstRun() {
  const games = [
    {
      title: "Super Miaoyin",
      image: "https://cdn1.epicgames.com/spt-assets/7b949980d0d8442da664531818d69784/super-miaoyin-1q8q7.png",
      price: "$2.49",
      originalPrice: null,
      discount: null,
      type: "Base Game",
      tag: "First Run",
    },
    {
      title: "Atlas Wars",
      image: "https://cdn1.epicgames.com/spt-assets/433878b6680a424a87754b5df5b72186/atlas-wars-15j5l.jpg",
      price: "Free",
      originalPrice: null,
      discount: null,
      type: "Base Game",
      tag: "First Run",
    },
    {
      title: "Countrytale 2010",
      image: "https://cdn1.epicgames.com/spt-assets/8e04664883904077a9442a033f214436/countrytale-2010-1c0v8.png",
      price: "$0.99",
      originalPrice: "$19.99",
      discount: "-95%",
      type: "Base Game",
      tag: "First Run",
    },
    {
      title: "Scientific project: Optic",
      image: "https://cdn1.epicgames.com/spt-assets/bc266687445c47948a39d89163073351/scientific-project-optic-12d47.jpg",
      price: "$17.99",
      originalPrice: null,
      discount: null,
      type: "Base Game",
      tag: "First Run",
      overlay: "Early Access",
    },
    {
      title: "Space Road: Elite",
      image: "https://cdn1.epicgames.com/spt-assets/2fd0456102da4028ace78848f0868779/space-road-elite-1r2q5.jpg",
      price: "$3.99",
      originalPrice: "$7.99",
      discount: "-50%",
      type: "Base Game",
      tag: "First Run",
    },
    {
      title: "Guards II: Chaos in Hell",
      image: "https://cdn1.epicgames.com/spt-assets/6920f00f075d4008984920405230983a/guards-ii-chaos-in-hell-1a8k3.jpg",
      price: "$14.99",
      originalPrice: null,
      discount: null,
      type: "Base Game",
      tag: "First Run",
    },
  ];

  return (
    <section className="bg-[var(--color-background)] w-full py-12">
      <div className="mx-auto px-4 md:px-8 max-w-[1600px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h2 className="text-[18px] md:text-[20px] font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">
              Featured from Epic First Run
            </h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all w-4 h-4 md:w-5 md:h-5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>

          <div className="flex gap-4">
            <button
              className="w-8 h-8 rounded-full bg-[#1A1F3A] flex items-center justify-center text-white hover:bg-[#2D3748] transition-colors disabled:opacity-50"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-full bg-[#1A1F3A] flex items-center justify-center text-white hover:bg-[#2D3748] transition-colors"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {games.map((game, index) => (
            <div
              key={index}
              className="group flex flex-col gap-2.5 w-full cursor-pointer relative"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#1A1F3A]">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                />
                
                {/* Hover Add to Wishlist Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="16" />
                      <line x1="8" x2="16" y1="12" y2="12" />
                    </svg>
                  </button>
                </div>

                {/* Overlay Text (e.g. Early Access) */}
                {game.overlay && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-md w-max">
                    {game.overlay}
                  </div>
                )}

                 {/* Hover Glow Effect */}
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wide">
                  {game.type}
                </span>
                
                <h3 className="text-[14px] sm:text-[15px] font-normal text-white leading-tight truncate pr-2" title={game.title}>
                  {game.title}
                </h3>

                {/* First Run Badge */}
                <div className="flex items-center gap-1.5 bg-[#2D3748]/50 w-max px-2 py-1 rounded-sm mt-0.5">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="#FFD700" 
                    stroke="none"
                    className="shrink-0"
                  >
                   <path d="M2.20164 18.4697L6.89066 13.9213L9.68418 16.6308L2.20164 18.4697Z" />
                   <path d="M21.7984 18.4697L17.1093 13.9213L14.3158 16.6308L21.7984 18.4697Z" />
                   <path d="M12 4.45455L6.63636 9.81818L8.63636 12.0909L12 15.3523L15.3636 12.0909L17.3636 9.81818L12 4.45455Z" />
                   <path d="M11.2384 16.4864L3.75586 18.8475L2.20312 21.0909L21.7969 21.0909L20.2441 18.8475L12.7616 16.4864L12 17.2251L11.2384 16.4864Z" />
                  </svg>
                  <span className="text-[11px] font-medium text-white/90 leading-none pb-[1px]">First Run</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  {game.discount && (
                    <span className="bg-[var(--color-primary)] text-[#0A0E27] text-[11px] font-bold px-1.5 py-0.5 rounded-[4px]">
                      {game.discount}
                    </span>
                  )}
                  {game.originalPrice && (
                    <span className="text-[11px] text-[var(--color-muted)] line-through">
                      {game.originalPrice}
                    </span>
                  )}
                  <span className="text-[14px] text-white font-normal">
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