import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderConfirmationCardProps {
  orderId: string;
  paymentMethod: string;
  dateTime: string;
  totalAmount: string;
  onGoToAccount: () => void;
  title?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToAccount,
  title = "Your order has been successfully submitted",
  buttonText = "Go to my account",
  icon = <CheckCircle2 className="h-12 w-12 text-green-500" />,
  className,
}) => {
  const details = [
    { label: "Order ID", value: orderId },
    { label: "Payment Method", value: paymentMethod },
    { label: "Date & Time", value: dateTime },
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const,
        stiffness: 100 
      } 
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
        className={cn(
          "w-full max-w-sm rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl p-8",
          className
        )}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        <div className="flex flex-col items-center space-y-7 text-center">
          {/* Success Icon */}
          <motion.div variants={itemVariants} className="flex items-center justify-center">
            {icon}
          </motion.div>

          {/* Title */}
          <motion.h2 
            variants={itemVariants} 
            className="text-2xl font-bold text-white tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </motion.h2>

          {/* Order Details Section */}
          <motion.div variants={itemVariants} className="w-full space-y-5 pt-2">
            {details.map((item, index) => (
              <div
                key={item.label}
                className="flex items-start justify-between text-left"
              >
                <span className="text-sm font-medium text-slate-400 tracking-wide uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  {item.label}
                </span>
                <span className="text-[15px] font-semibold text-slate-100 text-right max-w-[60%]" style={{ lineHeight: '1.4', letterSpacing: '0.01em' }}>
                  {item.value}
                </span>
              </div>
            ))}

            {/* Total - Prominent Display */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <span className="text-base font-bold text-white tracking-wide">
                Total
              </span>
              <span className="text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                {totalAmount}
              </span>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div variants={itemVariants} className="w-full pt-3">
            <Button
              onClick={onGoToAccount}
              className="w-full h-12 text-[15px] font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
              size="lg"
            >
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
