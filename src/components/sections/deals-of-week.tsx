import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, PlusCircle } from 'lucide-react';

const DEALS = [
  {
    id: 1,
    title: "theHunter: Call of the Wild™ - Hunting Starter Bundle",
    discount: "-50%",
    originalPrice: "$34.99",
    salePrice: "$17.49",
    imageAlt: "theHunter: Call of the Wild - Hunting Starter Bundle",
    portrait: false, 
  },
  {
    id: 2,
    title: "Lord Ambermaze",
    discount: "-10%",
    originalPrice: "$14.99",
    salePrice: "$13.49",
    imageAlt: "Lord Ambermaze",
    portrait: false,
  }
];

export default function DealsOfWeek() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#0A0E27] text-white font-[family-name:var(--font-body)]">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 xl:px-10">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="#" className="group flex items-center gap-2">
            <h2 className="text-[18px] md:text-[22px] font-bold text-white group-hover:text-[#00D9FF] transition-colors leading-tight">
              Deals of the Week
            </h2>
            <ChevronRight className="w-5 h-5 text-white group-hover:text-[#00D9FF] transition-colors translate-y-[1px]" />
          </Link>

          <div className="flex items-center gap-2">
            <button 
              aria-label="Previous Slide"
              className="w-8 h-8 rounded-full bg-[#1A1F3A] flex items-center justify-center hover:bg-[#2D3748] transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button 
              aria-label="Next Slide"
              className="w-8 h-8 rounded-full bg-[#1A1F3A] flex items-center justify-center hover:bg-[#2D3748] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Deal Cards */}
          {DEALS.map((deal) => (
            <div key={deal.id} className="group flex flex-col gap-3 cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#1A1F3A]">
                 {/* Deals of the Week Banner */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#7c3aed] text-white text-xs font-bold uppercase tracking-widest text-center py-1.5 md:py-2 rounded-b-xl">
                  Deals of the Week
                </div>

                {/* Main Image Placeholder */}
                <div className="relative w-full h-full group-hover:opacity-90 transition-opacity duration-300">
                  {/* Since no assets were provided, using a styled placeholder that mimics the dark gaming aesthetic */}
                  <div className="w-full h-full bg-gradient-to-t from-[#0f1225] to-[#2a2e4d] flex items-center justify-center">
                    <span className="sr-only">{deal.imageAlt}</span>
                    {/* Abstract visual for placeholder */}
                    <div className="opacity-20 transform scale-150">
                       <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
                         <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         <path d="M9 10a1 1 0 100-2 1 1 0 000 2z" /> 
                         <path d="M15 10a1 1 0 100-2 1 1 0 000 2z" />
                         <path d="M15 15a1 1 0 11-2 0 1 1 0 012 0z" />
                       </svg>
                    </div>
                  </div>
                </div>

                {/* Wishlist Button (Opacity 0 -> 1 on Hover) */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm">
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#B0B8D0] mb-0.5">Base Game</span>
                
                <h3 className="text-[16px] leading-[1.4] font-normal text-white line-clamp-2 min-h-[44px]">
                  {deal.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#0074E4] text-white text-[11px] font-bold px-1.5 py-[1px] rounded-[3px]">
                    {deal.discount}
                  </span>
                  <span className="text-[#B0B8D0] text-[13px] line-through decoration-[#B0B8D0]">
                    {deal.originalPrice}
                  </span>
                  <span className="text-white text-[13px] font-medium">
                    {deal.salePrice}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Browse All Deals Card */}
          <div className="relative group flex flex-col aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]">
             <div className="absolute inset-0 bg-[url('https://cdn2.unrealengine.com/egs-browse-breaker-bg-1920x1080-3e284a141315.jpg')] opacity-20 mix-blend-overlay"></div>
             
             <div className="relative h-full flex flex-col justify-center items-center text-center p-6 md:p-8 space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm mb-1 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-[20px] md:text-[24px] font-bold text-white leading-tight">
                    Save more,
                    <br />
                    Play more.
                  </h3>
                  <p className="text-[14px] text-white/90">
                    New deals every Tuesday
                  </p>
                </div>

                <div className="pt-2">
                   <p className="text-[14px] font-medium text-white mb-4 max-w-[200px] leading-snug">
                     Check out all the deals for this week.
                   </p>
                   <Link href="#" className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 font-bold text-[13px] uppercase tracking-wide px-8 py-3 rounded-[4px] transition-colors">
                     Browse
                   </Link>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}