"use client";

import { MessageCircle, IndianRupee, Shield, Clock, Gamepad2, QrCode, Download } from "lucide-react";

export default function TrustAndProcess() {
  return (
    <section className="w-full bg-[#0A0E27] py-6 lg:py-8 border-y border-[#1A1F3A]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          
          <div className="flex items-center justify-center gap-3 lg:gap-4 flex-wrap lg:flex-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#25D366]" strokeWidth={2} />
              </div>
              <span className="text-white text-sm font-medium whitespace-nowrap">WhatsApp Delivery</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-8 h-8 rounded-full bg-[#0074E4]/10 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-[#0074E4]" strokeWidth={2} />
              </div>
              <span className="text-white text-sm font-medium whitespace-nowrap">UPI Payments</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#10B981]" strokeWidth={2} />
              </div>
              <span className="text-white text-sm font-medium whitespace-nowrap">Safe & Verified</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#F59E0B]" strokeWidth={2} />
              </div>
              <span className="text-white text-sm font-medium whitespace-nowrap">Quick Setup</span>
            </div>
          </div>

          <div className="w-full lg:w-px h-px lg:h-12 bg-[#2A2E4D]" />

          <div className="flex items-center justify-center gap-3 lg:gap-4 flex-wrap lg:flex-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0074E4] to-[#0056B3] flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <Gamepad2 className="w-4 h-4 text-[#0074E4]" strokeWidth={2} />
              <span className="text-white text-sm font-medium whitespace-nowrap">Select</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <QrCode className="w-4 h-4 text-[#10B981]" strokeWidth={2} />
              <span className="text-white text-sm font-medium whitespace-nowrap">Pay UPI</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1A1F3A]/50 border border-[#2A2E4D]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <Download className="w-4 h-4 text-[#8B5CF6]" strokeWidth={2} />
              <span className="text-white text-sm font-medium whitespace-nowrap">Get Game</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
