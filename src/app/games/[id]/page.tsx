"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import NavigationBar from "@/components/sections/navigation-bar";
import Footer from "@/components/sections/footer";
import { MessageCircle, ArrowLeft, Check, Monitor, HardDrive, Cpu } from "lucide-react";
import Link from "next/link";

const GAME_DATA: Record<string, {
  id: number;
  title: string;
  image: string;
  screenshots: string[];
  price: string;
  originalPrice: string;
  discount: string;
  type: string;
  description: string;
  longDescription: string;
  features: string[];
  systemRequirements: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
}> = {
  "1": {
    id: 1,
    title: "Red Dead Redemption 2",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/santas-war-on--christmas-1sp1p-16.png",
    screenshots: [
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/santas-war-on--christmas-1sp1p-16.png",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/where-winds-meet-gd7a4-17.jpg",
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/237552e5-fe58-4d63-badd-8df67424fbd4-store-epicgames-com/assets/images/shrines-legacy-1ityh-18.jpg",
    ],
    price: "₹499",
    originalPrice: "₹899",
    discount: "-45%",
    type: "Action",
    description: "Epic Western adventure in stunning open world",
    longDescription: "Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online.",
    features: [
      "Massive open world set in the Wild West",
      "Engaging story-driven campaign",
      "Rich character development and interactions",
      "Hunting, fishing, and survival mechanics",
      "Online multiplayer mode included",
      "Stunning graphics and realistic physics"
    ],
    systemRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
      memory: "12 GB RAM",
      graphics: "Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB",
      storage: "150 GB available space"
    }
  },
};

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = GAME_DATA[gameId];

  if (!game) {
    return (
      <main className="min-h-screen bg-[#0A0E27]">
        <NavigationBar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-3xl text-white mb-4">Game not found</h1>
          <Link href="/games" className="text-[#0074E4] hover:underline">
            Back to browse
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0E27]">
      <NavigationBar />
      
      <div className="pt-20 lg:pt-24 pb-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
          
          <Link 
            href="/games"
            className="inline-flex items-center gap-2 text-[#B0B8D0] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            
            <div>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>

              <div className="flex gap-2 mb-8 overflow-x-auto">
                {game.screenshots.map((screenshot, idx) => (
                  <div key={idx} className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden border border-[#2A2E4D] hover:border-[#0074E4] transition-colors cursor-pointer">
                    <Image
                      src={screenshot}
                      alt={`Screenshot ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
                <p className="text-[#B0B8D0] leading-relaxed mb-6">
                  {game.longDescription}
                </p>

                <h3 className="text-xl font-bold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {game.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[#B0B8D0]">
                      <Check className="w-5 h-5 text-[#0074E4] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-6 h-6" />
                  System Requirements
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                      <Monitor className="w-4 h-4" />
                      <span className="font-semibold">OS:</span>
                    </div>
                    <p className="text-[#B0B8D0] ml-6">{game.systemRequirements.os}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                      <Cpu className="w-4 h-4" />
                      <span className="font-semibold">Processor:</span>
                    </div>
                    <p className="text-[#B0B8D0] ml-6">{game.systemRequirements.processor}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                      <HardDrive className="w-4 h-4" />
                      <span className="font-semibold">Memory:</span>
                    </div>
                    <p className="text-[#B0B8D0] ml-6">{game.systemRequirements.memory}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                      <Monitor className="w-4 h-4" />
                      <span className="font-semibold">Graphics:</span>
                    </div>
                    <p className="text-[#B0B8D0] ml-6">{game.systemRequirements.graphics}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                      <HardDrive className="w-4 h-4" />
                      <span className="font-semibold">Storage:</span>
                    </div>
                    <p className="text-[#B0B8D0] ml-6">{game.systemRequirements.storage}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg p-6">
                <div className="mb-4">
                  <span className="text-[#B0B8D0] text-sm">{game.type}</span>
                  <h1 className="text-3xl font-black text-white mt-1">{game.title}</h1>
                </div>

                <div className="mb-6">
                  <p className="text-[#B0B8D0] text-sm mb-3">{game.description}</p>
                </div>

                {game.discount && (
                  <div className="bg-[#0A0E27] rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#0074E4] text-white text-sm font-bold px-2 py-1 rounded">
                        {game.discount}
                      </span>
                      <span className="text-[#B0B8D0] text-sm">Limited Time Offer</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-black text-3xl">{game.price}</span>
                      <span className="text-[#B0B8D0] line-through text-lg">{game.originalPrice}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: `https://wa.me/917752805529?text=I want to buy ${game.title}` } }, "*")}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#25D366] text-white font-bold text-lg px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[0_8px_30px_rgba(37,211,102,0.25)] flex items-center justify-center gap-3 mb-4"
                >
                  <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
                  Buy via WhatsApp
                </button>

                <div className="space-y-2 text-[#B0B8D0] text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0074E4]" />
                    <span>Original Steam key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0074E4]" />
                    <span>Instant delivery via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0074E4]" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0074E4]" />
                    <span>Secure payment options</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
