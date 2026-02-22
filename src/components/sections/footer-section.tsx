"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

function FooterSection() {
  return (
    <footer className="relative border-t border-[#2A2E4D] bg-[#0A0E27] text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-10 md:py-16 md:px-6 lg:px-8">
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Logo and Description */}
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Steam Rush Logo"
              width={200}
              height={55}
              className="mb-4 h-10 md:h-12 w-auto"
            />
            <p className="mb-6 text-[#B0B8D0] text-sm md:text-base">
              Your trusted destination for affordable Steam games. Instant delivery, unbeatable prices, and 24/7 support.
            </p>
            <p className="text-xs md:text-sm text-[#B0B8D0]">
              © 2026 Steam Rush. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block text-[#B0B8D0] transition-colors hover:text-[#0074E4]">
                Home
              </Link>
              <Link href="/games" className="block text-[#B0B8D0] transition-colors hover:text-[#0074E4]">
                Browse Games
              </Link>
              <Link href="/#hot-deals" className="block text-[#B0B8D0] transition-colors hover:text-[#0074E4]">
                Hot Deals
              </Link>
              <Link href="/#combo-deals" className="block text-[#B0B8D0] transition-colors hover:text-[#0074E4]">
                Combo Deals
              </Link>
              <Link href="/#faq" className="block text-[#B0B8D0] transition-colors hover:text-[#0074E4]">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <p className="mb-4 text-sm text-[#B0B8D0]">
              Stay updated with the latest deals and game releases!
            </p>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-[#2A2E4D] bg-[#1A1F3A] hover:bg-[#0074E4] hover:border-[#0074E4] transition-all"
                      asChild
                    >
                      <a 
                        href="https://www.instagram.com/steam_rush/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-[#2A2E4D] bg-[#1A1F3A] hover:bg-[#25D366] hover:border-[#25D366] transition-all"
                      asChild
                    >
                      <a 
                        href="https://wa.me/917752805529?text=Hi! I want to buy a game" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp className="h-4 w-4" />
                        <span className="sr-only">WhatsApp</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat with us on WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-[#2A2E4D] bg-[#1A1F3A] hover:bg-[#1877F2] hover:border-[#1877F2] transition-all"
                      asChild
                    >
                      <a 
                        href="https://www.facebook.com/profile.php?id=61581460503750" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Facebook</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-[#2A2E4D] pt-6 text-center">
          <p className="text-sm text-[#B0B8D0]">
            Made with ❤️ for Indian Gamers
          </p>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
