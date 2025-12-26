"use client";

import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import HowItWorks from "@/components/sections/how-it-works";
import WhatsAppCTA from "@/components/sections/whatsapp-cta";
import GameCardsGridDiscover from "@/components/sections/game-cards-grid-discover";
import ComboDealSection from "@/components/sections/combo-deals";
import SocialProof from "@/components/sections/social-proof";
import UpcomingGames from "@/components/sections/upcoming-games";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import SteamRushNavbar from "@/components/sections/steamrush-navbar";
import { Typewriter } from "@/components/ui/typewriter-text";

const GAME_POSTERS = [
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891250718.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/project-w-1vp1b-1765891281211.jpg?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891321984.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891423972.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891429645.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891467635.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891624761.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891720876.png?width=8000&height=8000&resize=contain",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1765891811347.png?width=8000&height=8000&resize=contain",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0E27]">
      <SteamRushNavbar />
      <AnimatedMarqueeHero
        tagline={
          <Typewriter
            text={[
              "India's Largest Offline Activation Steam Store",
              "Most Affordable Gaming Destination",
              "Instant Delivery via WhatsApp"
            ]}
            speed={80}
            deleteSpeed={50}
            delay={2000}
            loop={true}
          />
        }
        title={
          <>
            Get Your Favorite
            <br />
            PC Games Today
          </>
        }
        description="Original Steam games delivered instantly via WhatsApp. Easy payment, fast delivery, trusted by thousands."
        ctaText="Browse Games"
        images={GAME_POSTERS}
      />

      <HowItWorks />
      <div id="hot-deals">
        <GameCardsGridDiscover />
      </div>
      <ComboDealSection />
      <SocialProof />
      <WhatsAppCTA variant="secondary" title="Found Your Game?" description="" />

      <UpcomingGames />
      <div id="faq">
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
