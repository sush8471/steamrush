"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import type { CartItem } from "@/context/CartContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  /** Pre-filled from Google profile — optional */
  userName?: string;
  userEmail?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CheckoutModal({
  open,
  onClose,
  orderId,
  items,
  totalPrice,
  userName,
  userEmail,
}: CheckoutModalProps) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const itemCount = items.length;

  const buildOrderMessage = (plain = false) => {
    const lineBreak = plain ? "\n" : "\n";
    const bold = (t: string) => (plain ? t : `*${t}*`);

    return [
      `🎮 ${bold(`Gamer Bhidu Order ${orderId}`)}`,
      "",
      userName ? `👤 ${bold("Customer:")} ${userName}` : null,
      userEmail ? `📧 ${bold("Email:")} ${userEmail}` : null,
      "",
      `📦 ${bold(`Games (${itemCount}):`)}`,
      ...items.map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`),
      "",
      `💰 ${bold(`Total: ₹${totalPrice}`)}`,
      "",
      "I'd like to proceed with this order!",
    ]
      .filter((l) => l !== null)
      .join(lineBreak);
  };

  const handleWhatsApp = () => {
    const message = buildOrderMessage(false);
    window.open(
      `https://wa.me/917752805529?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    onClose();
  };

  const handleInstagram = () => {
    const message = buildOrderMessage(true);
    navigator.clipboard.writeText(message).catch(() => {});
    window.open("https://www.instagram.com/gamer_bhidu/", "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-6 pt-5 pb-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Order Ready!</h2>
                  <p className="text-xs text-muted-foreground">
                    Order ID: <span className="text-white font-mono">{orderId}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="max-h-[80vh] overflow-y-auto">
              <div className="p-6 space-y-5">

                {/* Customer info (if signed in) */}
                {(userName || userEmail) && (
                  <div className="bg-background/50 rounded-lg p-3 space-y-1 text-sm">
                    {userName && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="text-white font-medium">{userName}</span>
                      </div>
                    )}
                    {userEmail && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="text-white font-medium">{userEmail}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Order items */}
                <div className="bg-background/50 rounded-lg p-3 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                      <span className="text-white font-semibold shrink-0">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-xl font-bold text-white">₹{totalPrice}</span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Scan QR Code to pay via UPI</p>
                  <div className="bg-white p-4 rounded-xl inline-block">
                    <Image
                      src="/payment-qr.png"
                      alt="Payment QR Code"
                      width={180}
                      height={180}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                  <div className="px-4 py-2.5 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">UPI ID</p>
                    <p className="text-sm text-white font-mono font-semibold">
                      sushantcha00123@okicici
                    </p>
                  </div>
                </div>

                {/* Payment confirmation checkbox */}
                <div className="bg-background/30 border border-white/10 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={paymentConfirmed}
                      onChange={(e) => setPaymentConfirmed(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-2 border-white/10 bg-transparent checked:bg-white/30 cursor-pointer transition-all"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">
                        I have completed the payment
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tick this after making the UPI payment to proceed
                      </p>
                    </div>
                  </label>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-xs text-muted-foreground bg-card">THEN</span>
                  </div>
                </div>

                {/* Contact buttons */}
                <button
                  onClick={handleWhatsApp}
                  disabled={!paymentConfirmed}
                  className={`w-full py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    paymentConfirmed
                      ? "bg-[#25D366] text-white hover:bg-[#20BA5A] cursor-pointer"
                      : "bg-white/10 text-muted-foreground cursor-not-allowed opacity-50"
                  }`}
                >
                  <FaWhatsapp className="h-5 w-5" />
                  {paymentConfirmed ? "Continue on WhatsApp" : "Confirm Payment First"}
                </button>

                <button
                  onClick={handleInstagram}
                  disabled={!paymentConfirmed}
                  className={`w-full py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    paymentConfirmed
                      ? "bg-gradient-to-r from-[#833AB4] via-[#C13584] to-[#E1306C] text-white hover:opacity-90 cursor-pointer"
                      : "bg-white/10 text-muted-foreground cursor-not-allowed opacity-50"
                  }`}
                >
                  <FaInstagram className="h-5 w-5" />
                  {paymentConfirmed ? "Contact via Instagram" : "Confirm Payment First"}
                </button>

                <p className="text-xs text-muted-foreground text-center pb-1">
                  {paymentConfirmed
                    ? "Your order details will be sent automatically"
                    : "Complete payment and check the box above to continue"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
