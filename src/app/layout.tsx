import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Gamer Bhidu | Premium PC Games at Unbeatable Prices",
  description: "Your ultimate destination for PC gaming deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <CartProvider>
          <SearchProvider>
            {children}
            <Analytics />
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#111111",
                  border: "1px solid #262626",
                  color: "#fff",
                },
              }}
            />
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
