import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase at Liberty. Secure checkout process for your fashion items.",
  keywords: ["checkout", "purchase", "buy", "payment", "order", "Liberty checkout"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Checkout | Liberty",
    description: "Complete your purchase at Liberty.",
    type: "website",
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

