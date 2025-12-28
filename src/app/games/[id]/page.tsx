"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import SteamRushNavbar from "@/components/sections/steamrush-navbar";
import Footer from "@/components/sections/footer";
import { MessageCircle, ArrowLeft, Check, Monitor, HardDrive, Cpu, Calendar } from "lucide-react";
import Link from "next/link";
import { GAMES_DATABASE } from "@/data/games";
import { useEffect, useState } from "react";
import { getSteamGameDetails, parseSystemRequirements, stripHtmlTags, type SteamGameDetails } from "@/lib/steam-api";

export default function GameDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  // Find game in our database
  const game = GAMES_DATABASE.find((g) => g.id === id);
  
  const [steamData, setSteamData] = useState<SteamGameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(-1); // -1 = show header image

  useEffect(() => {
    async function fetchSteamData() {
      if (game?.steamAppId) {
        console.log(`Fetching Steam data for App ID: ${game.steamAppId}`);
        try {
          const data = await getSteamGameDetails(game.steamAppId);
          console.log('Steam data received:', data ? 'Success' : 'No data');
          if (data) {
            console.log('Full Steam Data:', data);
            console.log('Screenshots:', data.screenshots);
            if (data.screenshots && data.screenshots.length > 0) {
              console.log('First screenshot object:', data.screenshots[0]);
              console.log('Screenshot path_full:', data.screenshots[0].pathFull);
              console.log('Screenshot path_thumbnail:', data.screenshots[0].pathThumbnail);
            }
            console.log('Short Description:', data.shortDescription);
            console.log('About the Game:', data.aboutTheGame);
            console.log('PC Requirements:', data.pcRequirements);
          }
          setSteamData(data);
        } catch (error) {
          console.error('Error fetching Steam data:', error);
        }
      } else {
        console.log('No Steam App ID for this game');
      }
      setLoading(false);
    }
    fetchSteamData();
  }, [game?.steamAppId]);

  if (!game) {
    return (
      <main className="min-h-screen bg-[#0A0E27]">
        <SteamRushNavbar />
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

  // Parse system requirements if available
  const minRequirements = steamData?.pcRequirements?.minimum 
    ? parseSystemRequirements(steamData.pcRequirements.minimum)
    : null;

  const recRequirements = steamData?.pcRequirements?.recommended
    ? parseSystemRequirements(steamData.pcRequirements.recommended)
    : null;

  // Use Steam screenshots or fallback to game image
  // Filter out any empty or invalid URLs
  const screenshots = steamData?.screenshots && steamData.screenshots.length > 0
    ? steamData.screenshots
        .map(s => s.pathFull)
        .filter(url => url && url.trim() !== '')
    : [];
  
  // Always have at least the game image
  const displayScreenshots = screenshots.length > 0 ? screenshots : [game.image];
  
  // Steam header for initial load
  const headerImage = (steamData?.headerImage && steamData.headerImage.trim() !== '') 
    ? steamData.headerImage 
    : game.image;
  
  // Main display image - show header by default (-1), or selected screenshot
  const currentDisplayImage = selectedScreenshotIndex === -1 
    ? headerImage 
    : (displayScreenshots[selectedScreenshotIndex] || headerImage);

  // Clean description
  const description = steamData?.shortDescription 
    ? stripHtmlTags(steamData.shortDescription)
    : game.description || `Experience ${game.title}, an exciting ${game.genre.join(" & ")} game.`;

  const aboutGame = steamData?.aboutTheGame
    ? stripHtmlTags(steamData.aboutTheGame)
    : steamData?.detailedDescription
    ? stripHtmlTags(steamData.detailedDescription)
    : description;

  return (
    <main className="min-h-screen bg-[#0A0E27]">
      <SteamRushNavbar />
      
      <div className="pt-20 lg:pt-24 pb-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
          
          <Link 
            href="/games"
            className="inline-flex items-center gap-2 text-[#B0B8D0] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            
            {/* Left Column - Game Details */}
            <div className="w-full min-w-0">
              {/* Steam-Style Hero Section: Main Image + Preview Grid */}
              <div className="w-full flex gap-1.5 mb-2">
                {/* Main Display Image */}
                <div className="relative flex-1 max-w-[62%] aspect-video rounded overflow-hidden bg-[#1A1F3A]">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center text-[#B0B8D0]">
                      Loading...
                    </div>
                  ) : (
                    <Image
                      key={currentDisplayImage}
                      src={currentDisplayImage}
                      alt={game.title}
                      fill
                      className="object-cover transition-opacity duration-200 ease-in-out"
                      priority
                      sizes="600px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = game.image;
                      }}
                    />
                  )}
                </div>

                {/* Preview Grid (2x2) */}
                {!loading && displayScreenshots.length > 0 && (
                  <div className="flex-1 max-w-[37%] grid grid-cols-2 grid-rows-2 gap-1.5">
                    {displayScreenshots.slice(0, 4).map((screenshot, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedScreenshotIndex(idx)}
                        className={`relative aspect-video rounded overflow-hidden cursor-pointer transition-all ${
                          selectedScreenshotIndex === idx
                            ? 'ring-2 ring-[#0074E4]'
                            : 'hover:ring-1 hover:ring-[#0074E4]/60'
                        }`}
                      >
                        <Image
                          src={screenshot}
                          alt={`Preview ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="180px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = game.image;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scrollable Thumbnail Gallery - Below Hero */}
              {!loading && displayScreenshots.length > 0 && (
                <div className="w-full mb-6">
                  <div 
                    className="overflow-x-scroll overflow-y-hidden pb-2"
                    style={{ 
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#2A2E4D transparent'
                    }}
                  >
                    <div className="flex gap-1.5 w-max">
                      {/* Main Header Thumbnail */}
                      <div
                        onClick={() => setSelectedScreenshotIndex(-1)}
                        className={`relative w-[110px] h-[62px] flex-shrink-0 rounded overflow-hidden transition-all cursor-pointer ${
                          selectedScreenshotIndex === -1
                            ? 'ring-2 ring-[#0074E4]'
                            : 'ring-1 ring-[#2A2E4D] hover:ring-[#0074E4]'
                        }`}
                      >
                        <Image
                          src={headerImage}
                          alt="Main poster"
                          fill
                          className="object-cover"
                          sizes="110px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = game.image;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-1">
                          <span className="text-white text-[9px] font-bold uppercase tracking-wider">Main</span>
                        </div>
                      </div>

                      {/* First 6 Screenshot Thumbnails Only */}
                      {displayScreenshots.slice(0, 6).map((screenshot, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedScreenshotIndex(idx)}
                          className={`relative w-[110px] h-[62px] flex-shrink-0 rounded overflow-hidden transition-all cursor-pointer ${
                            selectedScreenshotIndex === idx
                              ? 'ring-2 ring-[#0074E4]'
                              : 'ring-1 ring-[#2A2E4D] hover:ring-[#0074E4]'
                          }`}
                        >
                          <Image
                            src={screenshot}
                            alt={`Screenshot ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="110px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = game.image;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* About This Game */}
              <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
                {loading ? (
                  <div className="text-[#B0B8D0]">Loading game description...</div>
                ) : (
                  <>
                    <p className="text-[#B0B8D0] leading-relaxed whitespace-pre-line">
                      {aboutGame}
                    </p>

                    {/* Game Info */}
                    {steamData && (
                      <div className="mt-6 pt-6 border-t border-[#2A2E4D] grid grid-cols-2 gap-4">
                        {steamData.developers && steamData.developers.length > 0 && (
                          <div>
                            <div className="text-[#60A5FA] text-sm mb-1">Developer</div>
                            <div className="text-white font-semibold">{steamData.developers.join(", ")}</div>
                          </div>
                        )}
                        {steamData.publishers && steamData.publishers.length > 0 && (
                          <div>
                            <div className="text-[#60A5FA] text-sm mb-1">Publisher</div>
                            <div className="text-white font-semibold">{steamData.publishers.join(", ")}</div>
                          </div>
                        )}
                        {steamData.releaseDate && (
                          <div>
                            <div className="text-[#60A5FA] text-sm mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Release Date
                            </div>
                            <div className="text-white font-semibold">{steamData.releaseDate.date}</div>
                          </div>
                        )}
                        {game.genre && game.genre.length > 0 && (
                          <div>
                            <div className="text-[#60A5FA] text-sm mb-1">Genre</div>
                            <div className="text-white font-semibold">{game.genre.join(", ")}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* System Requirements */}
              {!loading && (minRequirements || recRequirements) && (
                <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Monitor className="w-6 h-6" />
                    System Requirements
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Minimum */}
                    {minRequirements && (
                      <div>
                        <h3 className="text-lg font-bold text-[#60A5FA] mb-4">Minimum</h3>
                        <div className="space-y-3 text-sm">
                          {minRequirements.os && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <Monitor className="w-4 h-4" />
                                <span className="font-semibold">OS:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{minRequirements.os}</p>
                            </div>
                          )}
                          {minRequirements.processor && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <Cpu className="w-4 h-4" />
                                <span className="font-semibold">Processor:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{minRequirements.processor}</p>
                            </div>
                          )}
                          {minRequirements.memory && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <HardDrive className="w-4 h-4" />
                                <span className="font-semibold">Memory:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{minRequirements.memory}</p>
                            </div>
                          )}
                          {minRequirements.graphics && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <Monitor className="w-4 h-4" />
                                <span className="font-semibold">Graphics:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{minRequirements.graphics}</p>
                            </div>
                          )}
                          {minRequirements.storage && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <HardDrive className="w-4 h-4" />
                                <span className="font-semibold">Storage:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{minRequirements.storage}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recommended */}
                    {recRequirements && (
                      <div>
                        <h3 className="text-lg font-bold text-[#60A5FA] mb-4">Recommended</h3>
                        <div className="space-y-3 text-sm">
                          {recRequirements.os && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <Monitor className="w-4 h-4" />
                                <span className="font-semibold">OS:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{recRequirements.os}</p>
                            </div>
                          )}
                          {recRequirements.processor && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <Cpu className="w-4 h-4" />
                                <span className="font-semibold">Processor:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{recRequirements.processor}</p>
                            </div>
                          )}
                          {recRequirements.memory && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <HardDrive className="w-4 h-4" />
                                <span className="font-semibold">Memory:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{recRequirements.memory}</p>
                            </div>
                          )}
                          {recRequirements.graphics && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <Monitor className="w-4 h-4" />
                                <span className="font-semibold">Graphics:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{recRequirements.graphics}</p>
                            </div>
                          )}
                          {recRequirements.storage && (
                            <div>
                              <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                                <HardDrive className="w-4 h-4" />
                                <span className="font-semibold">Storage:</span>
                              </div>
                              <p className="text-[#B0B8D0] ml-6">{recRequirements.storage}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Purchase Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-[#1A1F3A] border border-[#2A2E4D] rounded-lg p-6">
                <div className="mb-4">
                  <span className="text-[#B0B8D0] text-sm">{game.genre.join(" • ")}</span>
                  <h1 className="text-3xl font-black text-white mt-1">{game.title}</h1>
                </div>

                <div className="mb-6">
                  <p className="text-[#B0B8D0] text-sm">{description.substring(0, 150)}...</p>
                </div>

                {/* Pricing */}
                <div className="bg-[#0A0E27] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#0074E4] text-white text-sm font-bold px-2 py-1 rounded">
                      {game.discount}
                    </span>
                    <span className="text-[#B0B8D0] text-sm">SteamRush Special</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-black text-3xl">₹{game.price}</span>
                    <span className="text-[#B0B8D0] line-through text-lg">₹{game.originalPrice}</span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <button
                  onClick={() => window.open(`https://wa.me/917752805529?text=I want to buy ${game.title}`, '_blank')}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#25D366] text-white font-bold text-lg px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-[0_8px_30px_rgba(37,211,102,0.25)] flex items-center justify-center gap-3 mb-4"
                >
                  <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
                  Buy via WhatsApp
                </button>

                {/* Trust Badges */}
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

                {/* Platform Support */}
                {steamData?.platforms && (
                  <div className="mt-4 pt-4 border-t border-[#2A2E4D]">
                    <div className="text-[#60A5FA] text-xs mb-2">Available on:</div>
                    <div className="flex gap-2">
                      {steamData.platforms.windows && (
                        <span className="bg-[#0A0E27] px-2 py-1 rounded text-xs text-white">Windows</span>
                      )}
                      {steamData.platforms.mac && (
                        <span className="bg-[#0A0E27] px-2 py-1 rounded text-xs text-white">Mac</span>
                      )}
                      {steamData.platforms.linux && (
                        <span className="bg-[#0A0E27] px-2 py-1 rounded text-xs text-white">Linux</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
