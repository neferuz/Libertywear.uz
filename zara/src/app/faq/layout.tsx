import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs - Frequently Asked Questions",
  description: "Find answers to frequently asked questions about orders, shipping, returns, products, and account management at Liberty. Get help with your shopping experience.",
  keywords: ["faq", "frequently asked questions", "help", "support", "shipping", "returns", "orders", "Liberty faq"],
  openGraph: {
    title: "FAQs | Liberty",
    description: "Find answers to frequently asked questions about orders, shipping, returns, and more.",
    type: "website",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

