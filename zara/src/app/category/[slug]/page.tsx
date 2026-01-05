'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import Link from 'next/link';
import { fetchCategoryBySlug, fetchProducts, Category as APICategory, Product as APIProduct } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  size?: string[];
  color?: string[];
  brand?: string;
}

interface SubSubCategory {
  id: number;
  name: string;
  href: string;
}

interface SubCategory {
  id: number;
  name: string;
  href: string;
  subSubCategories?: SubSubCategory[];
}

interface Category {
  id: number;
  name: string;
  href: string;
  subCategories: SubCategory[];
}

// Helper function to transform API category to component format
const transformCategory = (apiCat: APICategory): Category => {
  const slug = apiCat.slug || apiCat.title.toLowerCase().replace(/\s+/g, '-');
  return {
    id: apiCat.id,
    name: apiCat.title.toUpperCase(),
    href: `/category/${slug}`,
    subCategories: apiCat.subcategories?.map((sub) => ({
      id: sub.id,
      name: sub.title,
      href: `/category/${sub.slug || sub.title.toLowerCase().replace(/\s+/g, '-')}`,
      subSubCategories: sub.subcategories?.map((subsub) => ({
        id: subsub.id,
        name: subsub.title,
        href: `/category/${subsub.slug || subsub.title.toLowerCase().replace(/\s+/g, '-')}`,
      })),
    })) || [],
  };
};

// Helper function to get product image URL
const getProductImageUrl = (product: APIProduct): string => {
  if (product.imageUrl) return product.imageUrl;
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    if (firstVariant.images && firstVariant.images.length > 0) {
      return firstVariant.images[0].image_url;
    }
    if (firstVariant.color_image) return firstVariant.color_image;
  }
  return 'https://via.placeholder.com/400x600';
};

// Category data (same as in navigation) - fallback data
const categoriesDataFallback: Category[] = [
  {
    id: 1,
    name: 'WOMEN',
    href: '/category/women',
    subCategories: [
      {
        id: 1,
        name: 'Clothing',
        href: '#women-clothing',
        subSubCategories: [
          { id: 1, name: 'Dresses', href: '#dresses' },
          { id: 2, name: 'Tops', href: '#tops' },
          { id: 3, name: 'Pants & Skirts', href: '#pants-skirts' },
          { id: 4, name: 'Outerwear', href: '#outerwear' },
        ],
      },
      {
        id: 2,
        name: 'Shoes',
        href: '#women-shoes',
        subSubCategories: [
          { id: 1, name: 'Heels', href: '#heels' },
          { id: 2, name: 'Flats', href: '#flats' },
          { id: 3, name: 'Boots', href: '#boots' },
        ],
      },
      {
        id: 3,
        name: 'Accessories',
        href: '#women-accessories',
        subSubCategories: [
          { id: 1, name: 'Handbags', href: '#handbags' },
          { id: 2, name: 'Jewelry', href: '#jewelry' },
          { id: 3, name: 'Scarves', href: '#scarves' },
        ],
      },
      { id: 4, name: 'New Arrivals', href: '#women-new' },
      { id: 5, name: 'Sale', href: '#women-sale' },
    ],
  },
  {
    id: 2,
    name: 'MEN',
    href: '/category/men',
    subCategories: [
      {
        id: 1,
        name: 'Clothing',
        href: '#men-clothing',
        subSubCategories: [
          { id: 1, name: 'Shirts', href: '#shirts' },
          { id: 2, name: 'T-Shirts', href: '#tshirts' },
          { id: 3, name: 'Pants & Jeans', href: '#pants' },
          { id: 4, name: 'Suits & Blazers', href: '#suits' },
          { id: 5, name: 'Jackets & Coats', href: '#jackets' },
        ],
      },
      {
        id: 2,
        name: 'Shoes',
        href: '#men-shoes',
        subSubCategories: [
          { id: 1, name: 'Sneakers', href: '#sneakers' },
          { id: 2, name: 'Dress Shoes', href: '#dress-shoes' },
          { id: 3, name: 'Boots', href: '#boots' },
          { id: 4, name: 'Casual', href: '#casual' },
        ],
      },
      {
        id: 3,
        name: 'Accessories',
        href: '#men-accessories',
        subSubCategories: [
          { id: 1, name: 'Watches', href: '#watches' },
          { id: 2, name: 'Belts', href: '#belts' },
          { id: 3, name: 'Wallets', href: '#wallets' },
        ],
      },
      { id: 4, name: 'New Arrivals', href: '#men-new' },
      { id: 5, name: 'Sale', href: '#men-sale' },
    ],
  },
  {
    id: 3,
    name: 'KIDS',
    href: '/category/kids',
    subCategories: [
      { id: 1, name: 'Boys', href: '#boys' },
      { id: 2, name: 'Girls', href: '#girls' },
      { id: 3, name: 'Baby', href: '#baby' },
      { id: 4, name: 'New Arrivals', href: '#kids-new' },
    ],
  },
  {
    id: 4,
    name: 'ACCESSORIES',
    href: '/category/accessories',
    subCategories: [
      {
        id: 1,
        name: 'Bags & Luggage',
        href: '#bags',
        subSubCategories: [
          { id: 1, name: 'Handbags', href: '#handbags' },
          { id: 2, name: 'Backpacks', href: '#backpacks' },
          { id: 3, name: 'Travel Bags', href: '#travel-bags' },
        ],
      },
      {
        id: 2,
        name: 'Jewelry',
        href: '#jewelry',
        subSubCategories: [
          { id: 1, name: 'Necklaces', href: '#necklaces' },
          { id: 2, name: 'Rings', href: '#rings' },
          { id: 3, name: 'Earrings', href: '#earrings' },
          { id: 4, name: 'Bracelets', href: '#bracelets' },
        ],
      },
      { id: 3, name: 'Watches', href: '#watches' },
      { id: 4, name: 'Sunglasses', href: '#sunglasses' },
      { id: 5, name: 'Belts', href: '#belts' },
    ],
  },
];

