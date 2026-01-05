'use client';

import { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanHeroCarousel } from '@/components/UrbanHeroCarousel';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ShopByCategory } from '@/components/ShopByCategory';
import { PromoBanner } from '@/components/PromoBanner';
import { UrbanNewsletter } from '@/components/UrbanNewsletter';
import { OurPartners } from '@/components/OurPartners';
import { UrbanFooter } from '@/components/UrbanFooter';
import { ChatWidget } from '@/components/ChatWidget';
import { Loader } from '@/components/Loader';
import { fetchProducts, Product as APIProduct } from '@/lib/api';

export default function Home() {
  // Hero carousel slides
  const heroSlides = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1759090889285-1ba40f2d49fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwYmx1ZSUyMHNreSUyMG91dGRvb3IlMjBwcmVtaXVtJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzY3MTMxOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'EXCLUSIVE COLLECTION',
      headline: 'PREMIUM CLOTHS & ACCESSORIES COLLECTION',
      description: 'Level up your fashion experience with up to 50% off top quality products & brand only for a limited time',
      ctaText: 'Explore Deals',
      ctaLink: '#deals',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1764998113473-bae96c1c3072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwb3V0ZG9vciUyMG1vZGVsc3xlbnwxfHx8fDE3NjcxMzE5NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'NEW SEASON',
      headline: 'URBAN LUXURY COLLECTION',
      description: 'Discover the latest trends in premium fashion with our carefully curated selection of contemporary styles',
      ctaText: 'Shop Now',
      ctaLink: '#new',
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1614714053570-6c6b6aa54a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2xvdGhpbmclMjBjYW1wYWlnbiUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzY3MTMxOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'TRENDING NOW',
      headline: 'MODERN ESSENTIALS FOR EVERY OCCASION',
      description: 'Elevate your wardrobe with timeless pieces designed for the contemporary lifestyle',
      ctaText: 'View Collection',
      ctaLink: '#collection',
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1762342015434-f29fcf198000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY29sbGVjdGlvbiUyMG91dGRvb3IlMjBwaG90b3Nob290fGVufDF8fHx8MTc2NzEzMTk0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      tag: 'LIMITED EDITION',
      headline: 'SOPHISTICATED STYLE MEETS COMFORT',
      description: 'Experience unparalleled quality with our exclusive range of premium fashion pieces',
      ctaText: 'Discover More',
      ctaLink: '#limited',
    },
  ];

  // State for featured products loaded from API
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Load featured products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const productsData = await fetchProducts({
          limit: 8,
          lang: 'en',
        });
        
        // Transform API products to component format
        const transformedProducts = productsData.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.variants && product.variants.length > 0 
            ? product.variants[0].price 
            : product.price,
          category: 'UNISEX', // You might want to get this from category_id
          imageUrl: product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0
            ? product.variants[0].images[0].image_url
            : product.imageUrl || 'https://via.placeholder.com/400x600',
        }));
        
        setFeaturedProducts(transformedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to default products
        setFeaturedProducts([
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      price: 45,
      category: 'MEN',
      imageUrl: 'https://images.unsplash.com/photo-1758613653752-726b9e13311c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwcm9kdWN0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NzEzMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Elegant Blazer',
      price: 185,
      category: 'WOMEN',
      imageUrl: 'https://images.unsplash.com/photo-1682397125372-4b02f5436d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeSUyMG1vZGVsfGVufDF8fHx8MTc2NzEzMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      name: 'Classic Denim Jacket',
      price: 125,
      category: 'UNISEX',
      imageUrl: 'https://images.unsplash.com/photo-1718670013939-954787e56385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWNvbW1lcmNlJTIwcHJvZHVjdCUyMHBob3RvZnxlbnwxfHx8fDE3NjcxMzE5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      name: 'Luxury Knitwear',
      price: 165,
      category: 'WOMEN',
      imageUrl: 'https://images.unsplash.com/photo-1693930441794-4c6a9f4c0bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwbW9kZWx8ZW58MXx8fHwxNzY3MTMxOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      name: 'Designer Sneakers',
      price: 220,
      category: 'UNISEX',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc25lYWtlcnMlMjBwcm9kdWN0fGVufDF8fHx8MTc2NzEzMTk3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      name: 'Leather Handbag',
      price: 295,
      category: 'WOMEN',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjcxMzE5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      name: 'Wool Overcoat',
      price: 385,
      category: 'MEN',
      imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwY29hdCUyMHByb2R1Y3R8ZW58MXx8fHwxNzY3MTMxOTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 8,
      name: 'Silk Scarf',
      price: 75,
      category: 'ACCESSORIES',
      imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2NhcmYlMjBhY2Nlc3Nvcnl8ZW58MXx8fHwxNzY3MTMxOTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
        ]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Categories
  const categories = [
    {
      id: 1,
      name: 'WOMEN',
      imageUrl: 'https://images.unsplash.com/photo-1651335794520-fb1066d93a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbnMlMjBmYXNoaW9uJTIwY2F0ZWdvcnl8ZW58MXx8fHwxNzY3MTMxOTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 2,
      name: 'MEN',
      imageUrl: 'https://images.unsplash.com/photo-1633655442168-c6ef0ed2f984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMGNhdGVnb3J5fGVufDF8fHx8MTc2NzEzMTk5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 3,
      name: 'KIDS',
      imageUrl: 'https://images.unsplash.com/photo-1604482858862-1db908a653e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZmFzaGlvbiUyMGNhdGVnb3J5fGVufDF8fHx8MTc2NzEzMTk5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 4,
      name: 'ACCESSORIES',
      imageUrl: 'https://images.unsplash.com/photo-1673377441728-23e984e70521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhY2Nlc3NvcmllcyUyMGJhZ3MlMjBzaG9lc3xlbnwxfHx8fDE3NjcxMzI0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 5,
      name: 'SHOES',
      imageUrl: 'https://images.unsplash.com/photo-1629212537116-151e8fb7469f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvZXMlMjBmb290d2VhciUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzY3MTMyOTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 6,
      name: 'NEW IN',
      imageUrl: 'https://images.unsplash.com/photo-1651336492616-4eebfdd995d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBhcnJpdmFscyUyMGZhc2hpb24lMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2NzEzMjQzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 7,
      name: 'UNISEX',
      imageUrl: 'https://images.unsplash.com/photo-1628054279790-a7c28596fa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmlzZXglMjBjbG90aGluZyUyMGZhc2hpb258ZW58MXx8fHwxNzY3MTMyNDMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
    {
      id: 8,
      name: 'SALE',
      imageUrl: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlJTIwZGlzY291bnQlMjBmYXNoaW9ufGVufDF8fHx8MTc2NzEzMjQzMXww&ixlib=rb-4.1.0&q=80&w=1080',
      subtext: 'Shop Now',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <Loader />
      <AnnouncementBar />
      <UrbanNavigation />
      <UrbanHeroCarousel slides={heroSlides} />
      <FeaturedProducts products={featuredProducts} />
      <ShopByCategory categories={categories} />
      <PromoBanner />
      <UrbanNewsletter />
      <OurPartners />
      <UrbanFooter />
      <ChatWidget />
    </div>
  );
}

