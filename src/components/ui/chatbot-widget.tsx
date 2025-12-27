"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, ShoppingCart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { FaWhatsapp } from "react-icons/fa";

interface GameData {
  name: string;
  price: number;
  id: string;
  image: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  gameData?: GameData;
}

export function ChatbotWidget() {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! 👋 I'm your gaming assistant. What game are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to get game image from name
  const getGameImage = (gameName: string): string => {
    const name = gameName.toLowerCase().trim();
    
    // Comprehensive game name to image mapping
    const gameImageMap: Record<string, string> = {
      // Popular games
      "gta v": "/gta-v.jpg",
      "grand theft auto v": "/gta-v.jpg",
      "gta 5": "/gta-v.jpg",
      "gta iv": "/gta-iv.png",
      "grand theft auto iv": "/gta-iv.png",
      "elden ring": "/elden-ring.jpg",
      "cyberpunk 2077": "/cyberpunk-2077.jpg",
      "red dead redemption 2": "/red-dead-redemption-2.jpg",
      "rdr2": "/red-dead-redemption-2.jpg",
      "hogwarts legacy": "/hogwarts-legacy.jpg",
      "spider-man remastered": "/spiderman-remastered.png",
      "spiderman remastered": "/spiderman-remastered.png",
      "marvel's spider-man": "/spiderman-remastered.png",
      "spider-man miles morales": "/spiderman-miles-morales.png",
      "spiderman miles morales": "/spiderman-miles-morales.png",
      "god of war": "/god-of-war.jpg",
      "god of war ragnarok": "/god-of-war-ragnarok.jpg",
      "the last of us": "/last-of-us-part-2.jpg",
      "last of us": "/last-of-us-part-2.jpg",
      "mafia definitive edition": "/mafia-definitive-edition.jpg",
      "detroit become human": "/detroit-become-human.png",
      "detroit: become human": "/detroit-become-human.png",
      "days gone": "/days-gone.jpg",
      "state of decay 2": "/state-of-decay-2.png",
      "uncharted": "/uncharted-legacy-thieves.jpg",
      "shadow of the tomb raider": "/shadow-tomb-raider.png",
      "tomb raider": "/shadow-tomb-raider.png",
      "witcher 3": "/witcher-3.jpg",
      "the witcher 3": "/witcher-3.jpg",
      "horizon zero dawn": "/horizon-zero-dawn.png",
      "horizon forbidden west": "/horizon-forbidden-west.jpg",
      "ghost of tsushima": "/ghost-of-tsushima.jpg",
      "sekiro": "/sekiro.jpg",
      "dark souls 3": "/dark-souls-3.jpg",
      "resident evil 2": "/resident-evil-2.jpg",
      "resident evil 3": "/resident-evil-3.jpg",
      "resident evil 4": "/resident-evil-4.png",
      "resident evil 7": "/resident-evil-7.jpg",
      "resident evil village": "/resident-evil-village.png",
      "silent hill 2": "/silent-hill-2.jpg",
      "dying light": "/dying-light.jpg",
      "dying light 2": "/dying-light-2.jpg",
      "far cry 3": "/far-cry-3.jpg",
      "far cry 4": "/far-cry-4.jpg",
      "far cry 5": "/far-cry-5.jpg",
      "far cry 6": "/far-cry-6.jpg",
      "assassin's creed valhalla": "/ac-valhalla.jpg",
      "ac valhalla": "/ac-valhalla.jpg",
      "assassin's creed origins": "/ac-origins.jpg",
      "ac origins": "/ac-origins.jpg",
      "assassin's creed odyssey": "/ac-odyssey.jpg",
      "ac odyssey": "/ac-odyssey.jpg",
      "assassin's creed unity": "/ac-unity.jpg",
      "ac unity": "/ac-unity.jpg",
      "assassin's creed mirage": "/ac-mirage.jpg",
      "ac mirage": "/ac-mirage.jpg",
      "hitman": "/hitman-world-assassination.jpg",
      "black myth wukong": "/black-myth-wukong.jpg",
      "black myth: wukong": "/black-myth-wukong.jpg",
      "forza horizon 5": "/forza-horizon-5.jpg",
      "forza horizon 4": "/forza-horizon-4.jpg",
      "need for speed heat": "/nfs-heat.jpg",
      "nfs heat": "/nfs-heat.jpg",
      "need for speed unbound": "/nfs-unbound.png",
      "nfs unbound": "/nfs-unbound.png",
      "f1 24": "/f1-24.jpg",
      "f1 25": "/f1-25.jpg",
      "fc 25": "/fc-25.jpg",
      "fifa 25": "/fc-25.jpg",
      "fc 24": "/fc-24.jpg",
      "fifa 24": "/fc-24.jpg",
      "tekken 8": "/tekken-8.jpg",
      "tekken 7": "/tekken-7.png",
      "street fighter 6": "/street-fighter-6.png",
      "mortal kombat 1": "/mortal-kombat-1.png",
      "mortal kombat 11": "/mortal-kombat-11.jpg",
      "persona 5 royal": "/persona-5-royal.jpg",
      "persona 3 reload": "/persona-3-reload.jpg",
      "starfield": "/starfield.jpg",
      "no man's sky": "/no-mans-sky.png",
      "hades": "/hades.png",
      "hollow knight": "/hollow-knight.png",
      "celeste": "/celeste.png",
      "terraria": "/terraria.jpg",
      "valheim": "/valheim.jpg",
      "the forest": "/the-forest.png",
      "sons of the forest": "/sons-of-the-forest.jpg",
      "subnautica": "/subnautica.jpg",
      "phasmophobia": "/phasmophobia.jpg",
      "lethal company": "/lethal-company.jpg",
    };

    // Direct match
    if (gameImageMap[name]) {
      return gameImageMap[name];
    }

    // Fuzzy match - improved logic
    // First try: check if the game name contains any key
    for (const [key, value] of Object.entries(gameImageMap)) {
      if (name.includes(key)) {
        return value;
      }
    }
    
    // Second try: check if any key contains the game name (for shorter names)
    for (const [key, value] of Object.entries(gameImageMap)) {
      if (key.includes(name) && name.length > 3) {
        return value;
      }
    }

    // Default fallback - use a generic gaming image
    return "/gta-v.jpg"; // Using GTA V as default since it's popular
  };

  // Helper function to extract game data from message content
  const extractGameData = (content: string): GameData | undefined => {
    // Pattern to detect price
    const priceRegex = /₹(\d+)/;
    const priceMatch = content.match(priceRegex);
    
    if (!priceMatch) return undefined;
    
    const price = parseInt(priceMatch[1]);
    
    // Extract the text right before the price (the actual game name)
    // This handles patterns like:
    // "Absolutely! Dive into the wizarding world: Hogwarts Legacy - ₹349"
    // "🎮 Shadow of the Tomb Raider - ₹199"
    // "Here you go: GTA V - ₹299"
    
    // Get everything before the price
    const textBeforePrice = content.substring(0, content.indexOf('₹')).trim();
    
    // Remove trailing dash and spaces
    const cleanText = textBeforePrice.replace(/\s*-\s*$/, '').trim();
    
    // Split by common separators (: or multiple spaces) and take the last part
    // This gets "Hogwarts Legacy" from "Absolutely! Dive into the wizarding world: Hogwarts Legacy"
    const parts = cleanText.split(/:\s+|[.!?]\s+/);
    let gameName = parts[parts.length - 1].trim();
    
    // Remove emoji and other special characters from the start
    gameName = gameName.replace(/^[🎮\s]+/, '').trim();
    
    // If the name is too long or contains multiple sentences, take the last meaningful part
    if (gameName.length > 100 || gameName.includes('!')) {
      // Look for the pattern: capitalize words after special chars
      const lastPart = gameName.split(/[!.?]\s+/).pop() || gameName;
      gameName = lastPart.trim();
    }
    
    // Final cleanup - remove any remaining conversational words
    const conversationalPrefixes = [
      'absolutely', 'here', 'sure', 'great', 'perfect', 'yes',
      'dive into', 'check out', 'take a look at', 'how about'
    ];
    
    const lowerName = gameName.toLowerCase();
    for (const prefix of conversationalPrefixes) {
      if (lowerName.startsWith(prefix)) {
        gameName = gameName.substring(prefix.length).trim();
        // Remove any colon or exclamation that might follow
        gameName = gameName.replace(/^[:!]\s*/, '').trim();
      }
    }
    
    if (!gameName || gameName.length < 2) return undefined;
    
    const name = gameName;
    // Create a simple ID from the name
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // Get the appropriate image for the game
    const image = getGameImage(name);
    
    return { name, price, id, image };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const webhookUrl = "https://tedic.app.n8n.cloud/webhook/steamrush";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: getSessionId(),
          timestamp: userMessage.timestamp.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      let data;
      
      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error("Invalid JSON response");
        }
      } else {
        data = { message: "✅ Got it! Let me help you find that game." };
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || data.response || "How can I help you find games?",
        timestamp: new Date(),
        gameData: extractGameData(data.message || data.response || ""),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Oops! Connection issue. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-3.5 sm:p-4 shadow-xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 w-[min(90vw,340px)] sm:w-[380px] h-[min(80vh,550px)] sm:h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3.5 flex items-center justify-between border-b border-blue-500/20">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-xl">
                <MessageCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-[15px] tracking-tight">Gaming AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-blue-100 text-[11px] font-medium">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3.5 bg-slate-950/50 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom duration-200`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-slate-800/90 backdrop-blur-sm text-slate-100 border border-slate-700/50 rounded-bl-md"
                    }`}
                  >
                    <p className="text-[13px] sm:text-[14px] leading-relaxed font-normal antialiased" style={{ letterSpacing: '0.01em' }}>
                      {msg.content}
                    </p>
                    <span className={`text-[10px] font-medium mt-1.5 block ${
                      msg.role === "user" ? "text-blue-100" : "text-slate-400"
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons for Game Replies */}
                {msg.role === "assistant" && msg.gameData && (
                  <div className="flex justify-start mt-2 ml-1 animate-in fade-in slide-in-from-bottom duration-300 delay-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addToCart({
                            id: msg.gameData!.id,
                            name: msg.gameData!.name,
                            price: msg.gameData!.price,
                            image: msg.gameData!.image,
                          });
                        }}
                        className="group flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="w-3 h-3" strokeWidth={2.5} />
                        <span>Add to Cart</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          const message = `Hi! I'm interested in ${msg.gameData!.name} (₹${msg.gameData!.price}). Can you help me?`;
                          const whatsappUrl = `https://wa.me/917752805529?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        className="group flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-green-500/30 hover:border-green-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <FaWhatsapp className="w-3 h-3" />
                        <span>Contact Us</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-slate-700/50 shadow-lg rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" strokeWidth={2.5} />
                    <span className="text-[13px] text-slate-300 font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 py-2.5 bg-slate-900/50 border-t border-slate-700/30">
              <p className="text-[11px] text-slate-400 font-medium mb-2">Quick ask:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "GTA games", query: "Show GTA games" },
                  { label: "Under ₹300", query: "Games under ₹300" },
                  { label: "Best RPGs", query: "Best RPGs" }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setInput(item.query);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600/50 hover:border-blue-500/50 transition-all duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-slate-900/80 border-t border-slate-700/30 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about games..."
                disabled={isLoading}
                className="flex-1 bg-slate-800/80 border border-slate-600/50 rounded-xl px-3.5 py-2.5 text-[13px] sm:text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all font-normal antialiased"
                style={{ letterSpacing: '0.01em' }}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Send className="w-4.5 h-4.5" strokeWidth={2.5} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("chatSessionId");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem("chatSessionId", sessionId);
  }
  return sessionId;
}
