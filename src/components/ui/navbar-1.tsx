"use client" 

import * as React from "react"
 import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Gamepad2, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { FaWhatsapp } from "react-icons/fa"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="sticky top-0 z-50 flex justify-center w-full py-6 px-4 bg-[#0A0E27]/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3 bg-[#1A1F3A] border border-[#2A2E4D] rounded-full shadow-lg w-full max-w-5xl relative z-10">
        <div className="flex items-center">
          <motion.div
            className="flex items-center gap-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="flex items-center gap-2">
              {/* Logo for larger screens */}
              <Image
                src="/logo.png"
                alt="Steam Rush Logo"
                width={180}
                height={50}
                className="hidden sm:block h-10 w-auto"
                priority
              />
              {/* Text branding for small screens */}
              <div className="flex items-center gap-2 sm:hidden">
                <Gamepad2 className="w-6 h-6 text-[#0074E4]" />
                <span className="text-lg font-black text-white">
                  STEAM<span className="text-[#0074E4]">RUSH</span>
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
        
        {/* Navigation - visible on tablets and up */}
        <nav className="hidden sm:flex items-center space-x-6 lg:space-x-10">
          {[
            { name: "Home", href: "/" },
            { name: "Browse Games", href: "/games" },
            { name: "Hot Deals", href: "/#hot-deals" },
            { name: "FAQ", href: "/#faq" }
          ].map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link 
                href={item.href} 
                className="text-xs lg:text-sm text-[#B0B8D0] hover:text-white transition-colors font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right side buttons - Contact Us + Cart + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Contact Us Button - visible on tablets and up */}
          <motion.div
            className="hidden sm:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <a
              href="https://wa.me/917752805529?text=Hi! I want to buy a game"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm text-white bg-[#25D366] rounded-full hover:bg-[#20BA5A] transition-colors font-medium whitespace-nowrap"
            >
              <FaWhatsapp className="h-4 w-4" />
              Contact Us
            </a>
          </motion.div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.div>
          </Link>

          {/* Mobile Menu Button - only on phones */}
          <motion.button 
            className="sm:hidden flex items-center" 
            onClick={toggleMenu} 
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-[#0A0E27] to-[#121212] z-50 pt-20 px-6 sm:hidden overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>
            <div className="flex flex-col space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto pb-8">
              {[
                { name: "Home", href: "/" },
                { name: "Browse Games", href: "/games" },
                { name: "Hot Deals", href: "/#hot-deals" },
                { name: "FAQ", href: "/#faq" }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link 
                    href={item.href} 
                    className="text-lg text-white font-semibold hover:text-[#0074E4] transition-colors" 
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6 border-t border-white/10"
              >
                <a
                  href="https://wa.me/917752805529?text=Hi! I want to buy a game"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-base text-white bg-[#25D366] rounded-full hover:bg-[#20BA5A] transition-colors font-semibold"
                  onClick={toggleMenu}
                >
                  <FaWhatsapp className="h-5 w-5" />
                  Contact on WhatsApp
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }
