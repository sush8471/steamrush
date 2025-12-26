export default function NowOnEpicSection() {
  const games = [
    {
      id: '1',
      title: "A Game About Digging A Hole",
      type: "Base Game",
      badge: "Now On Epic",
      price: "$4.49",
      originalPrice: "$4.99",
      discount: "-10%",
      image: "https://cdn2.unrealengine.com/egs-a-game-about-digging-a-hole-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium", // Conceptual placeholder
      placeholderColor: "#3b3024"
    },
    {
      id: '2',
      title: "OTXO",
      type: "Base Game",
      badge: "Now On Epic",
      price: "$14.99",
      image: "https://cdn2.unrealengine.com/egs-otxo-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
      placeholderColor: "#800000"
    },
    {
      id: '3',
      title: "Tiny Terry's Turbo Trip",
      type: "Base Game",
      badge: "Now On Epic",
      price: "$17.99",
      image: "https://cdn2.unrealengine.com/egs-tiny-terry-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
      placeholderColor: "#e67e22"
    },
    {
      id: '4',
      title: "ARC SEED",
      type: "Base Game",
      badge: "Now On Epic",
      price: "$8.99",
      originalPrice: "$14.99",
      discount: "-40%",
      image: "https://cdn2.unrealengine.com/egs-arc-seed-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
      placeholderColor: "#2d8659"
    },
    {
      id: '5',
      title: "PROPHUNT",
      type: "Base Game",
      badge: "Now On Epic",
      price: "$9.99",
      image: "https://cdn2.unrealengine.com/egs-prophunt-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
      placeholderColor: "#1e3a5f"
    },
    {
      id: '6',
      title: "Space Grunts 2",
      type: "Base Game",
      badge: "Now On Epic",
      price: "$9.99",
      image: "https://cdn2.unrealengine.com/egs-space-grunts-2-carousel-desktop-1248x702-87c428fd0c97.jpg?resize=1&w=300&h=400&quality=medium",
      placeholderColor: "#4A5568"
    }
  ];

  return (
    <section className="w-full bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-xl font-bold text-white sm:text-2xl flex items-center gap-2">
            Now On The Epic Games Store
            <span className="hidden text-sm font-normal text-muted-foreground sm:inline-block md:hidden lg:hidden">&nbsp;</span>
          </h2>
          <div className="flex gap-2 text-white">
            <button
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-card hover:bg-muted/20 transition-colors disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              aria-label="Next slide"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-card hover:bg-muted/20 transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6 lg:gap-5">
          {games.map((game) => (
            <div key={game.id} className="group relative flex cursor-pointer flex-col gap-3">
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-[0_0_16px_rgba(0,180,255,0.3)] hover:brightness-110">
                {/* Fallback pattern since real images aren't available */}
                <div 
                  className="absolute inset-0 flex items-center justify-center text-center p-4"
                  style={{ backgroundColor: game.placeholderColor }}
                >
                  <span className="sr-only">{game.title} cover</span>
                </div>
                {/* Overlay gradient for text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {game.type}
                </span>

                <h3 className="truncate text-sm font-medium leading-tight text-white sm:text-base">
                  {game.title}
                </h3>

                {game.badge && (
                  <div className="mt-1 mb-1 self-start rounded bg-card/80 px-2 py-[2px] text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10">
                    {game.badge}
                  </div>
                )}

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm leading-none">
                  {game.discount ? (
                    <>
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground sm:text-xs">
                        {game.discount}
                      </span>
                      <span className="text-xs text-muted-foreground line-through sm:text-sm">
                        {game.originalPrice}
                      </span>
                      <span className="font-medium text-white sm:text-sm">
                        {game.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-white sm:text-sm">
                      {game.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}