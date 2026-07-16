"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingCart, LogOut, User, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

import { NavbarSearch } from "@/components/ui/navbar-search";
import { FullscreenMenu } from "@/components/ui/fullscreen-menu";
import { supabase } from "@/lib/supabase";

export default function GamerBhiduNavbar() {
  const { itemCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Left Side: Mobile menu trigger + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile-only hamburger */}
          <div className="lg:hidden">
            <FullscreenMenu />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity flex-shrink-0">
            <Image
              src="/new-logo.png"
              alt="Gamer Bhidu - Affordable Gaming"
              width={240}
              height={70}
              className="h-12 sm:h-14 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Search Bar - Desktop Center */}
        <div className="hidden lg:block lg:w-96 max-w-2xl">
          <NavbarSearch />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/games"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              Browse Games
            </Link>

            <Link
              href="/faq"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              FAQ
            </Link>
          </nav>

          {/* Auth - Sign In / User Dropdown */}
          {!authLoading && (
            <div className="flex items-center gap-2">
              {user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white border border-white/10 hover:border-white/20 transition-all"
                  >
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#111111] border border-[#262626] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { handleSignOut(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignIn}
                  className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white gap-1.5 text-xs font-semibold px-4"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>
          )}

          {/* Search Icon - Mobile Only */}
          <div className="lg:hidden">
            <NavbarSearch />
          </div>

          {/* Cart */}
          <Button asChild variant="ghost" size="icon" className="relative hover:bg-white/5" aria-label="Shopping cart">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-white" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs font-bold"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
