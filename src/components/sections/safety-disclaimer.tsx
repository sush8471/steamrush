"use client";

import { Shield } from "lucide-react";

export default function SafetyDisclaimer() {
  return (
    <section className="py-12 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Shield className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Safety & Disclaimer
            </h3>
            <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
              <p>
                We do not sell cracked or pirated games. All purchases are original and genuine.
              </p>
              <p>
                Game delivery is handled manually via WhatsApp for verification and support.
              </p>
              <p className="text-xs pt-2">
                Steam is a registered trademark of Valve Corporation. This website is not affiliated with or endorsed by Valve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
