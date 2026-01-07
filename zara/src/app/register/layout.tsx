import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new Liberty account to enjoy exclusive offers, track orders, save favorites, and get the best shopping experience.",
  keywords: ["register", "create account", "sign up", "new account", "Liberty registration"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Create Account | Liberty",
    description: "Create a new Liberty account to enjoy exclusive offers and track orders.",
    type: "website",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

