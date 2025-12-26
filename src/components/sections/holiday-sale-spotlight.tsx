import Link from "next/link";
import { ChevronRight, ChevronLeft, CalendarPlus, PlusCircle } from "lucide-react";

export default function HolidaySaleSpotlight() {
  const games = [
    {
      title: "Battlefield™ 6",
      label: "Base Game",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Battlefield+6",
      discount: "-30%",
      originalPrice: "$69.99",
      price: "$48.99",
      tags: [],
    },
    {
      title: "EA SPORTS FC™ 26 Standard Edition",
      label: "Base Game",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=FC+26",
      discount: "-60%",
      originalPrice: "$69.99",
      price: "$27.99",
      tags: ["Trial Available"],
    },
    {
      title: "Borderlands® 4",
      label: "Base Game",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Borderlands+4",
      discount: "-20%",
      originalPrice: "$69.99",
      price: "$55.99",
      tags: [],
    },
    {
      title: "ARC Raiders",
      label: "Base Game",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=ARC+Raiders",
      discount: "-20%",
      originalPrice: "$39.99",
      price: "$31.99",
      tags: [],
    },
    {
      title: "Ready or Not",
      label: "Base Game",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=Ready+or+Not",
      discount: "-40%",
      originalPrice: "$49.99",
      price: "$29.99",
      tags: [],
    },
    {
      title: "Grand Theft Auto V Enhanced",
      label: "Base Game",
      image: "https://placehold.co/600x800/1A1F3A/FFFFFF/png?text=GTA+V",
      discount: "-50%",
      originalPrice: "$29.99",
      price: "$14.99",
      tags: [],
    },
  ];

  return (
    <section className="w-full py-8 md:py-12 bg-background text-foreground font-display">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link 
            href="#" 
            className="group flex items-center gap-2 text-xl md:text-2xl font-bold text-white hover:text-white/90 transition-colors"
          >
            <span>Holiday Sale Spotlight</span>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <div className="flex gap-2.5">
            <button 
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-card hover:bg-card/80 flex items-center justify-center transition-colors text-white focus:outline-hidden focus:ring-2 focus:ring-primary/50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-card hover:bg-card/80 flex items-center justify-center transition-colors text-white focus:outline-hidden focus:ring-2 focus:ring-primary/50"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {games.map((game, index) => (
            <div 
              key={index} 
              className="group flex flex-col gap-2 relative cursor-pointer"
            >
              {/* Card Image Container */}
              <div className="relative aspect-[3/4] w-full bg-card rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.