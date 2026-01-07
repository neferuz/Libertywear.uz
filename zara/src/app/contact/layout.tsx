import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Liberty. Contact our customer service team for questions, support, or inquiries. We're here to help you with your fashion needs.",
  keywords: ["contact liberty", "customer service", "support", "help", "contact information", "Liberty support"],
  openGraph: {
    title: "Contact Us | Liberty",
    description: "Get in touch with Liberty. Contact our customer service team for questions and support.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

