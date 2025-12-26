'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, PlusCircle } from 'lucide-react';

/* 
  Data for the Top Demos section.
  In a real application, this would be fetched from an API.
  Images are placeholders or approximations based on available context.
*/
const DEMO_ITEMS = [
  {
    id: 'half-sword',
    title: 'Half Sword Demo',
    status: 'Free',
    imageColor: 'from-orange-900 to-amber-900',
  },
  {
    id: 'ea-sports-fc-26',
    title: 'EA SPORTS FC™ 26 SHOWCASE',
    status: 'Free',
    imageColor: 'from-blue-900 to-slate-900',
  },
  {
    id: 'arise',
    title: 'Arise - Closed Playtest',
    status: 'Free',
    imageColor: 'from-emerald-900 to-teal-900',
  },
  {
    id: 'truck-world',
    title: 'Truck World: Driving School',
    status: 'Free',
    imageColor: 'from-stone-800 to-stone-900',
  },
  {
    id: 'tormentor',
    title: 'TORMENTOR Demo',
    status: 'Free',
    imageColor: 'from-red-950 to-black',
  },
];

export default function TopDemos() {
  return (
    <section className="w-full h-full flex flex-col font-sans">
      {/* Section Header */}
      <div className="flex items-center gap-2 group cursor-pointer w-fit mb-4">
        <Link href="#" className="flex items-center gap-2 group-hover:opacity-80 transition-opacity">
          <h2 className="text-[22px] font-bold text-white tracking-tight">Top Demos</h2>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-white transition-all duration-300 ease-out" />
        </Link>
      </div>

      {/* Vertical List */}
      <div className="flex flex-col gap-1 w-full">
        {DEMO_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={`/p/${item.id}`}
            className="group relative flex items-center gap-4 p-3 rounded-xl transition-colors duration-200 hover:bg-[#1A1F3A]"
          >
            {/* Image Thumbnail */}
            <div className={`relative flex-shrink-0 w-[60px] h-[80px] rounded-[4px] overflow-hidden bg-gradient-to-br ${item.imageColor} shadow-md`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                {/* Fallback pattern for placeholder images */}
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-1 min-w-0 flex-grow py-1">
              <span 
                className="text-[15px] font-normal leading-tight text-white truncate max-w-full"
                title={item.title}
              >
                {item.title}
              </span>
              <span className="text-[13px] text-[#B0B8D0]">
                {item.status}
              </span>
            </div>

            {/* Action Hover Button */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1">
              <button 
                type="button"
                className="flex items-center justify-center p-1.5 rounded-full text-white hover:bg-[#2D3748] hover:scale-110 active:scale-95 transition-all"
                aria-label={`Add ${item.title} to wishlist`}
              >
                <PlusCircle className="w-5 h-5 fill-transparent stroke-[1.5]" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}