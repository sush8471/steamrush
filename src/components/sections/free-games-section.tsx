import Link from 'next/link';
import { Gift } from 'lucide-react';

export default function FreeGamesSection() {
  return (
    <section className="w-full bg-[#0A0E27] py-8 md:py-12">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12">
        {/* 
          Free Games Section Container
          Matches the visual treatment of a distinct 'card' or panel block 
          seen in the Epic Games Store design for this specific section.
        */}
        <div className="relative flex flex-col rounded-[16px] bg-[#1A1F3A] p-4 shadow-sm md:p-8 lg:p-10">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            
            {/* Title & Icon */}
            <div className="flex items-center gap-3 md:gap-4">
              <Gift 
                className="h-6 w-6 text-white md:h-8 md:w-8" 
                strokeWidth={1.5}
                aria-hidden="true" 
              />
              <h2 className="font-display text-[20px] font-bold leading-tight tracking-[0.01em] text-white md:text-[28px] lg:text-[36px]">
                Free Games
              </h2>
            </div>
            
            {/* Action Link / Button */}
            <button 
              className="bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#25D366] text-white font-bold text-sm lg:text-base uppercase px-6 lg:px-8 py-3 lg:py-3.5 rounded-lg transition-all duration-200 transform active:scale-95 shadow-lg w-full sm:w-auto"
                onClick={() => window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: "https://wa.me/917752805529" } }, "*")}
            >
              Buy on WhatsApp
            </button>
          </div>

          {/* 
            Content Area Placeholder 
            Maintains the layout structure where the free games cards would reside.
            The padding of the container handles the bottom spacing.
          */}
          <div className="w-full">
            {/* This area is intentionally left to imply the slot for Free Games Cards */}
          </div>

        </div>
      </div>
    </section>
  );
}