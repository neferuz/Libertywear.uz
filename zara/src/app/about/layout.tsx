import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Liberty - our story, values, and commitment to providing premium fashion and exceptional customer service. Discover what makes us unique.",
  keywords: ["about liberty", "our story", "fashion brand", "company values", "Liberty fashion"],
  openGraph: {
    title: "About Us | Liberty",
    description: "Learn about Liberty - our story, values, and commitment to providing premium fashion.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

