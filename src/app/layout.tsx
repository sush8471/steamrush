import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";

export const metadata: Metadata = {
  title: "SteamRush | Premium PC Games at Unbeatable Prices",
  description: "Your ultimate destination for PC gaming deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
