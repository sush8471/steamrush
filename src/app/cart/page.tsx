"use client"

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import GamerBhiduNavbar from '@/components/sections/gamerbhidu-navbar'
import Footer from '@/components/sections/footer'

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, clearCart, itemCount } = useCart()

  return (
    <div className="min-h-screen bg-background">
      <GamerBhiduNavbar />
      
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            <Link href="/games" className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
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
              <ShoppingBag className="h-24 w-24 text-white/10 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Add some games to get started!</p>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white rounded-full hover:bg-white/25 transition-colors font-medium"
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
                    className="bg-card border border-white/10 p-4 rounded-lg flex items-center gap-4 hover:border-white/20 transition-all"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0">
                      {item.id === 'gta-v' || item.name.toLowerCase().includes('grand theft auto v') ? (
                        <Link href="/games/gta-v">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {item.id === 'gta-v' || item.name.toLowerCase().includes('grand theft auto v') ? (
                          <Link href="/games/gta-v" className="hover:text-white transition-colors">
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xl">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">₹{item.originalPrice}</span>
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
                    className="w-full text-muted-foreground hover:text-red-500 transition-colors py-2 text-sm"
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
                  className="bg-card border border-white/10 p-6 rounded-lg sticky top-24"
                >
                  <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full bg-[#25D366] text-white py-4 rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2 mb-3"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    Proceed to Checkout
                  </Link>

                  <p className="text-xs text-muted-foreground text-center">
                    Review your order and pay via UPI on the next step
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm text-muted-foreground">
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



      <Footer />
    </div>
  )
}
