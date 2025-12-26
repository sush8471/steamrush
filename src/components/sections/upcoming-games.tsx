"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function UpcomingGames() {
  const upcomingGames = [
    {
      id: 1,
      title: "Phantom Blade Ø",
      image: "/upcoming-phantom-blade.jpg",
      type: "Action",
      badge: "Coming Soon",
    },
    {
      id: 2,
      title: "Reanimal",
      image: "/upcoming-reanimal.jpg",
      type: "Horror",
      badge: "Coming Soon",
    },
    {
      id: 3,
      title: "Subnautica 2",
      image: "/upcoming-subnautica-2.jpg",
      type: "Survival",
      badge: "Coming Soon",
    },
    {
      id: 4,
      title: "Resident Evil Requiem",
      image: "/upcoming-resident-evil-requiem.jpg",
      type: "Horror",
      badge: "Coming Soon",
    },
    {
      id: 5,
      title: "Pragmata",
      image: "/upcoming-pragmata.jpg",
      type: "Sci-Fi",
      badge: "Coming Soon",
    },
  ];

  return (
    <section className="w-full bg-[#0A0E27] py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        
        <div className="flex items-center justify-between gap-4 mb-4 lg:mb-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-[#FFD700]" />
              Upcoming Games
            </h2>
            <p className="text-[#B0B8D0] text-sm lg:text-base">
              New releases arriving soon
            </p>
          </div>
          <div className="hidden md:block text-[#B0B8D0] text-sm">
            Swipe →
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-6 lg:gap-4 overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {upcomingGames.map((game) => (
            <div
              key={game.id}
              className="group relative bg-[#1A1F3A]/40 rounded-lg overflow-hidden border border-[#2A2E4D]/50 transition-all duration-300 hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] cursor-default flex-shrink-0 w-[60vw] max-w-[240px] lg:w-full snap-start"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 768px) 60vw, 16vw"
                />
                
                <div className="absolute top-2 right-2 bg-[#FFD700]/90 text-[#0A0E27] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {game.badge}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
