"use client";

import { Shield, Video, Package, MessageSquare } from "lucide-react";

export default function ClaritySection() {
  const features = [
    {
      icon: Package,
      title: "Original Steam Game Files",
      description: "You receive authentic, portable Steam game files - not pirated or cracked content. These files are used to add the game directly to your own Steam library.",
      color: "text-[#0074E4]",
      bg: "bg-[#0074E4]/10",
    },
    {
      icon: Video,
      title: "Step-by-Step Video Tutorial",
      description: "After payment, you'll get a clear video guide showing exactly how to complete the library addition process. Follow along at your own pace.",
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]/10",
    },
    {
      icon: Shield,
      title: "100% Safe & Genuine",
      description: "No malware, no viruses, no sketchy files. Games appear in your Steam library just like any legitimate purchase.",
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
    },
    {
      icon: MessageSquare,
      title: "Full WhatsApp Support",
      description: "If you face any issue during setup, our team is available via WhatsApp to help you complete the process smoothly.",
      color: "text-[#25D366]",
      bg: "bg-[#25D366]/10",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#0A0E27] via-[#0F1535] to-[#0A0E27] py-12 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 lg:mb-6">
            What You're Actually Buying
          </h2>
          <p className="text-[#B0B8D0] text-base lg:text-xl max-w-3xl mx-auto">
            Complete transparency - understand exactly what you receive and how it works
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="relative group"
              >
                <div className="relative bg-gradient-to-b from-[#1A1F3A] to-[#0F1535] rounded-2xl p-6 lg:p-8 border border-[#2A2E4D] hover:border-[#2A2E4D]/80 transition-all duration-300">
                  
                  <div className="flex gap-4 items-start">
                    <div className={`flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-xl ${feature.bg} flex items-center justify-center backdrop-blur-sm border border-white/5`}>
                      <Icon className={`w-7 h-7 lg:w-8 lg:h-8 ${feature.color}`} strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 lg:mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-[#B0B8D0] text-sm lg:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 lg:mt-12 bg-gradient-to-r from-[#1A1F3A]/50 to-[#0F1535]/50 rounded-2xl p-6 lg:p-8 border border-[#2A2E4D] max-w-4xl mx-auto">
          <p className="text-[#E5E7EB] text-sm lg:text-base leading-relaxed text-center">
            <span className="font-semibold text-white">Simple process:</span> You pay, receive files + tutorial, follow instructions to add games to your Steam library. Everything is authentic, safe, and backed by our support team.
          </p>
        </div>

      </div>
    </section>
  );
}
