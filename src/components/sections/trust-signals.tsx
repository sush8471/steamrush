"use client";

import { MessageCircle, IndianRupee, Shield, Clock } from "lucide-react";

export default function TrustSignals() {
  return (
    <section className="w-full bg-[#0A0E27] py-8 lg:py-12 border-y border-[#1A1F3A]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          
          <div className="flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-gradient-to-b from-[#1A1F3A] to-transparent border border-[#2A2E4D] hover:border-[#0074E4]/50 transition-all duration-300">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-3 lg:mb-4">
              <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 text-[#25D366]" strokeWidth={2} />
            </div>
            <h3 className="text-white font-bold text-sm lg:text-base mb-1">WhatsApp Delivery</h3>
            <p className="text-[#B0B8D0] text-xs lg:text-sm">Personal support</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-gradient-to-b from-[#1A1F3A] to-transparent border border-[#2A2E4D] hover:border-[#0074E4]/50 transition-all duration-300">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#0074E4]/10 flex items-center justify-center mb-3 lg:mb-4">
              <IndianRupee className="w-6 h-6 lg:w-7 lg:h-7 text-[#0074E4]" strokeWidth={2} />
            </div>
            <h3 className="text-white font-bold text-sm lg:text-base mb-1">UPI Payments</h3>
            <p className="text-[#B0B8D0] text-xs lg:text-sm">Instant & secure</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-gradient-to-b from-[#1A1F3A] to-transparent border border-[#2A2E4D] hover:border-[#0074E4]/50 transition-all duration-300">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3 lg:mb-4">
              <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-[#10B981]" strokeWidth={2} />
            </div>
            <h3 className="text-white font-bold text-sm lg:text-base mb-1">Safe & Verified</h3>
            <p className="text-[#B0B8D0] text-xs lg:text-sm">Manual delivery</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 lg:p-6 rounded-xl bg-gradient-to-b from-[#1A1F3A] to-transparent border border-[#2A2E4D] hover:border-[#0074E4]/50 transition-all duration-300">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-3 lg:mb-4">
              <Clock className="w-6 h-6 lg:w-7 lg:h-7 text-[#F59E0B]" strokeWidth={2} />
            </div>
            <h3 className="text-white font-bold text-sm lg:text-base mb-1">Quick Setup</h3>
            <p className="text-[#B0B8D0] text-xs lg:text-sm">Within minutes</p>
          </div>

        </div>
      </div>
    </section>
  );
}
