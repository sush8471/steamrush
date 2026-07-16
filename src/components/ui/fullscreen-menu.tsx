"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "HOME", href: "/" },
  { label: "BROWSE GAMES", href: "/games" },
  { label: "HOT DEALS", href: "/#hot-deals" },
  { label: "HOW IT WORKS", href: "/#how-it-works" },
  { label: "FAQ", href: "/faq" },
];

const overlayVariants = {
  hidden: { y: "-100%" },
  visible: { y: 0 },
  exit: { y: "-100%" },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0 },
};

export function FullscreenMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }
    getSession();
  }, []);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={openMenu}
        className="hover:bg-white/5"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="fullscreen-menu"
      >
        <Menu className="h-5 w-5 text-white" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="fullscreen-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] h-screen w-screen bg-[#000000] text-white"
          >
            {/* Header */}
            <div className="relative flex h-20 items-center px-4">
              {/* Close button — top-left */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                className="hover:bg-white/5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-white" />
              </Button>

              {/* Logo — centered at top */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block hover:opacity-90 transition-opacity"
                >
                  <Image
                    src="/new-logo.png"
                    alt="Gamer Bhidu"
                    width={240}
                    height={70}
                    className="h-12 w-auto"
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Menu content */}
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex h-[calc(100vh-5rem)] flex-col px-6 pb-8"
            >
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="flex flex-col">
                  {menuItems.map((item, index) => {
                    const isLast = index === menuItems.length - 1;
                    return (
                      <motion.li
                        key={item.label}
                        variants={itemVariants}
                        className={`border-b border-white/10 ${isLast ? "border-b-0" : ""}`}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="block py-5 text-lg font-medium uppercase tracking-widest text-white transition-colors hover:text-white/70"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Auth - Mobile Sign In / Sign Out */}
              {!authLoading && (
                <motion.div variants={itemVariants} className="border-t border-white/10 pt-6">
                  {user ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white border border-white/10">
                        <User className="h-4 w-4 text-primary" />
                        <span className="max-w-[200px] truncate">{user.email}</span>
                      </div>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          window.location.reload();
                        }}
                        className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        supabase.auth.signInWithOAuth({
                          provider: 'google',
                          options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
                        });
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-bold py-3.5 rounded-lg transition-all active:scale-[0.99]"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  )}
                </motion.div>
              )}

              {/* WhatsApp Contact button */}
              <motion.div variants={itemVariants} className="flex justify-center pt-6">
                <a
                  href="https://wa.me/917752805529?text=Hi! I want to buy a game"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] transition-colors"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  Contact Us
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
