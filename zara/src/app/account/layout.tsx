import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Liberty account - view and edit your profile, check your orders, and manage your favorite products.",
  keywords: ["my account", "profile", "orders", "favorites", "account settings", "Liberty account"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "My Account | Liberty",
    description: "Manage your Liberty account - view profile, orders, and favorites.",
    type: "website",
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

