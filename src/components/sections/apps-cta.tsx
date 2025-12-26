import Link from 'next/link';
import { 
  ShoppingBag, 
  Gift, 
  LayoutGrid, 
  Music, 
  Gamepad2, 
  PenTool, 
  MessageCircle, 
  Globe, 
  Video,
  MonitorPlay
} from 'lucide-react';

interface PromoCardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  variant: "sales" | "free" | "apps";
}

const PromoCard = ({ title, description, buttonText, href, variant }: PromoCardProps) => {
  return (
    <div className="flex flex-col group h-full">
      {/* Visual/Image Area */}
      <Link 
        href={href} 
        className="block w-full aspect-[16/9] mb-5 overflow-hidden rounded-xl relative bg-[#1A1F3A]"
        aria-label={`View ${title}`}
      >
        <div className="w-full h-full transition-transform duration-300 ease-out group-hover:scale-105 relative">
          {variant === "sales" && (
            <div className="w-full h-full bg-gradient-to-br from-[#2D1B4E] to-[#1A1F3A] flex items-center justify-center relative relative">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               <ShoppingBag className="w-20 h-20 text-white/10 absolute top-4 right-4 rotate-12 transform scale-125" />
               <div className="relative z-10 p-6 bg-white/5 rounded-full backdrop-blur-sm shadow-xl border border-white/10">
                 <ShoppingBag className="w-12 h-12 text-[#FF639F] drop-shadow-md" />
               </div>
            </div>
          )}
          {variant === "free" && (
            <div className="w-full h-full bg-gradient-to-br from-[#003E6B] to-[#1A1F3A] flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               <Gift className="w-24 h-24 text-white/10 absolute -bottom-4 -left-4 -rotate-12 transform" />
               <div className="relative z-10 p-6 bg-white/5 rounded-full backdrop-blur-sm shadow-xl border border-white/10">
                 <Gift className="w-12 h-12 text-[#00B4FF] drop-shadow-md" />
               </div>
            </div>
          )}
          {variant === "apps" && (
            <div className="w-full h-full bg-[#121212] flex items-center justify-center relative overflow-hidden">
              {/* Pattern mimicking the collage of apps */}
              <div className="absolute inset-0 grid grid-cols-4 gap-6 p-6 opacity-20 rotate-6 scale-125 origin-center">
                 <Music className="w-8 h-8 text-white" />
                 <MessageCircle className="w-8 h-8 text-white" />
                 <Gamepad2 className="w-8 h-8 text-white" />
                 <PenTool className="w-8 h-8 text-white" />
                 <Video className="w-8 h-8 text-white" />
                 <Globe className="w-8 h-8 text-white" />
                 <MonitorPlay className="w-8 h-8 text-white" />
                 <LayoutGrid className="w-8 h-8 text-white" />
                 <Music className="w-8 h-8 text-white" />
                 <Gamepad2 className="w-8 h-8 text-white" />
                 <PenTool className="w-8 h-8 text-white" />
                 <Video className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-60" />
              
              {/* Central Featured Style */}
              <div className="relative z-10 p-6 bg-white/5 rounded-2xl backdrop-blur-md shadow-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                 <LayoutGrid className="w-12 h-12 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              </div>
            </div>
          )}
        </div>
        
        {/* Hover Highlight Overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      {/* Content Area */}
      <div className="flex flex-col items-start flex-grow">
        <Link 
          href={href} 
          className="group-hover:text-[#00B4FF] transition-colors duration-200"
        >
          <h3 className="text-[18px] md:text-[20px] font-bold text-white mb-2 leading-tight tracking-tight font-display">
            {title}
          </h3>
        </Link>
        <p className="text-[#B0B8D0] text-[14px] md:text-[16px] leading-[1.6] mb-6 line-clamp-2 min-h-[3.2em] font-body">
          {description}
        </p>
        <Link 
          href={href} 
          className="mt-auto inline-block"
          tabIndex={-1} // Focus handled by main card links mainly, but this is a visual CTA
        >
          <span 
            className={`
              inline-flex items-center justify-center h-[40px] px-6 rounded-lg 
              text-[13px] font-bold uppercase tracking-[0.5px] transition-all duration-200 
              ${buttonText === 'Play Now' 
                 ? 'bg-white text-black hover:bg-gray-200' 
                 : 'bg-[#4A5568] text-white hover:bg-[#5A6578] border border-transparent'
              }
              hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95
            `}
          >
            {buttonText}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default function AppsCTA() {
  const cards = [
    {
      title: "Sales & Specials",
      description: "Save big on hit titles and hidden gems. There's always something on sale at the Epic Games Store!",
      buttonText: "Browse",
      href: "/sales-and-specials",
      variant: "sales" as const
    },
    {
      title: "Free Games",
      description: "Explore free and free-to-play games from our collection. Come back every Thursday for a new free game!",
      buttonText: "Play Now",
      href: "/free-games",
      variant: "free" as const
    },
    {
      title: "Apps",
      description: "Enjoy some of the best Apps for music, gaming, creating, and more!",
      buttonText: "Browse",
      href: "/apps",
      variant: "apps" as const
    }
  ];

  return (
    <section className="w-full bg-[#0A0E27] py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {cards.map((card, index) => (
            <PromoCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}