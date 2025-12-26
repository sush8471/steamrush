import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PromoCardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  className?: string;
  bgClass: string;
  featured?: boolean;
}

const PromoCard = ({
  title,
  description,
  buttonText,
  href,
  className,
  bgClass,
}: PromoCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex aspect-[16/10] w-full flex-col justify-end overflow-hidden rounded-xl p-6 md:p-8",
        bgClass,
        className
      )}
    >
      {/* Dark Overlay Gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Hover Overlay - Lightens slightly on interaction */}
      <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.04]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start gap-4">
        <h3 className="font-display text-2xl font-bold text-white md:text-3xl tracking-tight drop-shadow-sm">
          {title}
        </h3>
        <p className="max-w-[85%] text-sm font-medium leading-relaxed text-[#F5F5F5] md:text-base drop-shadow-sm opacity-90">
          {description}
        </p>
        <div className='pt-2'>
        <Link
          href={href}
          className="inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-[12px] font-bold uppercase tracking-widest text-black transition-transform duration-200 hover:scale-105 active:scale-95 hover:bg-gray-100"
        >
          {buttonText}
        </Link>
        </div>
      </div>
    </div>
  );
};

export default function FreeGamesCTA() {
  return (
    <section className="w-full py-12">
      <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {/* Sales & Specials Card */}
          <PromoCard
            title="Sales & Specials"
            description="Save big on hit titles and hidden gems. There's always something on sale at the Epic Games Store!"
            buttonText="Browse"
            href="/sales"
            bgClass="bg-gradient-to-br from-[#5b21b6] via-[#7c3aed] to-[#4c1d95] bg-[length:400%_400%] animate-gradient" 
            // Fallback purple gradient to match the 'Sales' bag aesthetic
          />

          {/* Free Games Card (Target Focus) */}
          <PromoCard
            title="Free Games"
            description="Explore free and free-to-play games from our collection. Come back every Thursday for a new free game!"
            buttonText="Play Now"
            href="/free-games"
            bgClass="bg-gradient-to-br from-[#0369a1] via-[#0ea5e9] to-[#0284c7] saturate-125"
            // Vibrant blue gradient to represent the 'Free Games' collage energy
            featured={true}
          />

          {/* Apps Card */}
          <PromoCard
            title="Apps"
            description="Enjoy some of the best Apps for music, gaming, creating, and more!"
            buttonText="Browse"
            href="/apps"
            bgClass="bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#3f3f46]"
            // Neutral dark gradient for the 'Apps' section
          />
        </div>
      </div>
    </section>
  );
}