"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Globe, Menu, X, User } from "lucide-react";

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-xl shadow-black/20 font-sans">
      {/* Global Navigation Bar (Top Strip) */}
      <div className="bg-[#18181C] h-[52px] w-full flex items-center justify-between px-4 lg:px-6 relative z-50 text-[11px] lg:text-[12px] tracking-wide uppercase font-medium text-[#ccc]">
        {/* Left Section: Logo & Global Links */}
        <div className="flex items-center h-full gap-4 lg:gap-6">
          {/* Logo - Steam Rush */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              className="fill-current text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,180,255,0.6)] transition-all"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="currentColor"
                opacity="0.15"
              />
              <path
                d="M16 4C9.373 4 4 9.373 4 16c0 6.627 5.373 12 12 12 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12zm0 2c5.523 0 10 4.477 10 10 0 5.523-4.477 10-10 10-5.523 0-10-4.477-10-10 0-5.523 4.477-10 10-10z"
                fill="currentColor"
              />
              <path
                d="M16 10v12M10 16h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="13" r="1.5" fill="currentColor" />
              <circle cx="16" cy="19" r="1.5" fill="currentColor" />
              <circle cx="13" cy="16" r="1.5" fill="currentColor" />
              <circle cx="19" cy="16" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-white font-bold text-lg tracking-tight hidden sm:inline">
              Steam <span className="text-primary">Rush</span>
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden relative z-50 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90 text-white" : "text-[#ccc] hover:text-white"}`}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Global Menu Items */}
          <nav className="hidden lg:flex items-center h-full gap-6">
            <Link
              href="#"
              className="flex items-center h-full text-white relative"
            >
              STORE
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-sm" />
            </Link>
            <Link
              href="#"
              className="h-full flex items-center hover:text-white transition-colors"
            >
              DISTRIBUTION
            </Link>
            <Link
              href="#"
              className="h-full flex items-center hover:text-white transition-colors"
            >
              SUPPORT
            </Link>
            <div className="w-[1px] h-4 bg-white/20 mx-1" />
            <Link
              href="#"
              className="h-full flex items-center hover:text-white transition-colors"
            >
              UNREAL ENGINE
            </Link>
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 lg:gap-5">
          <button
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            aria-label="Language"
          >
            <Globe size={18} strokeWidth={1.5} />
          </button>

          <Link
            href="#"
            className="flex items-center gap-2 hover:text-white transition-colors group"
          >
            <User
              size={18}
              strokeWidth={1.5}
              className="group-hover:text-white"
            />
            <span className="hidden sm:inline">SIGN IN</span>
          </Link>

          <Link
            href="#"
            className="bg-primary hover:bg-[#00D9FF] text-white px-5 py-[5px] rounded-[4px] font-bold text-[10px] lg:text-[11px] transition-all hover:shadow-[0_0_12px_rgba(0,180,255,0.4)]"
          >
            DOWNLOAD
          </Link>

          {/* Mobile Menu Toggle (Visible on Mobile) */}
          <button
            className="lg:hidden text-white ml-2"
            onClick={toggleMobileMenu}
            aria-label="Open Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Store Navigation Bar (Sticky Sub-nav) */}
      <div className="bg-[#0A0E27]/95 backdrop-blur-md border-b border-white/5 h-[64px] lg:h-[72px] w-full flex items-center px-4 lg:px-6 relative z-40 transition-all">
        <div className="flex items-center w-full gap-6 lg:gap-8">
          {/* Search Input */}
          <div className="relative group w-full max-w-[40px] lg:max-w-[240px] focus-within:max-w-full lg:focus-within:max-w-[240px] transition-all duration-300">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/70 group-focus-within:text-white transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store"
              className="bg-[#202024] text-white text-sm pl-10 pr-4 py-2.5 rounded-full w-full outline-none border border-transparent focus:bg-[#2a2a2e] focus:border-white/20 transition-all placeholder:text-transparent lg:placeholder:text-[#9eaebc]"
              aria-label="Search store"
            />
          </div>

          {/* Center Navigation Menu Items */}
          <nav className="flex items-center gap-6 lg:gap-8 flex-1 overflow-x-auto no-scrollbar mask-gradient">
            <Link
              href="/#hot-deals"
              className="text-[14px] lg:text-[15px] text-white font-medium whitespace-nowrap"
            >
              Discover
            </Link>
            <Link
              href="/games"
              className="text-[14px] lg:text-[15px] text-white font-medium whitespace-nowrap"
            >
              Browse
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#121212] z-[45] pt-[52px] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full bg-[#121212] overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-6 text-[18px] font-medium text-[#f5f5f5]">
            <div className="flex flex-col gap-4 pb-6 border-b border-white/10">
              <Link href="/" className="hover:text-primary transition-colors">
                Store
              </Link>
              <Link
                href="/#faq"
                className="hover:text-primary transition-colors"
              >
                Support
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/#hot-deals" className="hover:text-primary transition-colors">Discover</Link>
              <Link href="/games" className="hover:text-primary transition-colors">Browse</Link>
            </div>
            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-4 text-[14px] text-[#9eaebc]">
              <Link
                href="#"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Globe size={20} />
                <span>English (US)</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <User size={20} />
                <span>Sign In</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
