import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ASSETS = [
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/images_25.png", // Hollypaw
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/images_26.png", // Fall Guys
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/images_27.png", // Rocket League
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/images_28.png", // Discord
];

// Fallback images for the last two items using previous ones since we only have 4 unique assets
const ITEMS = [
  {
    category: "Add-On",
    title: "Hollypaw Wrap",
    price: "Free",
    image: ASSETS[0],
    alt: "Fortnite Hollypaw Wrap",
  },
  {
    category: "Add-On",
    title: "Fall Guys - Fashionably Frosty",
    price: "Free",
    image: ASSETS[1],
    alt: "Fall Guys Fashionably Frosty",
  },
  {
    category: "Add-On",
    title: "Rocket League® - TriTrim Crimson & Forest Green...",
    price: "Free",
    image: ASSETS[2],
    alt: "Rocket League TriTrim",
  },
  {
    category: "Add-On",
    title: "Discord Nitro",
    price: "Free",
    image: ASSETS[3],
    alt: "Discord Nitro",
  },
  {
    category: "Add-On",
    title: "Infinity Nikki - Epic Extras Bundle",
    price: "Free",
    image: ASSETS[0], // Reuse mostly for placeholder visual
    alt: "Infinity Nikki Epic Extras Bundle",
  },
  {
    category: "Add-On",
    title: "Cozy Dark Urge Party Pack",
    price: "Free",
    image: ASSETS[3], // Reuse mostly for placeholder visual
    alt: "Cozy Dark Urge Party Pack",
  },
];

export default function EpicExtrasSection() {
  return (
    <div className="w-full bg-[#0A0E27] text-white py-8 md:py-12 font-sans overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer hover:opacity-90 transition-opacity"
          >
            <h2 className="text-[18px] md:text-[22px] font-bold leading-tight">
              Epic Extras
            </h2>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300 group-hover:text-white" />
          </a>

          <div className="flex gap-3">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1F3A] hover:bg-[#2D3748] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Previous slide"
              disabled
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1F3A] hover:bg-[#2D3748] transition-colors group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Grid / Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {ITEMS.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex flex-col gap-3 group cursor-pointer w-full"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#1A1F3A] shadow-md transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  className="object-cover transition-all duration-300 group-hover:brightness-110"
                />
                {/* Overlay gradient for better text readability if text were on image, but here it's below. 
                    However, Epic often has a subtle inner shadow or sheen. Not strictly required by prompt but good polish. */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wide leading-none">
                  {item.category}
                </span>
                <h3 className="text-sm md:text-[15px] font-medium leading-5 text-white truncate w-full" title={item.title}>
                  {item.title}
                </h3>
                <span className="text-sm text-gray-300 mt-1">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}