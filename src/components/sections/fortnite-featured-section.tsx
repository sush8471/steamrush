export default function FortniteFeaturedSection() {
  const cards = [
    {
      id: 1,
      title: "This Week in Fortnite",
      description:
        "Check out the latest updates in Fortnite, from classic Battle Royale to Blitz and Delulu. There's always something new in Fortnite!",
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/fnsp-39-10-summitreed-egs-launcher-keyart-breaker--23.jpg",
      buttonText: "Discover Now",
      hasExternalIcon: false,
    },
    {
      id: 2,
      title: "Fortnite",
      description:
        "Get ready for his reality. Playboi Carti has dropped into Fortnite!",
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/fnjn-39-10-tabasco-keyart-egs-breaker-1920x1080-19-24.jpg",
      buttonText: "See In Shop",
      hasExternalIcon: true,
    },
    {
      id: 3,
      title: "LEGO® Fortnite: Odyssey",
      description:
        "Unleash your inner Ninja! Defend Ninjago Island in LEGO® Fortnite Odyssey's Ninjago: Rise of the Ninja update.",
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/fneco-keyart-25-egs-launcher-keyart-breaker-1920x1-22.jpg",
      buttonText: "Play For Free",
      hasExternalIcon: false,
    },
  ];

  return (
    <section className="w-full bg-[#0A0E27] py-8 lg:py-12">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12">
        {/* Section Heading per instructions */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-white md:text-[20px]">
            This Week in Fortnite
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group flex flex-col bg-transparent md:max-w-none"
            >
              {/* Image Container with Hover Effect */}
              <a href="#" className="mb-5 block overflow-hidden rounded-[12px]">
                <div className="relative aspect-[16/9] w-full overflow-hidden transition-all duration-300 hover:brightness-110">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </a>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2.5 font-[Inter_Tight] text-[18px] font-bold leading-tight text-white md:text-[20px]">
                  <a
                    href="#"
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {card.title}
                  </a>
                </h3>

                <p className="mb-6 line-clamp-3 font-[Inter_Tight] text-[14px] leading-relaxed text-[#B0B8D0]">
                  {card.description}
                </p>

                <div className="mt-auto">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-[4px] bg-[#333333] px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-white transition-all duration-200 hover:scale-105 hover:bg-[#444444] hover:shadow-[0_0_12px_rgba(0,180,255,0.4)]"
                    aria-label={`Action for ${card.title}`}
                  >
                    <span className="normal-case">{card.buttonText}</span>
                    {card.hasExternalIcon && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-2 h-4 w-4"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" x2="21" y1="14" y2="3" />
                      </svg>
                    )}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}