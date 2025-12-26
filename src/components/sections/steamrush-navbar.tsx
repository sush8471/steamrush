"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Gamepad2, Home, Store, Flame, HelpCircle, Menu, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { FaWhatsapp } from "react-icons/fa";

interface GameCategory {
  href: string;
  label: string;
  description?: string;
}

const gameCategories: GameCategory[] = [
  { href: "/games?category=action", label: "Action Games", description: "Fast-paced adventures" },
  { href: "/games?category=rpg", label: "RPG Games", description: "Immersive role-playing" },
  { href: "/games?category=strategy", label: "Strategy Games", description: "Tactical gameplay" },
  { href: "/games?category=indie", label: "Indie Games", description: "Unique indie titles" },
  { href: "/games?category=multiplayer", label: "Multiplayer", description: "Play with friends" },
];

export default function SteamRushNavbar() {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGamesOpen, setIsGamesOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0E27]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#0A0E27]/90">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Steam Rush Logo"
            width={140}
            height={40}
            className="hidden sm:block h-8 w-auto"
            priority
          />
          <div className="flex items-center gap-2 sm:hidden">
            <Gamepad2 className="w-6 h-6 text-[#0074E4]" />
            <span className="text-lg font-black text-white">
              STEAM<span className="text-[#0074E4]">RUSH</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#B0B8D0] transition-colors hover:bg-white/5 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          {/* Browse Games Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-sm font-medium text-[#B0B8D0] hover:text-white hover:bg-white/5">
                <Store className="h-4 w-4" />
                Browse Games
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-[#1A1F3A] border-[#2A2E4D]">
              <DropdownMenuLabel className="text-white">Game Categories</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {gameCategories.map((cat) => (
                <DropdownMenuItem key={cat.href} asChild className="focus:bg-white/5 focus:text-white">
                  <Link href={cat.href} className="cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{cat.label}</span>
                      <span className="text-xs text-[#B0B8D0]">{cat.description}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="focus:bg-white/5 focus:text-white">
                <Link href="/games" className="cursor-pointer font-semibold text-[#0074E4]">
                  View All Games →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/#hot-deals"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#B0B8D0] transition-colors hover:bg-white/5 hover:text-white"
          >
            <Flame className="h-4 w-4" />
            Hot Deals
            <Badge variant="destructive" className="ml-0 text-[10px] px-1.5 py-0">Sale</Badge>
          </Link>

          <Link
            href="/#faq"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#B0B8D0] transition-colors hover:bg-white/5 hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp Contact - Desktop */}
          <a
            href="https://wa.me/917752805529?text=Hi! I want to buy a game"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm text-white bg-[#25D366] rounded-full hover:bg-[#20BA5A] transition-colors font-medium whitespace-nowrap"
          >
            <FaWhatsapp className="h-4 w-4" />
            <span className="hidden lg:inline">Contact Us</span>
          </a>

          {/* Cart */}
          <Button asChild variant="ghost" size="icon" className="relative hover:bg-white/5" aria-label="Shopping cart">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-white" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-bold"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/5" aria-label="Menu">
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-[#0A0E27] border-[#2A2E4D]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="Steam Rush Logo"
                    width={120}
                    height={35}
                    className="h-7 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>

                {/* Mobile Browse Games Collapsible */}
                <Collapsible open={isGamesOpen} onOpenChange={setIsGamesOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/5"
                    >
                      <Store className="h-4 w-4" />
                      Browse Games
                      <ChevronDown
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform duration-200",
                          isGamesOpen && "rotate-180"
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-7 mt-1 space-y-1 border-l-2 border-[#0074E4] pl-4">
                    {gameCategories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-[#B0B8D0] transition-colors hover:bg-white/5 hover:text-white"
                      >
                        {cat.label}
                      </Link>
                    ))}
                    <Link
                      href="/games"
                      onClick={() => setIsOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-semibold text-[#0074E4] transition-colors hover:bg-white/5"
                    >
                      View All →
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link
                  href="/#hot-deals"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
                >
                  <Flame className="h-4 w-4" />
                  Hot Deals
                  <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">Sale</Badge>
                </Link>

                <Link
                  href="/#faq"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
                >
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </Link>

                {/* Mobile WhatsApp Button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <a
                    href="https://wa.me/917752805529?text=Hi! I want to buy a game"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm text-white bg-[#25D366] rounded-full hover:bg-[#20BA5A] transition-colors font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    Contact on WhatsApp
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
