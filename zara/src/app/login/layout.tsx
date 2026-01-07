import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Liberty account to access your orders, favorites, and personalized shopping experience.",
  keywords: ["login", "sign in", "account", "Liberty account", "user login"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign In | Liberty",
    description: "Sign in to your Liberty account.",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

