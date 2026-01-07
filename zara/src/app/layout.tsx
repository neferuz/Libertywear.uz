import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "Liberty - Premium Fashion & Clothing Store",
    template: "%s | Liberty"
  },
  description: "Discover premium fashion and clothing at Liberty. Shop the latest collections of women's, men's, and children's clothing. Quality fashion for the modern lifestyle.",
  keywords: ["fashion", "clothing", "premium fashion", "women's clothing", "men's clothing", "kids clothing", "online store", "Liberty"],
  authors: [{ name: "Liberty" }],
  creator: "Liberty",
  publisher: "Liberty",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://libertywear.uz",
    siteName: "Liberty",
    title: "Liberty - Premium Fashion & Clothing Store",
    description: "Discover premium fashion and clothing at Liberty. Shop the latest collections.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Liberty Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liberty - Premium Fashion & Clothing Store",
    description: "Discover premium fashion and clothing at Liberty.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
