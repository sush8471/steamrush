import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

/**
 * @interface OrderConfirmationCardProps
 * @description Props for the OrderConfirmationCard component.
 */
interface OrderConfirmationCardProps {
  orderId: string;
  paymentMethod: string;
  dateTime: string;
  totalAmount: string;
  onGoToWhatsApp: () => void;
  title?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * A reusable UI component to display an order confirmation for Steam Rush.
 * Customized for WhatsApp checkout flow.
 */
export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToWhatsApp,
  title = "Your order is ready!",
  buttonText = "Continue to WhatsApp",
  icon = <CheckCircle2 className="h-12 w-12 text-green-500" />,
  className,
}) => {
  // Order details
  const details = [
    { label: "Order ID", value: orderId },
    { label: "Payment Method", value: paymentMethod },
    { label: "Date & Time", value: dateTime },
    { label: "Total", value: totalAmount, isBold: true },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
        className={cn(
          "w-full max-w-sm rounded-xl border border-[#2A2E4D] bg-[#1A1F3A] text-white shadow-lg p-6 sm:p-8",
          className
        )}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Success Icon */}
          <motion.div variants={itemVariants}>{icon}</motion.div>

          {/* Title */}
          <motion.h2 variants={itemVariants} className="text-2xl font-semibold">
            {title}
          </motion.h2>

          {/* Order Details Section */}
          <motion.div variants={itemVariants} className="w-full space-y-4 pt-4">
            {details.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between border-b border-[#2A2E4D] pb-4 text-sm text-[#B0B8D0]",
                  {
                    "border-none pb-0": index === details.length - 1,
                    "font-bold text-white": item.isBold,
                  }
                )}
              >
                <span>{item.label}</span>
                <span className={cn({ "text-lg": item.isBold })}>{item.value}</span>
              </div>
            ))}
          </motion.div>

          {/* WhatsApp Button */}
          <motion.div variants={itemVariants} className="w-full pt-4">
            <Button
              onClick={onGoToWhatsApp}
              className="w-full h-12 text-md bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center gap-2"
              size="lg"
            >
              <FaWhatsapp className="h-5 w-5" />
              {buttonText}
            </Button>
          </motion.div>

          {/* Helper Text */}
          <motion.p variants={itemVariants} className="text-xs text-[#B0B8D0]">
            You'll be redirected to WhatsApp to complete your order
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
