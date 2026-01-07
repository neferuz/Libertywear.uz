import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // Map slugs to category names
  const categoryMap: Record<string, { name: string; description: string }> = {
    'zhenschiny': {
      name: "Women's Clothing",
      description: "Shop the latest women's fashion collection at Liberty. Discover premium clothing, shoes, and accessories.",
    },
    'muzhchiny': {
      name: "Men's Clothing",
      description: "Explore men's fashion at Liberty. Premium quality clothing, shoes, and accessories for the modern man.",
    },
    'deti': {
      name: "Kids' Clothing",
      description: "Find stylish and comfortable kids' clothing at Liberty. Quality fashion for children of all ages.",
    },
    'women': {
      name: "Women's Clothing",
      description: "Shop the latest women's fashion collection at Liberty.",
    },
    'men': {
      name: "Men's Clothing",
      description: "Explore men's fashion at Liberty.",
    },
    'kids': {
      name: "Kids' Clothing",
      description: "Find stylish kids' clothing at Liberty.",
    },
  };

  const category = categoryMap[slug.toLowerCase()] || {
    name: "Category",
    description: "Browse our collection at Liberty.",
  };

  return {
    title: category.name,
    description: category.description,
    keywords: [category.name, "fashion", "clothing", "Liberty", "online store"],
    openGraph: {
      title: `${category.name} | Liberty`,
      description: category.description,
      type: "website",
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