// Mock products data
const allProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Cotton T-Shirt',
    price: 45,
    category: 'MEN',
    subCategory: 'Clothing',
    subSubCategory: 'T-Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1758613653752-726b9e13311c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwcm9kdWN0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NzEzMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['S', 'M', 'L', 'XL'],
    color: ['Black', 'White', 'Navy'],
    brand: 'Premium',
  },
  {
    id: 2,
    name: 'Elegant Blazer',
    price: 185,
    category: 'WOMEN',
    subCategory: 'Clothing',
    subSubCategory: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1682397125372-4b02f5436d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeSUyMG1vZGVsfGVufDF8fHx8MTc2NzEzMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Black', 'Navy', 'Gray'],
    brand: 'Elegance',
  },
  {
    id: 3,
    name: 'Classic Denim Jacket',
    price: 125,
    category: 'MEN',
    subCategory: 'Clothing',
    subSubCategory: 'Jackets & Coats',
    imageUrl: 'https://images.unsplash.com/photo-1718670013939-954787e56385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWNvbW1lcmNlJTIwcHJvZHVjdCUyMHBob3RvZnxlbnwxfHx8fDE3NjcxMzE5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['S', 'M', 'L', 'XL'],
    color: ['Blue', 'Black'],
    brand: 'Classic',
  },
  {
    id: 4,
    name: 'Luxury Knitwear',
    price: 165,
    category: 'WOMEN',
    subCategory: 'Clothing',
    subSubCategory: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1693930441794-4c6a9f4c0bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5JTIwbW9kZWx8ZW58MXx8fHwxNzY3MTMxOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Beige', 'Gray', 'White'],
    brand: 'Luxury',
  },
  {
    id: 5,
    name: 'Designer Sneakers',
    price: 220,
    category: 'MEN',
    subCategory: 'Shoes',
    subSubCategory: 'Sneakers',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc25lYWtlcnMlMjBwcm9kdWN0fGVufDF8fHx8MTc2NzEzMTk3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['40', '41', '42', '43', '44'],
    color: ['White', 'Black'],
    brand: 'Designer',
  },
  {
    id: 6,
    name: 'Leather Handbag',
    price: 295,
    category: 'WOMEN',
    subCategory: 'Accessories',
    subSubCategory: 'Handbags',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwcHJvZHVjdHxlbnwxfHx8MTc2NzEzMTk3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['One Size'],
    color: ['Brown', 'Black'],
    brand: 'Luxury',
  },
  {
    id: 7,
    name: 'Wool Overcoat',
    price: 385,
    category: 'MEN',
    subCategory: 'Clothing',
    subSubCategory: 'Jackets & Coats',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwY29hdCUyMHByb2R1Y3R8ZW58MXx8fHwxNzY3MTMxOTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['S', 'M', 'L', 'XL'],
    color: ['Black', 'Navy', 'Gray'],
    brand: 'Premium',
  },
  {
    id: 8,
    name: 'Silk Scarf',
    price: 75,
    category: 'ACCESSORIES',
    subCategory: 'Jewelry',
    subSubCategory: 'Scarves',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2NhcmYlMjBhY2Nlc3Nvcnl8ZW58MXx8fHwxNzY3MTMxOTc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    size: ['One Size'],
    color: ['Blue', 'Red', 'Green'],
    brand: 'Elegance',
  },
  // Add more products...
  {
    id: 9,
    name: 'Summer Dress',
    price: 89,
    category: 'WOMEN',
    subCategory: 'Clothing',
    subSubCategory: 'Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop',
    size: ['XS', 'S', 'M', 'L'],
    color: ['White', 'Pink', 'Blue'],
    brand: 'Summer',
  },
  {
    id: 10,
    name: 'High Heels',
    price: 150,
    category: 'WOMEN',
    subCategory: 'Shoes',
    subSubCategory: 'Heels',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop',
    size: ['36', '37', '38', '39', '40'],
    color: ['Black', 'Red', 'Nude'],
    brand: 'Elegance',
  },
  {
    id: 11,
    name: 'Casual Shirt',
    price: 65,
    category: 'MEN',
    subCategory: 'Clothing',
    subSubCategory: 'Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&h=600&fit=crop',
    size: ['S', 'M', 'L', 'XL'],
    color: ['White', 'Blue', 'Gray'],
    brand: 'Casual',
  },
  {
    id: 12,
    name: 'Leather Watch',
    price: 250,
    category: 'ACCESSORIES',
    subCategory: 'Watches',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop',
    size: ['One Size'],
    color: ['Black', 'Brown'],
    brand: 'Timepiece',
  },
];

