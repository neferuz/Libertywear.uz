import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  // Try to fetch product data for metadata
  let productName = "Product";
  let productDescription = "View product details at Liberty";
  
  const { id } = await params;
  
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_BASE_URL}/products/${id}?lang=en`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (response.ok) {
      const product = await response.json();
      productName = product.name || "Product";
      productDescription = product.description || `Shop ${productName} at Liberty. Premium quality fashion.`;
    }
  } catch (error) {
    // If fetch fails, use default metadata
    console.error('Error fetching product metadata:', error);
  }

  return {
    title: productName,
    description: productDescription,
    keywords: [productName, "fashion", "clothing", "Liberty", "premium fashion"],
    openGraph: {
      title: `${productName} | Liberty`,
      description: productDescription,
      type: "website", // Next.js поддерживает только: "website", "article", "book", "profile"
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Liberty`,
      description: productDescription,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

