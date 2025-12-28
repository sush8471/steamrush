"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MessageCircle, Check, Monitor, Share2, Info, ChevronLeft, ChevronRight, HelpCircle, Gamepad2, ShieldCheck, Zap, Clock, ThumbsUp } from "lucide-react";
import SteamRushNavbar from "@/components/sections/steamrush-navbar";
import Footer from "@/components/sections/footer";
import { getSteamGameDetails, parseSystemRequirements, type SteamGameDetails } from "@/lib/steam-api";
import { GAMES_DATABASE } from "@/data/games";
import { motion, Variants } from "framer-motion";
import ThumbnailCarousel from "../../../components/ui/thumbnail-carousel";

// Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded ${className}`} />
);

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div className="border-b border-white/5 last:border-0">
    <button 
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left group"
    >
      <span className="text-white font-bold text-[13px] lg:text-sm pr-4 tracking-tight leading-snug">{question}</span>
      <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-[#00B4FF]/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
        <ChevronDown className={`w-3.5 h-3.5 text-[#00B4FF] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[400px] pb-6' : 'max-h-0'}`}>
      <p className="text-[#8F98A0] text-[13px] leading-[1.8] font-light">{answer}</p>
    </div>
  </div>
);

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function GTAVPage() {
  const game = GAMES_DATABASE.find((g) => g.id === "gta-v");
  const [steamData, setSteamData] = useState<SteamGameDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [showAdditional, setShowAdditional] = useState(false);

  useEffect(() => {
    async function fetchSteamData() {
      if (game?.steamAppId) {
        try {
          const data = await getSteamGameDetails(game.steamAppId);
          setSteamData(data);
        } catch (error) {
          console.error("Error fetching Steam data:", error);
        }
      }
      setLoading(false);
    }
    fetchSteamData();

    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [game?.steamAppId]);

  if (!game) return null;

  // Data Processing
  const minRequirements = steamData?.pcRequirements?.minimum ? parseSystemRequirements(steamData.pcRequirements.minimum) : null;
  const recRequirements = steamData?.pcRequirements?.recommended ? parseSystemRequirements(steamData.pcRequirements.recommended) : null;
  const screenshots = steamData?.screenshots?.map(s => s.pathFull).filter(Boolean) || [];
  const headerImage = steamData?.headerImage || game.image;
  const allGalleryImages = [headerImage, ...screenshots];
  const description = steamData?.shortDescription || game.description || "";
  const aboutGame = steamData?.aboutTheGame || steamData?.detailedDescription || description;

  // Refined Similar games logic
  const similarGames = GAMES_DATABASE
    .filter(g => g.id !== game.id)
    .map(g => {
      let score = 0;
      // Boost same series (GTA IV)
      if (g.series === game.series) score += 10;
      // Boost same developer/publisher vibes (Rockstar Games)
      if (g.tags.some(t => t.includes('rockstar'))) score += 8;
      // Boost same core gameplay loop (Crime + Open World)
      if (g.tags.includes('crime') || g.tags.includes('mafia')) score += 5;
      if (g.genre.includes('Open-World')) score += 3;
      // Match general genres
      const commonGenres = g.genre.filter(gen => game.genre.includes(gen)).length;
      score += commonGenres;
      
      return { game: g, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.game)
    .slice(0, 6);

  // FAQ data
  const faqData = [
    { question: "Is this an official Steam key?", answer: "Yes! All our keys are 100% official Steam keys sourced from authorized distributors. You'll receive a genuine key that activates directly on Steam." },
    { question: "How fast will I receive my key?", answer: "Instantly! Once your payment is confirmed via WhatsApp, we'll send your Steam key within minutes. Most orders are fulfilled in under 5 minutes." },
    { question: "What payment methods do you accept?", answer: "We accept UPI, bank transfers, and all major digital payment methods through WhatsApp. Just message us and we'll guide you through the process." },
    { question: "Can I refund if there's an issue?", answer: "We stand behind every sale. If there's any issue with your key, contact us immediately on WhatsApp and we'll resolve it or provide a full refund." },
  ];

  const cleanText = (text: string) => text.replace(/<[^>]*>?/gm, '');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: game.title,
          text: `Check out ${game.title} on SteamRush!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0E27] text-white selection:bg-[#00B4FF] selection:text-white pb-28 lg:pb-12">
      <SteamRushNavbar />
      
      {/* IMMERSIVE BACKGROUND */}
      <div className="fixed inset-0 h-screen -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27]/20 via-[#0A0E27]/80 to-[#0A0E27] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E27]/50 via-transparent to-[#0A0E27]/50 z-10" />
        <Image 
          src={headerImage} 
          alt="" 
          fill 
          className="object-cover opacity-40 blur-[80px] scale-125 saturate-150 animate-pulse-slow" 
          priority 
        />
      </div>

      <div className="pt-[68px] lg:pt-24 pb-40 lg:pb-12 w-full">
        <div className="mx-auto max-w-[1400px] px-0 lg:px-8">
          
          {/* Breadcrumbs - Desktop */}
          <div className="hidden lg:flex items-center justify-between mb-6 px-4 lg:px-0">
            <Link href="/games" className="inline-flex items-center gap-2 text-sm font-medium text-[#8F98A0] hover:text-white transition-colors group">
              <div className="p-1 rounded-full bg-white/5 group-hover:bg-[#00B4FF] transition-colors">
                <ArrowLeft className="w-4 h-4 text-white" />
              </div>
              <span>Back to Store</span>
            </Link>
            <button onClick={handleShare} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#8F98A0] hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-0 lg:gap-12 items-start">
            
            {/* === LEFT COLUMN === */}
            <div className="w-full min-w-0 flex flex-col gap-0 lg:gap-8">
              
              {/* SWIPEABLE GALLERY */}
              <div className="relative w-full group">
                 {/* Cinematic Glow (Desktop) */}
                 <div className="hidden lg:block absolute -inset-10 bg-gradient-to-r from-[#00B4FF]/20 to-[#A4D007]/20 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                 {loading ? (
                   <Skeleton className="w-full aspect-video rounded-xl" />
                 ) : (
                   <ThumbnailCarousel images={allGalleryImages} />
                 )}
              </div>

              {/* MOBILE: COMPACT INFO CARD */}
              <div className="lg:hidden px-5 py-8 bg-gradient-to-b from-[#0d1229] to-transparent">
                <h1 className="text-3xl font-black text-white leading-tight mb-4 drop-shadow-lg">{game.title}</h1>
                
                {/* Review Badge Mobile */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#00B4FF]/10 border border-[#00B4FF]/20 rounded-full">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#00B4FF] fill-[#00B4FF]" />
                    <span className="text-[11px] font-bold text-[#00B4FF] uppercase tracking-wider">Overwhelmingly Positive</span>
                  </div>
                  <span className="text-[#8F98A0] text-[11px] font-medium">(98%)</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {game.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-[#151922] text-[#C6D4DF] text-[10px] font-semibold rounded-md border border-white/5 uppercase tracking-wide">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#4c6b22] px-2 py-1 rounded shadow-inner">
                        <span className="text-[#a4d007] text-sm font-black">{game.discount}</span>
                      </div>
                      <div>
                        <span className="text-[#8F98A0] text-xs line-through block">₹{game.originalPrice}</span>
                        <span className="text-white text-xl font-black">₹{game.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => window.open(`https://wa.me/917752805529?text=I want to buy ${game.title}`, '_blank')}
                    className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-base py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Buy via WhatsApp
                  </button>
                  
                  <div className="mt-3 flex items-center justify-center gap-4 text-[#8F98A0] text-[11px]">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#25D366]" /> Instant Key</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#25D366]" /> 24/7 Support</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 text-xs">
                  <div>
                    <span className="text-[#8F98A0] block">Developer</span>
                    <span className="text-white font-medium">{steamData?.developers?.[0] || "Rockstar North"}</span>
                  </div>
                  <div>
                    <span className="text-[#8F98A0] block">Publisher</span>
                    <span className="text-white font-medium">{steamData?.publishers?.[0] || "Rockstar Games"}</span>
                  </div>
                </div>
              </div>

              {/* ABOUT SECTION */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-none lg:rounded-3xl p-6 lg:p-12 shadow-2xl mt-4 lg:mt-12"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00B4FF]/50 to-transparent" />
                
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-4 h-4 text-[#00B4FF]" />
                  <h2 className="text-base lg:text-lg font-bold text-white tracking-wide">ABOUT THIS GAME</h2>
                </div>
                
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                  </div>
                ) : (
                  <div className={`relative text-[#C6D4DF] leading-relaxed whitespace-pre-line font-light text-sm lg:text-[15px] transition-all duration-500 ${isDescExpanded ? 'max-h-[2000px]' : 'max-h-[72px] lg:max-h-[80px] overflow-hidden'}`}>
                    {cleanText(aboutGame)}
                  </div>
                )}

                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="mt-3 flex items-center gap-1.5 text-[#00B4FF] hover:text-[#00B4FF]/80 font-bold text-xs uppercase tracking-wider transition-all group"
                >
                  {isDescExpanded ? 'Show Less' : 'Read More'}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDescExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                </button>
              </motion.div>

              {/* SYSTEM REQUIREMENTS - Collapsible on Mobile */}
              {(minRequirements || recRequirements) && (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-none lg:rounded-3xl p-6 lg:p-12 shadow-2xl mt-8 lg:mt-16"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <Monitor className="w-5 h-5 text-[#00B4FF]" />
                    <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">SYSTEM REQUIREMENTS</h2>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <>
                      {/* Mobile: Refined Toggle View */}
                      <div className="lg:hidden">
                        <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 mb-8">
                          <button 
                            onClick={() => setShowRecommended(false)}
                            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg transition-all duration-300 ${!showRecommended ? 'bg-[#00B4FF] text-white shadow-[0_0_15px_rgba(0,180,255,0.3)]' : 'text-[#8F98A0] hover:text-white'}`}
                          >
                            Minimum
                          </button>
                          <button 
                            onClick={() => setShowRecommended(true)}
                            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg transition-all duration-300 ${showRecommended ? 'bg-[#A4D007] text-white shadow-[0_0_15px_rgba(164,208,7,0.3)]' : 'text-[#8F98A0] hover:text-white'}`}
                          >
                            Recommended
                          </button>
                        </div>
                        
                        <div className="space-y-6">
                          {Object.entries((showRecommended ? recRequirements : minRequirements) || {}).filter(([key]) => key.toLowerCase() !== 'additional').map(([key, val]) => (
                            <div key={key} className="flex flex-col border-b border-white/5 pb-4 last:border-0 last:pb-0">
                              <span className="text-[#8F98A0] text-[9px] uppercase tracking-[0.2em] font-black mb-2 opacity-60">{key}</span>
                              <span className="text-white/90 font-medium text-sm leading-relaxed">{val as string}</span>
                            </div>
                          ))}
                        </div>

                        {/* Additional Notes - Collapsible */}
                        {((showRecommended ? recRequirements : minRequirements) as Record<string, string>)?.additional && (
                          <div className="mt-4 border-t border-white/10 pt-3">
                            <button
                              onClick={() => setShowAdditional(!showAdditional)}
                              className="w-full flex items-center justify-between py-2 text-[#8F98A0] hover:text-white transition-colors"
                            >
                              <span className="text-xs font-medium uppercase tracking-wide">Additional Notes</span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdditional ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${showAdditional ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <p className="text-[#8F98A0] text-xs leading-relaxed pt-2">
                                {((showRecommended ? recRequirements : minRequirements) as Record<string, string>)?.additional}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Desktop: Side by Side */}
                      <div className="hidden lg:block">
                        <div className="grid grid-cols-2 gap-12 divide-x divide-white/5">
                          <div className="space-y-6">
                            <div className="text-[#00B4FF] text-[11px] font-black uppercase tracking-[0.2em] bg-[#00B4FF]/10 w-fit px-4 py-2 rounded-full border border-[#00B4FF]/20 shadow-[0_0_20px_rgba(0,180,255,0.1)]">Minimum</div>
                            <div className="space-y-3 text-sm">
                              {Object.entries(minRequirements || {}).filter(([key]) => key.toLowerCase() !== 'additional').map(([key, val]) => (
                                <div key={key}>
                                  <span className="text-[#8F98A0] text-[10px] uppercase font-black tracking-[0.1em] block mb-2 opacity-50">{key}</span>
                                  <span className="text-white/90 font-medium leading-relaxed">{val as string}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-6 pl-12">
                            <div className="text-[#A4D007] text-[11px] font-black uppercase tracking-[0.2em] bg-[#A4D007]/10 w-fit px-4 py-2 rounded-full border border-[#A4D007]/20 shadow-[0_0_20px_rgba(164,208,7,0.1)]">Recommended</div>
                            <div className="space-y-5 text-sm">
                              {Object.entries(recRequirements || {}).filter(([key]) => key.toLowerCase() !== 'additional').map(([key, val]) => (
                                <div key={key}>
                                  <span className="text-[#8F98A0] text-[10px] uppercase font-black tracking-[0.1em] block mb-2 opacity-50">{key}</span>
                                  <span className="text-white/90 font-medium leading-relaxed">{val as string}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Additional Notes - Desktop */}
                        {((minRequirements as Record<string, string>)?.additional || (recRequirements as Record<string, string>)?.additional) && (
                          <div className="mt-6 border-t border-white/10 pt-2 -mx-8 -mb-8">
                            <button
                              onClick={() => setShowAdditional(!showAdditional)}
                              className="w-full flex items-center justify-between px-8 py-4 hover:bg-white/5 transition-all text-[#8F98A0] hover:text-white"
                            >
                              <span className="text-xs font-bold uppercase tracking-wide">Additional Notes</span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdditional ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 bg-black/20 ${showAdditional ? 'max-h-[500px] opacity-100 px-8 py-4 pb-8' : 'max-h-0 opacity-0 px-8 py-0'}`}>
                              <p className="text-[#8F98A0] text-sm leading-relaxed max-w-2xl font-light">
                                {(minRequirements as Record<string, string>)?.additional || (recRequirements as Record<string, string>)?.additional}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* FAQ SECTION */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-none lg:rounded-3xl p-6 lg:p-12 shadow-2xl mt-8 lg:mt-16"
              >
                <div className="flex items-center gap-3 mb-5">
                  <HelpCircle className="w-5 h-5 text-[#00B4FF]" />
                  <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">FREQUENTLY ASKED</h2>
                </div>
                
                <div className="space-y-2">
                  {faqData.map((faq, idx) => (
                    <FAQItem 
                      key={idx}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFAQ === idx}
                      onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    />
                  ))}
                </div>
              </motion.div>

              {/* SIMILAR GAMES */}
              {similarGames.length > 0 && (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-none lg:rounded-3xl p-6 lg:p-12 shadow-2xl mt-8 lg:mt-16"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Gamepad2 className="w-5 h-5 text-[#00B4FF]" />
                    <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">YOU MAY ALSO LIKE</h2>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1 snap-x snap-mandatory">
                    {similarGames.map((sg) => (
                      <Link 
                        key={sg.id}
                        href={`/games/${sg.id}`}
                        className="relative flex-shrink-0 w-[180px] lg:w-[200px] group snap-start"
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 ring-1 ring-white/10 group-hover:ring-2 group-hover:ring-[#00B4FF] group-hover:shadow-[0_0_20px_rgba(0,180,255,0.3)] transition-all duration-300">
                          <Image src={sg.image} alt={sg.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                          {sg.discount && (
                            <div className="absolute top-3 left-3 bg-[#4c6b22] text-[#a4d007] text-xs font-bold px-2 py-1 rounded shadow-lg backdrop-blur-md">
                              {sg.discount}
                            </div>
                          )}
                        </div>
                        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-[#00B4FF] transition-colors mb-1">{sg.title}</h3>
                        <div className="flex items-center gap-2">
                          {sg.originalPrice && <span className="text-[#8F98A0] text-xs line-through">₹{sg.originalPrice}</span>}
                          <span className="text-white text-sm font-bold">₹{sg.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* === RIGHT COLUMN: DESKTOP STICKY PANEL === */}
            <div className="hidden lg:block relative">
              <div className="lg:sticky lg:top-24 space-y-4">
                
                {/* Desktop Sticky Panel Content with Motion */}
                <motion.div 
                  initial="hidden" 
                  animate="visible" 
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  <motion.div variants={fadeInUp}>
                     <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#00B4FF]/10 text-[#00B4FF] border border-[#00B4FF]/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">Base Game</span>
                        {steamData?.releaseDate?.date && <span className="text-[#8F98A0] text-xs">{steamData.releaseDate.date}</span>}
                      </div>
                      <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-2 tracking-tight drop-shadow-2xl">{game.title}</h1>
                      
                      {/* Review Badge Desktop */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00B4FF]/10 border border-[#00B4FF]/20 rounded-full hover:bg-[#00B4FF]/20 transition-colors cursor-help">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#00B4FF] fill-[#00B4FF]" />
                          <span className="text-xs font-bold text-[#00B4FF] uppercase tracking-wide">Overwhelmingly Positive</span>
                        </div>
                        <span className="text-[#8F98A0] text-xs hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white/20">
                          Based on 2,405,102 user reviews
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {game.genre.map((g) => (
                          <span key={g} className="px-3 py-1 bg-[#151922] hover:bg-[#00B4FF] text-[#C6D4DF] hover:text-white text-xs font-medium rounded transition-all cursor-pointer border border-white/10 hover:border-[#00B4FF] hover:shadow-[0_0_15px_rgba(0,180,255,0.4)] hover:-translate-y-0.5">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Trust Signals - Compact */}
                  <motion.div variants={fadeInUp} className="flex items-center justify-between gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                      <span className="text-[10px] text-[#8F98A0]">Official</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-[10px] text-[#8F98A0]">Instant</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#00B4FF]" />
                      <span className="text-[10px] text-[#8F98A0]">24/7</span>
                    </div>
                  </motion.div>

                  {/* INFO CARD */}
                  <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 space-y-5 text-sm shadow-xl">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-[#8F98A0] font-medium tracking-wide">Developer</span>
                      <span className="text-[#00B4FF] font-black uppercase tracking-wider text-xs bg-[#00B4FF]/5 px-3 py-1 rounded-md">{steamData?.developers?.[0] || "Rockstar North"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-[#8F98A0] font-medium tracking-wide">Publisher</span>
                      <span className="text-[#00B4FF] font-black uppercase tracking-wider text-xs bg-[#00B4FF]/5 px-3 py-1 rounded-md">{steamData?.publishers?.[0] || "Rockstar Games"}</span>
                    </div>
                  </motion.div>

                  {/* PURCHASE CARD */}
                  <motion.div variants={fadeInUp} className="bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_0_40px_rgba(0,180,255,0.15)] relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00B4FF]/20 blur-3xl group-hover:bg-[#00B4FF]/30 transition-all rounded-full" />
                    
                    <div className="relative z-10">
                      <h3 className="text-white font-bold text-lg mb-4">Buy {game.title}</h3>
                      
                      <div className="flex items-end gap-3 mb-6 bg-black/40 border border-white/5 p-3 rounded-lg backdrop-blur-sm">
                        <div className="flex flex-col items-center bg-[#4c6b22] px-2 py-1 rounded text-[#a4d007] leading-none shadow-inner">
                          <span className="text-[10px] font-bold uppercase">Discount</span>
                          <span className="text-lg font-black">{game.discount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#8F98A0] text-xs line-through">₹{game.originalPrice}</span>
                          <span className="text-[#00B4FF] text-3xl font-black leading-none tracking-tight drop-shadow-md">₹{game.price}</span>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => window.open(`https://wa.me/917752805529?text=I want to buy ${game.title}`, '_blank')}
                        className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-lg py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 group/btn"
                      >
                        <span>Purchase on WhatsApp</span>
                        <MessageCircle className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                      
                      <div className="mt-4 flex items-center justify-center gap-2 text-[#8F98A0] text-xs">
                        <Check className="w-3 h-3 text-[#25D366]" />
                        <span>Secure • Instant • Verified</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE STICKY BUY BAR - Sleek Floating Style */}
      <div className={`fixed bottom-4 left-4 right-4 bg-[#0A0E27]/90 backdrop-blur-2xl border border-white/10 rounded-2xl lg:hidden transform transition-all duration-500 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${showStickyNav ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#4c6b22] text-[#a4d007] text-[10px] font-black px-1.5 py-0.5 rounded shadow-inner">
              {game.discount}
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-[#8F98A0] text-[10px] line-through decoration-white/20">₹{game.originalPrice}</span>
              <span className="text-white text-xl font-black tracking-tight">₹{game.price}</span>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`https://wa.me/917752805529?text=I want to buy ${game.title}`, '_blank')}
            className="bg-[#25D366] text-white px-6 py-3 rounded-xl font-black text-[13px] flex items-center gap-2 shadow-[0_10px_20px_rgba(37,211,102,0.2)]"
          >
            Buy Now
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