interface Filters {
  priceRange: [number, number];
  subCategory?: string;
  subSubCategory?: string;
}

export default function CategoryPage({ 
  params
}: { 
  params: { slug: string };
}) {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedSubCategories, setExpandedSubCategories] = useState<number[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const subCategoryParam = searchParams.get('subCategory');
  const subSubCategoryParam = searchParams.get('subSubCategory');
  
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    subCategory: subCategoryParam || undefined,
    subSubCategory: subSubCategoryParam || undefined,
  });

  // Load category and products from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiCategory = await fetchCategoryBySlug(params.slug, 'en');
        
        if (apiCategory) {
          const transformedCategory = transformCategory(apiCategory);
          setCategory(transformedCategory);
          
          // Load products for this category
          const genderMap: { [key: string]: string } = {
            'women': 'female',
            'men': 'male',
            'kids': 'kids',
          };
          
          const gender = genderMap[params.slug.toLowerCase()] || params.slug.toLowerCase();
          const productsData = await fetchProducts({
            category_id: apiCategory.id,
            itemGender: gender,
            lang: 'en',
            limit: 100,
          });
          
          setProducts(productsData.products);
        } else {
          // Fallback to default category
          const fallbackCategory = categoriesDataFallback.find(
            (cat) => cat.href === `/category/${params.slug}`
          );
          setCategory(fallbackCategory || null);
        }
      } catch (error) {
        console.error('Error loading category:', error);
        const fallbackCategory = categoriesDataFallback.find(
          (cat) => cat.href === `/category/${params.slug}`
        );
        setCategory(fallbackCategory || null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.slug]);

  // Update filters when searchParams change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      subCategory: subCategoryParam || undefined,
      subSubCategory: subSubCategoryParam || undefined,
    }));
  }, [subCategoryParam, subSubCategoryParam]);

  // Filter products by category and filters
  const categoryProducts = useMemo(() => {
    return products.filter((product) => {
      // Apply price filter
      const productPrice = product.variants && product.variants.length > 0 
        ? product.variants[0].price 
        : product.price;
      
      if (filters.priceRange[0] > productPrice || filters.priceRange[1] < productPrice) {
        return false;
      }
      
      // Apply subcategory filter if needed
      // Note: This would require additional API calls or product category mapping
      
      return true;
    });
  }, [products, filters]);

  const toggleSubCategory = (id: number) => {
    setExpandedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <UrbanNavigation />
        <div className="pt-24 pb-16 px-6 lg:px-12 text-center">
          <h1 className="text-2xl mb-4">Loading...</h1>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <UrbanNavigation />
        <div className="pt-24 pb-16 px-6 lg:px-12 text-center">
          <h1 className="text-2xl mb-4">Category not found</h1>
          <Link href="/" className="text-[#2c3b6e] hover:text-black">
            Go to homepage
          </Link>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 tracking-tight text-[#2c3b6e]">
              {category.name}
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} found
            </p>

            {/* Breadcrumbs */}
            {(filters.subCategory || filters.subSubCategory) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-2 text-xs tracking-wide text-gray-600 mb-6"
              >
                <Link
                  href={category.href}
                  className="hover:text-[#2c3b6e] transition-colors"
                >
                  {category.name}
                </Link>
                {filters.subCategory && (
                  <>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    {filters.subSubCategory ? (
                      <Link
                        href={`${category.href}?subCategory=${encodeURIComponent(filters.subCategory)}`}
                        className="hover:text-[#2c3b6e] transition-colors"
                      >
                        {filters.subCategory}
                      </Link>
                    ) : (
                      <span className="text-[#2c3b6e] font-medium">
                        {filters.subCategory}
                      </span>
                    )}
                  </>
                )}
                {filters.subSubCategory && (
                  <>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-[#2c3b6e] font-medium">
                      {filters.subSubCategory}
                    </span>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Horizontal Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Mobile Filter Toggle */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-4 bg-transparent border-b-2 border-gray-200 mb-6"
            >
              <span className="text-xs tracking-[0.12em] text-gray-600 uppercase">
                Filters
              </span>
              <motion.div
                animate={{ rotate: filtersOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </motion.div>
            </motion.button>

              {/* Filters Panel - Horizontal Layout */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${filtersOpen ? 'block' : 'hidden'} lg:block border-b border-gray-200 pb-6 mb-8`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 lg:flex-wrap">
                {/* Subcategories */}
                <div className="w-full lg:w-auto flex-shrink-0 mb-4 lg:mb-0">
                  <div className="flex flex-wrap gap-3">
                    {category.subCategories.map((subCat, index) => (
                      <motion.div
                        key={subCat.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="relative"
                      >
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (subCat.subSubCategories) {
                              toggleSubCategory(subCat.id);
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                subCategory: prev.subCategory === subCat.name ? undefined : subCat.name,
                                subSubCategory: undefined,
                              }));
                            }
                          }}
                          className={`text-xs tracking-[0.12em] py-3 px-6 transition-all duration-300 flex items-center gap-2 relative ${
                            filters.subCategory === subCat.name
                              ? 'text-[#2c3b6e] font-medium'
                              : 'text-gray-600 hover:text-[#2c3b6e]'
                          }`}
                        >
                          <span>{subCat.name}</span>
                          {subCat.subSubCategories && (
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-300 ${
                                expandedSubCategories.includes(subCat.id) ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                          {filters.subCategory === subCat.name && (
                            <motion.span
                              layoutId="activeCategory"
                              className="absolute bottom-0 left-0 right-0 h-px bg-[#2c3b6e]"
                              initial={false}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.button>
                        {subCat.subSubCategories && expandedSubCategories.includes(subCat.id) && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-3 bg-white border border-gray-200 shadow-lg p-4 z-50 min-w-[240px]"
                          >
                            {subCat.subSubCategories.map((subSubCat) => (
                              <motion.button
                                key={subSubCat.id}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    subCategory: subCat.name,
                                    subSubCategory:
                                      prev.subSubCategory === subSubCat.name
                                        ? undefined
                                        : subSubCat.name,
                                  }))
                                }
                                className={`w-full text-left text-xs tracking-wide py-2.5 px-4 transition-colors ${
                                  filters.subSubCategory === subSubCat.name
                                    ? 'bg-[#2c3b6e] text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {subSubCat.name}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="w-full lg:w-auto flex-shrink-0 mb-4 lg:mb-0">
                  <div className="flex items-center gap-3">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [Number(e.target.value), prev.priceRange[1]],
                        }))
                      }
                      className="w-24 px-4 py-2.5 border-b-2 border-gray-300 text-sm focus:outline-none focus:border-[#2c3b6e] bg-transparent transition-colors tracking-wide"
                      placeholder="Min"
                    />
                    <span className="text-gray-400 text-sm">-</span>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], Number(e.target.value)],
                        }))
                      }
                      className="w-24 px-4 py-2.5 border-b-2 border-gray-300 text-sm focus:outline-none focus:border-[#2c3b6e] bg-transparent transition-colors tracking-wide"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {filters.subCategory && (
                  <div className="w-full lg:w-auto flex-shrink-0">
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearFilters}
                      className="w-full lg:w-auto text-xs tracking-[0.12em] py-3 px-6 text-gray-600 hover:text-[#2c3b6e] transition-all duration-300 uppercase"
                    >
                      Clear All
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Products Grid */}
          <div className="w-full">

            {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {categoryProducts.map((product, index) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="group cursor-pointer"
                      >
                        {/* Product Image */}
                        <div className="relative bg-gray-100 mb-3 overflow-hidden aspect-[3/4]">
                          <img
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-1">
                          <h3 className="text-sm group-hover:text-gray-600 transition-colors tracking-wide">
                            {product.name}
                          </h3>
                          <p className="text-black font-medium">
                            ${product.variants && product.variants.length > 0 
                              ? product.variants[0].price 
                              : product.price}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-4">No products found</p>
                  <button
                    onClick={clearFilters}
                    className="text-[#2c3b6e] hover:text-black transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}

