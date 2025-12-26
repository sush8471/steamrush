export default function GiftingFeature() {
  return (
    <section className="w-full bg-[#0A0E27] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto w-full max-w-[640px]">
          {/* Card Container */}
          <div className="group flex flex-col gap-6">
            {/* Image Area - Recreated CSS Placeholder since asset is missing */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-gradient-to-br from-[#005c28] via-[#008f3e] to-[#00b24e] shadow-xl transition-transform duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                {/* Background Pattern Effects */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.4) 0%, transparent 20%)',
                    backgroundSize: '100% 100%'
                }} />
                
                {/* Gift Icon / Graphic */}
                <div className="relative z-10 mb-4 text-[#fcd34d] drop-shadow-lg">
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-16 w-16 md:h-20 md:w-20"
                    >
                      <rect x="3" y="8" width="18" height="4" rx="1" />
                      <path d="M12 8v13" />
                      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                    </svg>
                </div>

                {/* Typography Graphics */}
                <div className="relative z-10 text-center drop-shadow-md">
                  <h2 className="font-display text-4xl font-extrabold uppercase tracking-wide text-[#fcd34d] sm:text-5xl md:text-6xl">
                    Gifting
                  </h2>
                  <div className="mt-1 flex items-center justify-center gap-3">
                    <div className="h-0.5 w-8 bg-white/70" />
                    <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white sm:text-base">
                      Now Available
                    </span>
                    <div className="h-0.5 w-8 bg-white/70" />
                  </div>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="font-display text-[18px] md:text-[20px] font-bold leading-tight text-white tracking-normal">
                Gifting on the Epic Games Store
              </h3>
              
              <p className="max-w-prose text-[14px] leading-relaxed text-[#B0B8D0]">
                Send games and add-ons to your friends, earn Epic Rewards with every purchase, or use your balance toward the next gift you give. Restrictions apply.
              </p>

              <Link 
                href="#" 
                className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-[#333333] px-6 text-[14px] font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-[#4d4d4d] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}