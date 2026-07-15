"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { label: "GAMES", href: "/games" },
  {
    label: "ABOUT",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "The Team", href: "/team" },
      { label: "Press Kit", href: "/press" },
    ],
  },
  {
    label: "CAREERS",
    children: [
      { label: "Open Positions", href: "/careers" },
      { label: "Culture", href: "/culture" },
      { label: "Benefits", href: "/benefits" },
    ],
  },
  {
    label: "SUPPORT",
    children: [
      { label: "Help Center", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const overlayVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function FullscreenMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const openMenu = React.useCallback(() => setIsOpen(true), []);
  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setExpandedItems([]);
  }, []);

  const toggleItem = React.useCallback((label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  }, []);

  // Lock body scroll while menu is open
  React.useEffect(() => {
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
  React.useEffect(() => {
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
            <div className="relative flex h-20 items-center px-4 sm:px-6 lg:px-8">
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
                <Link href="/" onClick={closeMenu} className="block hover:opacity-90 transition-opacity">
                  <Image
                    src="/new-logo.png"
                    alt="Gamer Bhidu"
                    width={240}
                    height={70}
                    className="h-12 sm:h-14 w-auto"
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
              className="flex h-[calc(100vh-5rem)] flex-col px-6 pb-8 sm:px-10 lg:px-16"
            >
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="flex flex-col">
                  {menuItems.map((item, index) => {
                    const isExpanded = expandedItems.includes(item.label);
                    const isLast = index === menuItems.length - 1;

                    return (
                      <motion.li
                        key={item.label}
                        variants={itemVariants}
                        className={cn(
                          "border-b border-white/10",
                          isLast && "border-b-0"
                        )}
                      >
                        {item.href && !item.children ? (
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className="block py-5 text-lg font-medium uppercase tracking-widest text-white transition-colors hover:text-white/70"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <div>
                            <button
                              onClick={() => toggleItem(item.label)}
                              className="flex w-full items-center justify-between py-5 text-left text-lg font-medium uppercase tracking-widest text-white transition-colors hover:text-white/70"
                              aria-expanded={isExpanded}
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 transition-transform duration-300",
                                  isExpanded && "rotate-180"
                                )}
                                aria-hidden="true"
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && item.children && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  {item.children.map((child) => (
                                    <li key={child.label}>
                                      <Link
                                        href={child.href}
                                        onClick={closeMenu}
                                        className="block py-3 pl-2 text-base font-medium uppercase tracking-wide text-white/70 transition-colors hover:text-white"
                                      >
                                        {child.label}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Auth buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-4 pt-6"
              >
                <Button
                  asChild
                  className="w-full max-w-xs rounded-full bg-blue-600 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-white hover:bg-blue-700"
                >
                  <Link href="/signup" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </Button>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white"
                >
                  Login
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
