"use client"

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import SteamRushNavbar from '@/components/sections/steamrush-navbar'
import Footer from '@/components/sections/footer'
import { OrderConfirmationCard } from '@/components/ui/order-confirmation-card'

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, clearCart, itemCount } = useCart()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handleCheckoutClick = () => {
    // Generate order ID
    const newOrderId = `SR${Date.now().toString().slice(-8)}`
    setOrderId(newOrderId)
    setShowConfirmation(true)
  }

  const handleWhatsAppRedirect = () => {
    const message = `🎮 *Steam Rush Order ${orderId}*\n\n📦 *Games (${itemCount}):*\n${
      cart.map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`).join('\n')
    }\n\n💰 *Total: ₹${totalPrice}*\n\nI'd like to proceed with this order!`
    
    const whatsappUrl = `https://wa.me/917752805529?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Close confirmation modal
    setShowConfirmation(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <SteamRushNavbar />
      
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">Shopping Cart</h1>
              <p className="text-[#B0B8D0]">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            <Link href="/games" className="flex items-center gap-2 text-[#0074E4] hover:text-[#0062C4] transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Continue Shopping</span>
            </Link>
          </div>

          {cart.length === 0 ? (
            // Empty Cart State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ShoppingBag className="h-24 w-24 text-[#2A2E4D] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-[#B0B8D0] mb-8">Add some games to get started!</p>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0074E4] text-white rounded-full hover:bg-[#0062C4] transition-colors font-medium"
              >
                Browse Games
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#1A1F3A] border border-[#2A2E4D] p-4 rounded-lg flex items-center gap-4 hover:border-[#0074E4]/30 transition-all"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[#0074E4] font-bold text-xl">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-[#B0B8D0] line-through text-sm">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}

                {/* Clear Cart Button */}
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-[#B0B8D0] hover:text-red-500 transition-colors py-2 text-sm"
                  >
                    Clear All Items
                  </button>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1A1F3A] border border-[#2A2E4D] p-6 rounded-lg sticky top-24"
                >
                  <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[#B0B8D0]">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-[#B0B8D0]">
                      <span>Delivery</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                    <div className="border-t border-[#2A2E4D] pt-3 flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-[#25D366] text-white py-4 rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2 mb-3"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    Checkout
                  </button>

                  <p className="text-xs text-[#B0B8D0] text-center">
                    You'll be redirected to WhatsApp to complete your order
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-[#2A2E4D] space-y-2 text-sm text-[#B0B8D0]">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Instant Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>100% Original Games</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OrderConfirmationCard
                orderId={orderId}
                paymentMethod="WhatsApp Payment"
                dateTime={new Date().toLocaleString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
                totalAmount={`₹${totalPrice}`}
                onGoToAccount={handleWhatsAppRedirect}
                title="Your order is ready!"
                buttonText="Continue to WhatsApp"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
