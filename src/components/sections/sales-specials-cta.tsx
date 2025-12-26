export default function SalesSpecialsCTA() {
  return (
    <section className="w-full bg-background py-16 text-foreground">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sales & Specials Card */}
          <div className="group flex flex-col gap-6 cursor-pointer">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1A1F3A] transition-transform duration-300 ease-out group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 opacity-90 transition-all duration-300 group-hover:brightness-110"></div>
              {/* Placeholder Content for Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-32 w-32">
                   {/* Abstract Bag/Gift Shape */}
                   <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm rotate-3 border border-white/20"></div>
                   <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm -rotate-6 border border-white/20"></div>
                   <svg 
                     xmlns="http://www.w3.org/2000/svg" 
                     viewBox="0 0 24 24" 
                     fill="none" 
                     stroke="currentColor" 
                     strokeWidth="1.5" 
                     strokeLinecap="round" 
                     strokeLinejoin="round" 
                     className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-white drop-shadow-lg"
                   >
                     <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                     <path d="M3 6h18" />
                     <path d="M16 10a4 4 0 0 1-8 0" />
                   </svg>
                </div>
              </div>
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                Sales & Specials
              </h3>
              <p className="font-body text-sm leading-relaxed text-[#B0B8D0] max-w-[95%]">
                Save big on hit titles and hidden gems. There's always something on sale at the Epic Games Store!
              </p>
              <div className="mt-2">
                <a 
                  href="/sales-and-specials" 
                  className="inline-block rounded-lg bg-[#3e3e40] hover:bg-[#4d4d50] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:shadow-md"
                >
                  Browse
                </a>
              </div>
            </div>
          </div>

          {/* Free Games Card */}
          <div className="group flex flex-col gap-6 cursor-pointer">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1A1F3A] transition-transform duration-300 ease-out group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#2f3136] transition-all duration-300 group-hover:brightness-110">
                {/* Abstract Game Collage Patterns */}
                <div className="grid grid-cols-2 h-full w-full opacity-50">
                   <div className="bg-blue-900/40 border-r border-b border-white/5"></div>
                   <div className="bg-rose-900/40 border-b border-white/5"></div>
                   <div className="bg-emerald-900/40 border-r border-white/5"></div>
                   <div className="bg-amber-900/40"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg 
                   xmlns="http://www.w3.org/2000/svg" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="1.5" 
                   strokeLinecap="round" 
                   strokeLinejoin="round" 
                   className="h-16 w-16 text-white/80 drop-shadow-lg"
                 >
                   <line x1="6" x2="10" y1="12" y2="12" />
                   <line x1="8" x2="8" y1="10" y2="14" />
                   <line x1="15" x2="15.01" y1="13" y2="13" />
                   <line x1="18" x2="18.01" y1="11" y2="11" />
                   <rect width="20" height="12" x="2" y="6" rx="2" />
                 </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                Free Games
              </h3>
              <p className="font-body text-sm leading-relaxed text-[#B0B8D0] max-w-[95%]">
                Explore free and free-to-play games from our collection. Come back every Thursday for a new free game!
              </p>
              <div className="mt-2">
                <a 
                  href="/free-games" 
                  className="inline-block rounded-lg bg-[#3e3e40] hover:bg-[#4d4d50] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:shadow-md"
                >
                  Play Now
                </a>
              </div>
            </div>
          </div>

          {/* Apps Card */}
          <div className="group flex flex-col gap-6 cursor-pointer">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1A1F3A] transition-transform duration-300 ease-out group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-[#1c1c1e] transition-all duration-300 group-hover:brightness-110">
                 {/* Abstract App Icons Pattern */}
                 <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                 }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 w-8 rounded-lg bg-orange-500/80"></div>
                    <div className="h-8 w-8 rounded-lg bg-blue-500/80"></div>
                    <div className="h-8 w-8 rounded-lg bg-green-500/80"></div>
                    <div className="h-8 w-8 rounded-lg bg-purple-500/80"></div>
                 </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                Apps
              </h3>
              <p className="font-body text-sm leading-relaxed text-[#B0B8D0] max-w-[95%]">
                Enjoy some of the best Apps for music, gaming, creating, and more!
              </p>
              <div className="mt-2">
                <a 
                  href="/apps" 
                  className="inline-block rounded-lg bg-[#3e3e40] hover:bg-[#4d4d50] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:shadow-md"
                >
                  Browse
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}