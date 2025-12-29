"use client";

import Image from "next/image";
import Link from "next/link";

export default function GameCardsGridDiscover() {
  const games = [
    {
      id: 1,
      title: "Grand Theft Auto V",
      image: "/gta-v.jpg",
      price: "₹299",
      originalPrice: "₹899",
      discount: "-67%",
      type: "Action-Adventure / Open-World",
      href: "/games/gta-v"
    },
    {
      id: 2,
      title: "Elden Ring",
      image: "/elden-ring.jpg",
      price: "₹299",
      originalPrice: "₹1,499",
      discount: "-80%",
      type: "RPG",
    },
    {
      id: 3,
      title: "Cyberpunk 2077",
      image: "/cyberpunk-2077.jpg",
      price: "₹299",
      originalPrice: "₹1,299",
      discount: "-77%",
      type: "FPS / TPS",
    },
    {
      id: 4,
      title: "Red Dead Redemption 2",
      image: "/red-dead-redemption-2.jpg",
      price: "₹299",
      originalPrice: "₹899",
      discount: "-67%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 5,
      title: "Hogwarts Legacy",
      image: "/hogwarts-legacy.jpg",
      price: "₹349",
      originalPrice: "₹1,999",
      discount: "-83%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 6,
      title: "Marvel's Spider-Man Remastered",
      image: "/spiderman-remastered.png",
      price: "₹249",
      originalPrice: "₹1,299",
      discount: "-81%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 7,
      title: "God of War",
      image: "/god-of-war.jpg",
      price: "₹299",
      originalPrice: "₹899",
      discount: "-67%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 8,
      title: "The Last of Us Part II Remastered",
      image: "/last-of-us-part-2.jpg",
      price: "₹299",
      originalPrice: "₹1,599",
      discount: "-81%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 10,
      title: "Mafia: Definitive Edition",
      image: "/mafia-definitive-edition.jpg",
      price: "₹199",
      originalPrice: "₹799",
      discount: "-75%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 11,
      title: "Detroit: Become Human",
      image: "/detroit-become-human.png",
      price: "₹249",
      originalPrice: "₹999",
      discount: "-75%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 12,
      title: "Days Gone",
      image: "/days-gone.jpg",
      price: "₹249",
      originalPrice: "₹999",
      discount: "-75%",
      type: "Action-Adventure / Open-World",
    },
    {
      id: 13,
      title: "State of Decay 2: Juggernaut Edition",
      image: "/state-of-decay-2.png",
      price: "₹249",
      originalPrice: "₹999",
      discount: "-75%",
      type: "FPS / TPS",
    },
    {
      id: 14,
      title: "Uncharted: Legacy of Thieves Collection",
      image: "/uncharted-legacy-thieves.jpg",
      price: "₹299",
      originalPrice: "₹1,299",
      discount: "-77%",
      type: "Action-Adventure / Open-World",
    },
  ];

  return (
    <section className="w-full bg-[#0A0E27] py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-white mb-1">
              🔥 Hot Deals
            </h2>
            <p className="text-[#B0B8D0] text-sm lg:text-base">
              Premium games at India's best prices
            </p>
          </div>
          <div className="hidden md:block text-[#B0B8D0] text-sm">
            Swipe →
          </div>
        </div>

        <div className="overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {games.map((game) => {
            // Map the static IDs from this file to the actual IDs in games.ts if they differ, 
            // or just ensure the 'game.id' (if it were a string) matches.
            // Since this file uses integer IDs (1, 2, 3), we need to map them to string IDs used in your routing (e.g. "gta-v", "elden-ring").
            // For now, I will construct a slug from the title as a fallback, or better yet, let's just assume we want to link.
            
            // To make this robust without rewriting the whole array above:
            // I will convert titles to kebab-case slugs which matches your ID convention in games.ts
            // e.g. "Grand Theft Auto V" -> "gta-v" (manual exception)
            // "Elden Ring" -> "elden-ring"
            
            let linkId = "";
            if (game.title === "Grand Theft Auto V") linkId = "gta-v";
            else if (game.title === "Red Dead Redemption 2") linkId = "rdr2";
            else if (game.title === "Marvel's Spider-Man Remastered") linkId = "spiderman-remastered"; 
            else if (game.title === "The Last of Us Part II Remastered") linkId = "last-of-us-part-2";
            else if (game.title.includes("State of Decay")) linkId = "state-decay-2";
            else if (game.title.includes("Uncharted")) linkId = "uncharted";
            else if (game.title.includes("Detroit")) linkId = "detroit-bh";
            else if (game.title.includes("Mafia")) linkId = "mafia-de";
            else linkId = game.title.toLowerCase().replace(/[':]/g, '').replace(/\s+/g, '-');

            return (
              <Link 
                key={game.id} 
                href={`/games/${linkId}`}
                className="flex-shrink-0 snap-start"
              >
                <div className="group relative bg-[#1A1F3A] rounded-lg overflow-hidden border border-[#2A2E4D] hover:border-[#0074E4]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,116,228,0.15)] flex-shrink-0 w-[60vw] max-w-[240px] h-full cursor-pointer">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 70vw, 16vw"
                    />
                    {game.discount && (
                      <div className="absolute top-2 right-2 bg-[#0074E4] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        {game.discount}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black text-xl">
                        {game.price}
                      </span>
                      <span className="text-[#B0B8D0] text-xs line-through">
                        {game.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}