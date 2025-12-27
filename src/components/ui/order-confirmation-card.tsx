import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

interface OrderConfirmationCardProps {
  orderId: string
  paymentMethod: string
  dateTime: string
  totalAmount: string
  onGoToWhatsApp: () => void
  title: string
  buttonText: string
}

export function OrderConfirmationCard({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToWhatsApp,
  title,
  buttonText,
}: OrderConfirmationCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
    >
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-green-500/10 p-4 rounded-full">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
      <p className="text-slate-400 text-center mb-8">Complete your payment via WhatsApp</p>

      {/* Order Details */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
          <span className="text-slate-400 text-sm">Order ID</span>
          <span className="text-white font-semibold">{orderId}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
          <span className="text-slate-400 text-sm">Date & Time</span>
          <span className="text-white font-semibold text-sm">{dateTime}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
          <span className="text-slate-400 text-sm">Payment Method</span>
          <span className="text-white font-semibold">{paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-lg">
          <span className="text-white font-semibold">Total Amount</span>
          <span className="text-2xl font-bold text-white">{totalAmount}</span>
        </div>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={onGoToWhatsApp}
        className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 active:scale-95"
      >
        <FaWhatsapp className="w-5 h-5" />
        {buttonText}
      </button>

      <p className="text-xs text-slate-500 text-center mt-4">
        You'll be redirected to WhatsApp to complete your order
      </p>
    </motion.div>
  )
}
