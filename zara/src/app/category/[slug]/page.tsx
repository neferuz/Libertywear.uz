'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import Link from 'next/link';
import { fetchCategoryBySlug, fetchCategories, fetchProducts, Category as APICategory, Product as APIProduct } from '@/lib/api';

// Format price with space as thousand separator and "сум" currency
const formatPrice = (price: number): string => {
  // Round to integer (no decimals for сум)
  const integerPrice = Math.round(price);
  
  // Add space as thousand separator
  const formattedPrice = integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${formattedPrice} сум`;
};

// Format number with space as thousand separator (for input display)
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Parse formatted number (remove spaces) to number
const parseFormattedNumber = (formatted: string): number => {
  return parseInt(formatted.replace(/\s/g, ''), 10) || 0;
};

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

// Helper function to get translated text
const getTranslatedText = (translations: any, lang: string, fallback: string): string => {
  if (!translations) return fallback;
  if (typeof translations === 'string') {
    try {
      translations = JSON.parse(translations);
    } catch (e) {
      return fallback;
    }
  }
  return translations[lang] || translations['ru'] || translations['en'] || fallback;
};

// Helper function to transform API category to component format
const transformCategory = (apiCat: APICategory, lang: string = 'en'): Category => {
  const slug = apiCat.slug || apiCat.title.toLowerCase().replace(/\s+/g, '-');
  const title = getTranslatedText(apiCat.title_translations, lang, apiCat.title);
  return {
    id: apiCat.id,
    name: title.toUpperCase(),
    href: `/category/${slug}`,
    subCategories: apiCat.subcategories?.map((sub) => {
      const subTitle = getTranslatedText(sub.title_translations, lang, sub.title);
      return {
        id: sub.id,
        name: subTitle,
        href: `/category/${sub.slug || sub.title.toLowerCase().replace(/\s+/g, '-')}`,
        subSubCategories: sub.subcategories?.map((subsub) => {
          const subSubTitle = getTranslatedText(subsub.title_translations, lang, subsub.title);
          return {
            id: subsub.id,
            name: subSubTitle,
            href: `/category/${subsub.slug || subsub.title.toLowerCase().replace(/\s+/g, '-')}`,
          };
        }),
      };
    }) || [],
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
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedSubCategories, setExpandedSubCategories] = useState<number[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const subCategoryParam = searchParams.get('subCategory');
  const subSubCategoryParam = searchParams.get('subSubCategory');
  
  // Get slug from params
  const slug = params?.slug || '';
  
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000000], // Will be updated when products load
    subCategory: subCategoryParam || undefined,
    subSubCategory: subSubCategoryParam || undefined,
  });

  // Slug mapping for Russian/transliterated slugs
  const slugMap: { [key: string]: string } = {
    'zhenschiny': 'women',
    'zhenshchiny': 'women',
    'muzhchiny': 'men',
    'deti': 'kids',
    'dety': 'kids',
  };

  // Load category and products from API
  useEffect(() => {
    if (!slug) {
      console.warn('⚠️ [CategoryPage] No slug provided, params:', params);
      setLoading(false);
      setCategory(null);
      return;
    }
    
    const loadData = async () => {
      try {
        setLoading(true);
        const currentLang = getLanguageCode();
        console.log('🔍 [CategoryPage] Starting loadData with:', {
          slug: slug,
          language: currentLang,
          params: params,
        });
        
        // Normalize slug - check if it's a transliterated version
        const normalizedSlug = slugMap[slug.toLowerCase()] || slug;
        console.log('🔍 [CategoryPage] Normalized slug:', normalizedSlug);
        
        // Try to find category by slug
        let apiCategory = await fetchCategoryBySlug(normalizedSlug, currentLang);
        
        // If not found, try original slug
        if (!apiCategory && slug !== normalizedSlug) {
          console.log('🔍 [CategoryPage] Trying original slug:', slug);
          apiCategory = await fetchCategoryBySlug(slug, currentLang);
        }
        
        // If still not found, try to find by gender
        if (!apiCategory) {
          console.log('🔍 [CategoryPage] Category not found by slug, trying by gender');
          const allCategories = await fetchCategories(currentLang);
          const genderMap: { [key: string]: string } = {
            'women': 'female',
            'men': 'male',
            'kids': 'kids',
            'zhenschiny': 'female',
            'zhenshchiny': 'female',
            'muzhchiny': 'male',
            'deti': 'kids',
            'dety': 'kids',
          };
          const gender = genderMap[normalizedSlug.toLowerCase()] || genderMap[slug.toLowerCase()];
          if (gender) {
            apiCategory = allCategories.find(cat => cat.gender === gender) || null;
            if (apiCategory) {
              console.log('✅ [CategoryPage] Found category by gender:', {
                id: apiCategory.id,
                title: apiCategory.title,
                slug: apiCategory.slug,
                gender: apiCategory.gender,
              });
            }
          }
        }
        
        console.log('🔍 [CategoryPage] Final category:', apiCategory ? {
          id: apiCategory.id,
          title: apiCategory.title,
          slug: apiCategory.slug,
        } : 'null');
        
        if (apiCategory) {
          const transformedCategory = transformCategory(apiCategory, currentLang);
          setCategory(transformedCategory);
          
          // Load products for this category
          const genderMap: { [key: string]: string } = {
            'women': 'female',
            'men': 'male',
            'kids': 'kids',
            'zhenschiny': 'female',
            'zhenshchiny': 'female',
            'muzhchiny': 'male',
            'deti': 'kids',
            'dety': 'kids',
          };
          
          const gender = genderMap[normalizedSlug.toLowerCase()] || genderMap[slug.toLowerCase()] || normalizedSlug.toLowerCase();
          console.log('🔍 [CategoryPage] Fetching products with params:', {
            itemGender: gender,
            lang: currentLang,
            limit: 100,
            note: 'Using only itemGender to get all products from category and subcategories',
          });
          
          // Try multiple approaches to get products
          let productsData = { products: [], total: 0 };
          
          // Approach 1: Use only itemGender (includes all subcategories)
          console.log('🔍 [CategoryPage] Trying approach 1: itemGender only');
          productsData = await fetchProducts({
            itemGender: gender,
            lang: currentLang,
            limit: 100,
          });
          
          console.log('🔍 [CategoryPage] Approach 1 result:', {
            productsCount: productsData.products.length,
            total: productsData.total,
          });
          
          // Approach 2: If no products, try with itemCategory
          if (productsData.products.length === 0) {
            console.log('🔍 [CategoryPage] Trying approach 2: itemCategory only');
            productsData = await fetchProducts({
              itemCategory: apiCategory.slug,
              lang: currentLang,
              limit: 100,
            });
            console.log('🔍 [CategoryPage] Approach 2 result:', {
              productsCount: productsData.products.length,
              total: productsData.total,
            });
          }
          
          // Approach 3: If still no products, try both
          if (productsData.products.length === 0) {
            console.log('🔍 [CategoryPage] Trying approach 3: itemCategory + itemGender');
            productsData = await fetchProducts({
              itemCategory: apiCategory.slug,
              itemGender: gender,
              lang: currentLang,
              limit: 100,
            });
            console.log('🔍 [CategoryPage] Approach 3 result:', {
              productsCount: productsData.products.length,
              total: productsData.total,
            });
          }
          
          // Approach 4: If still no products, try without any filters (all products)
          if (productsData.products.length === 0) {
            console.log('🔍 [CategoryPage] Trying approach 4: no filters (all products)');
            const allProductsData = await fetchProducts({
              lang: currentLang,
              limit: 100,
            });
            // Filter by category_id on client side
            const filteredByCategory = allProductsData.products.filter(p => p.category_id === apiCategory.id);
            productsData = {
              products: filteredByCategory,
              total: filteredByCategory.length,
            };
            console.log('🔍 [CategoryPage] Approach 4 result:', {
              allProducts: allProductsData.products.length,
              filteredByCategory: productsData.products.length,
            });
          }
          
          console.log('🔍 [CategoryPage] Final products response:', {
            productsCount: productsData.products.length,
            total: productsData.total,
            allProducts: productsData.products.map(p => ({
              id: p.id,
              name: p.name,
              category_id: p.category_id,
            })),
          });
          
          // Check for duplicates
          const productIds = productsData.products.map(p => p.id);
          const uniqueIds = [...new Set(productIds)];
          if (productIds.length !== uniqueIds.length) {
            console.warn('⚠️ [CategoryPage] Duplicate product IDs found!', {
              total: productIds.length,
              unique: uniqueIds.length,
              duplicates: productIds.filter((id, index) => productIds.indexOf(id) !== index),
            });
          }
          
          setProducts(productsData.products);
        } else {
          console.warn('⚠️ [CategoryPage] Category not found at all for slug:', slug);
          setCategory(null);
          setProducts([]);
        }
      } catch (error: any) {
        console.error('❌ [CategoryPage] Error loading category:', error);
        console.error('❌ [CategoryPage] Error details:', {
          message: error?.message,
          stack: error?.stack,
          slug: slug,
        });
        // Try fallback category
        const normalizedSlug = slugMap[slug.toLowerCase()] || slug;
        const fallbackCategory = categoriesDataFallback.find(
          (cat) => cat.href === `/category/${normalizedSlug}` || cat.href === `/category/${slug}`
        );
        if (fallbackCategory) {
          console.log('✅ [CategoryPage] Using fallback category:', fallbackCategory);
          setCategory(fallbackCategory);
        } else {
          console.warn('⚠️ [CategoryPage] No fallback category found');
          setCategory(null);
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, language, params]); // Reload when slug, language, or params change

  // Update filters when searchParams change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      subCategory: subCategoryParam || undefined,
      subSubCategory: subSubCategoryParam || undefined,
    }));
  }, [subCategoryParam, subSubCategoryParam]);

  // Reset filters when language changes (because category names change)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [0, prev.priceRange[1] || 1000000], // Keep max price if available
      subCategory: subCategoryParam || undefined,
      subSubCategory: subSubCategoryParam || undefined,
    }));
    setExpandedSubCategories([]);
  }, [language]);

  // Calculate max price from products for filter
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 1000000; // Default max if no products
    
    const prices = products.map(p => {
      return p.variants && p.variants.length > 0 ? p.variants[0].price : p.price;
    });
    
    const max = Math.max(...prices);
    // Round up to nearest 10000 for better UX
    return Math.ceil(max / 10000) * 10000 || 1000000;
  }, [products]);

  // Update price range max when products change (only if it's still the default)
  useEffect(() => {
    if (maxProductPrice > 0 && maxProductPrice < 1000000 && filters.priceRange[1] >= 1000000) {
      setFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], maxProductPrice],
      }));
    }
  }, [maxProductPrice]);

  // Filter products by category and filters
  const categoryProducts = useMemo(() => {
    console.log('🔍 [CategoryPage] Filtering products:', {
      totalProducts: products.length,
      filters: filters,
      maxProductPrice: maxProductPrice,
      productIds: products.map(p => p.id),
      productNames: products.map(p => p.name),
      productPrices: products.map(p => {
        const price = p.variants && p.variants.length > 0 ? p.variants[0].price : p.price;
        return { id: p.id, price: price };
      }),
    });
    
    // Remove duplicates by ID - keep first occurrence
    const seenIds = new Set<number>();
    const uniqueProducts = products.filter((product) => {
      if (seenIds.has(product.id)) {
        console.warn('⚠️ [CategoryPage] Duplicate product ID found:', product.id, product.name);
        return false;
      }
      seenIds.add(product.id);
      return true;
    });
    
    console.log('🔍 [CategoryPage] Unique products after deduplication:', {
      before: products.length,
      after: uniqueProducts.length,
      removed: products.length - uniqueProducts.length,
    });
    
    const filtered = uniqueProducts.filter((product) => {
      // Apply price filter
      const productPrice = product.variants && product.variants.length > 0 
        ? product.variants[0].price 
        : product.price;
      
      // Check if price is within range (inclusive)
      const minPrice = filters.priceRange[0] || 0;
      const maxPrice = filters.priceRange[1] || 1000000; // Large default max
      
      if (productPrice < minPrice || productPrice > maxPrice) {
        console.log('🔍 [CategoryPage] Product filtered out by price:', {
          id: product.id,
          name: product.name,
          price: productPrice,
          minPrice: minPrice,
          maxPrice: maxPrice,
        });
        return false;
      }
      
      // Apply subcategory filter if needed
      // Note: This would require additional API calls or product category mapping
      
      return true;
    });
    
    console.log('🔍 [CategoryPage] Final filtered products:', {
      count: filtered.length,
      priceRange: filters.priceRange,
      products: filtered.map(p => ({
        id: p.id,
        name: p.name,
        price: p.variants?.[0]?.price || p.price,
      })),
    });
    
    return filtered;
  }, [products, filters]);

  const toggleSubCategory = (id: number) => {
    setExpandedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: [0, maxProductPrice], // Use calculated max price
    }));
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
          <h1 className="text-2xl mb-4">{t('category.categoryNotFound', getLanguageCode())}</h1>
          <Link href="/" className="text-[#2c3b6e] hover:text-black">
            {t('category.goToHomepage', getLanguageCode())}
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
              {categoryProducts.length} {categoryProducts.length === 1 ? t('category.product', getLanguageCode()) : t('category.products', getLanguageCode())} {t('category.found', getLanguageCode())}
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
                {t('category.filters', getLanguageCode())}
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
                  <div className="flex flex-wrap gap-1">
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
                          className={`text-xs tracking-[0.12em] py-2 px-3 transition-all duration-300 flex items-center gap-1.5 relative ${
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
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        min="0"
                        max={maxProductPrice}
                        value={formatNumber(filters.priceRange[0])}
                        onChange={(e) => {
                          const parsed = parseFormattedNumber(e.target.value);
                          if (!isNaN(parsed) && parsed >= 0 && parsed <= maxProductPrice) {
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [parsed, prev.priceRange[1]],
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          const parsed = parseFormattedNumber(e.target.value);
                          if (isNaN(parsed) || parsed < 0) {
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [0, prev.priceRange[1]],
                            }));
                          }
                        }}
                        className="w-28 px-4 py-2.5 border-b-2 border-gray-300 text-sm focus:outline-none focus:border-[#2c3b6e] bg-transparent transition-colors tracking-wide"
                        placeholder={t('category.min', getLanguageCode())}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">-</span>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        min="0"
                        max={maxProductPrice}
                        value={formatNumber(filters.priceRange[1])}
                        onChange={(e) => {
                          const parsed = parseFormattedNumber(e.target.value);
                          if (!isNaN(parsed) && parsed >= 0 && parsed <= maxProductPrice) {
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], parsed],
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          const parsed = parseFormattedNumber(e.target.value);
                          if (isNaN(parsed) || parsed < 0 || parsed < filters.priceRange[0]) {
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], Math.max(prev.priceRange[0], maxProductPrice)],
                            }));
                          }
                        }}
                        className="w-28 px-4 py-2.5 border-b-2 border-gray-300 text-sm focus:outline-none focus:border-[#2c3b6e] bg-transparent transition-colors tracking-wide"
                        placeholder={t('category.max', getLanguageCode())}
                      />
                    </div>
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
                    <Link key={`product-${product.id}-${index}`} href={`/product/${product.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="group cursor-pointer"
                      >
                        {/* Product Image */}
                        <div className="relative bg-gray-100 mb-3 overflow-hidden aspect-[3/4]">
                          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                            <Image
                              src={getProductImageUrl(product)}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover"
                              loading={index < 4 ? "eager" : "lazy"}
                              priority={index < 4}
                              quality={85}
                              unoptimized={false}
                            />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-1">
                          <h3 className="text-sm group-hover:text-gray-600 transition-colors tracking-wide">
                            {product.name}
                          </h3>
                          <p className="text-black font-medium">
                            {formatPrice(product.variants && product.variants.length > 0 
                              ? product.variants[0].price 
                              : product.price)}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-4">{t('category.noProductsFound', getLanguageCode())}</p>
                  <button
                    onClick={clearFilters}
                    className="text-[#2c3b6e] hover:text-black transition-colors"
                  >
                    {t('category.clearFilters', getLanguageCode())}
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

