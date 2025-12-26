import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

// --- Types ---

interface SmallGameCardProps {
  title: string;
  imageColor: string;
  originalPrice?: string;
  currentPrice: string;
  discount?: string;
  badge?: string;
  tags?: string[];
  baseGame?: boolean;
}

interface FeatureGameCardProps {
  title: string;
  description: string;
  ctaText: string;
  imageColor: string;
  type?: 'Pre-Purchase' | 'Available' | 'Coming Soon';
}

// --- Data ---

const SMALL_CARDS: SmallGameCardProps[] = [
  {
    title: "EA SPORTS FC™ 26 Standard Edition",
    imageColor: "bg-emerald-900", // Placeholder for game art
    originalPrice: "$69.99",
    currentPrice: "$27.99",
    discount: "-60%",
    badge: "Trial Available",
    baseGame: true,
  },
  {
    title: "ARC Raiders",
    imageColor: "bg-red-900",
    originalPrice: "$39.99",
    currentPrice: "$31.99",
    discount: "-20%",
    baseGame: true,
  },
  {
    title: "Battlefield™ 6",
    imageColor: "bg-amber-900",
    originalPrice: "$69.99",
    currentPrice: "$48.99",
    discount: "-30%", // Inferred from screenshot logic
    baseGame: true,
  },
  {
    title: "F1® 25",
    imageColor: "bg-blue-900",
    originalPrice: "$59.99",
    currentPrice: "$29.99",
    discount: "-50%",
    badge: "Trial Available",
    baseGame: true,
  },
  {
    title: "REMATCH",
    imageColor: "bg-purple-900",
    originalPrice: "$29.99",
    currentPrice: "$20.00",
    discount: "-33%",
    baseGame: true,
  },
  {
    title: "Football Manager 26",
    imageColor: "bg-indigo-900",
    currentPrice: "$59.99",
    baseGame: true,
  },
];

const FEATURED_CARDS: FeatureGameCardProps[] = [
  {
    title: "Resident Evil Requiem",
    description: "Pre-purchase Resident Evil Requiem through the Epic Games Store to receive the Grace outfit in Fortnite!",
    ctaText: "Pre-Purchase Now",
    imageColor: "bg-slate-800",
    type: "Pre-Purchase",
  },
  {
    title: "Inside Phantom Blade Zero",
    description: "A dive into how authenticity and approachability found their balance in dynamic kung fu fighting.",
    ctaText: "Read More",
    imageColor: "bg-neutral-800",
    type: "Coming Soon",
  },
  {
    title: "Lords of the Fallen II",
    description: "Behold the official gameplay trailer for Lords of the Fallen II, the bolder, braver and bloodier sequel!",
    ctaText: "Wishlist Now",
    imageColor: "bg-zinc-800",
    type: "Coming Soon",
  },
];

// --- Components ---

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block px-2 py-[2px] text-[10px] font-bold uppercase rounded-[4px] tracking-wide ${className}`}>
    {children}
  </span>
);

const SmallGameCard = ({ title, imageColor, originalPrice, currentPrice, discount, badge, baseGame }: SmallGameCardProps) => {
  return (
    <div className="group relative flex-none w-[205px] flex flex-col gap-3 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-[#1A1F3A] hover:brightness-110 transition-all duration-300 shadow-lg group-hover:-translate-y-1 group-hover:shadow-2xl hover:shadow-[0_0_16px_rgba(0,180,255,0.2)]">
        <div className={`absolute inset-0 ${imageColor} opacity-80 mix-blend-overlay`} />
        {/* Placeholder visual */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
           <span className="text-white/20 font-bold text-lg text-center leading-tight uppercase">{title.split(' ')[0]}</span>
        </div>
        
        {/* Add to Wishlist Overlay (visible on hover) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 backdrop-blur-sm">
             <PlusCircle size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-1">
        {baseGame && (
          <span className="text-[10px] font-bold text-[#B0B8D0] uppercase tracking-wider">Base Game</span>
        )}
        <h3 className="text-[16px] font-medium text-white truncate leading-tight" title={title}>
          {title}
        </h3>
        
        <div className="flex flex-col gap-1.5 mt-0.5">
            {badge && (
                <div className="self-start">
                    <Badge className="bg-[#2D3748] text-[#B0B8D0] border border-white/10">{badge}</Badge>
                </div>
            )}
            
            <div className="flex items-center flex-wrap gap-2 mt-0.5">
            {discount && (
                <Badge className="bg-[#0074E4] text-white">
                {discount}
                </Badge>
            )}
            <div className="flex items-center gap-2">
                {originalPrice && (
                <span className="text-[13px] text-[#B0B8D0] line-through font-medium">
                    {originalPrice}
                </span>
                )}
                <span className="text-[13px] text-white font-medium">
                {currentPrice}
                </span>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const FeatureGameCard = ({ title, description, ctaText, imageColor }: FeatureGameCardProps) => {
  return (
    <div className="group flex flex-col gap-4 w-full cursor-pointer">
      {/* Large Image Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] bg-[#1A1F3A] hover:brightness-110 transition-all duration-300 shadow-xl group-hover:translate-y-[-4px] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
         <div className={`absolute inset-0 ${imageColor} opacity-70`} />
         <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-white/30 font-black text-2xl uppercase tracking-widest">{title.substring(0, 10)}...</span>
         </div>
      </div>

      {/* Content Below */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[18px] font-bold text-white leading-tight">
          {title}
        </h3>
        <p className="text-[14px] leading-relaxed text-[#B0B8D0] line-clamp-2">
          {description}
        </p>
        <div className="mt-1">
          <button className="inline-flex items-center justify-center h-[32px] px-5 rounded-[4px] text-[11px] font-bold uppercase tracking-widest bg-transparent border border-[#B0B8D0]/30 hover:bg-white hover:text-black hover:border-white text-white transition-all duration-200">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Section Component ---

export default function TopNewReleases() {
  return (
    <section className="w-full bg-[#0A0E27] text-white font-sans antialiased py-10 selection:bg-[#00B4FF] selection:text-white">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 group cursor-pointer">
            <h2 className="text-[20px] md:text-[22px] font-bold text-white group-hover:text-[#00B4FF] transition-colors">
              Top New Releases
            </h2>
            <ChevronRight className="w-5 h-5 text-[#B0B8D0] group-hover:translate-x-1 transition-transform group-hover:text-[#00B4FF]" />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              aria-label="Previous Slide"
              className="w-8 h-8 rounded-full bg-[#1A1F3A] flex items-center justify-center text-white hover:bg-[#2D3748] transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              aria-label="Next Slide"
              className="w-8 h-8 rounded-full bg-[#1A1F3A] flex items-center justify-center text-white hover:bg-[#2D3748] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Small Cards Horizonatal Scroll */}
        <div className="relative w-full mb-10 md:mb-14">
            <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {SMALL_CARDS.map((card, idx) => (
                <div key={idx} className="snap-start">
                    <SmallGameCard {...card} />
                </div>
            ))}
            </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURED_CARDS.map((feature, idx) => (
            <FeatureGameCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}