import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Gamer Bhidu | Premium PC Games at Unbeatable Prices",
  description: "Your ultimate destination for PC gaming deals",
  openGraph: {
    title: "Gamer Bhidu | Premium PC Games at Unbeatable Prices",
    description: "Your ultimate destination for PC gaming deals",
    type: "website",
    url: "https://gamerbhidu.com",
    siteName: "Gamer Bhidu",
    images: [
      {
        url: "/new-logo.png",
        width: 1200,
        height: 630,
        alt: "Gamer Bhidu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamer Bhidu | Premium PC Games at Unbeatable Prices",
    description: "Your ultimate destination for PC gaming deals",
    images: ["/new-logo.png"],
  },
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
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
