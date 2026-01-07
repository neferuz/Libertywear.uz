'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus, X, ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { fetchProductById, fetchProducts, fetchCategories, Product as APIProduct, Category as APICategory, addFavorite, removeFavorite, getFavorites } from '@/lib/api';

// Helper function to get translated text from API translations
const getTranslatedText = (translations: any, lang: string, fallback: string): string => {
  if (!translations) return fallback;
  
  if (typeof translations === 'string') {
    try {
      const parsed = JSON.parse(translations);
      return parsed[lang] || parsed['en'] || fallback;
    } catch {
      return fallback;
    }
  }
  
  if (typeof translations === 'object') {
    return translations[lang] || translations['en'] || fallback;
  }
  
  return fallback;
};

// Format price with space as thousand separator and "сум" currency
const formatPrice = (price: number): string => {
  // Round to integer (no decimals for сум)
  const integerPrice = Math.round(price);
  
  // Add space as thousand separator
  const formattedPrice = integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${formattedPrice} сум`;
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
  description?: string;
  images?: string[];
}

// Mock products data (same as in category page)
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
    description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this classic piece features a relaxed fit and timeless design. Perfect for everyday wear, it combines style with sustainability.',
    images: [
      'https://images.unsplash.com/photo-1758613653752-726b9e13311c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1080',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1080',
    ],
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
    description: 'A sophisticated blazer that elevates any outfit. Crafted from premium wool blend, this piece features a tailored fit and classic design. Perfect for both professional and casual settings.',
    images: [
      'https://images.unsplash.com/photo-1682397125372-4b02f5436d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1080',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1080',
    ],
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
    description: 'A timeless denim jacket that never goes out of style. Made from premium denim, this versatile piece can be dressed up or down. Features classic details and a comfortable fit.',
    images: [
      'https://images.unsplash.com/photo-1718670013939-954787e56385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1080',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1080',
    ],
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
    description: 'Indulge in luxury with this premium knitwear piece. Made from the finest cashmere blend, it offers unparalleled softness and warmth. A perfect addition to any sophisticated wardrobe.',
    images: [
      'https://images.unsplash.com/photo-1693930441794-4c6a9f4c0bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1080',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1080',
    ],
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
    description: 'Step into style with these premium designer sneakers. Combining comfort and fashion, these shoes feature innovative design and high-quality materials. Perfect for the modern lifestyle.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1080',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1080',
    ],
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
    description: 'A statement piece that combines elegance and functionality. Made from genuine leather, this handbag features spacious compartments and timeless design. The perfect accessory for any occasion.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1080',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080',
    ],
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
    description: 'A sophisticated overcoat crafted from premium wool. This timeless piece offers exceptional warmth and style. Perfect for formal occasions and cold weather.',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1080',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1080',
    ],
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
    description: 'Add a touch of elegance with this luxurious silk scarf. Made from 100% pure silk, it features a beautiful pattern and soft texture. A versatile accessory for any outfit.',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=1080',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1080',
    ],
  },
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
    description: 'A beautiful summer dress perfect for warm weather. Made from lightweight, breathable fabric, it features a flattering silhouette and vibrant colors. Ideal for casual outings and special occasions.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1080',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1080',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1080',
    ],
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
    description: 'Elevate your style with these elegant high heels. Crafted with attention to detail, they offer both comfort and sophistication. Perfect for formal events and special occasions.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1080',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1080',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1080',
    ],
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
    description: 'A versatile casual shirt that works for any occasion. Made from comfortable cotton, it features a relaxed fit and classic design. Easy to style and perfect for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1080',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1080',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1080',
    ],
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
    description: 'A timeless timepiece that combines classic design with modern functionality. Made from genuine leather and premium materials, this watch is a perfect accessory for any style.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1080',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1080',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=1080',
    ],
  },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and favorite status
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    
    const checkFavoriteStatus = async () => {
      if (!token) {
        setIsFavorite(false);
        return;
      }
      
      try {
        const favorites = await getFavorites(token);
        const productId = Number(params.id);
        setIsFavorite(favorites.some(fav => fav.product_id === productId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [params.id]);

  // Load product from API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productId = Number(params.id);
        // Use language from context directly, fallback to getLanguageCode() for SSR
        const currentLang = language || getLanguageCode();
        
        console.log('🔄 [ProductPage] Loading product:', productId, 'with language:', currentLang, 'from context:', language);
        
        // Load categories and product in parallel
        const [categories, apiProduct] = await Promise.all([
          fetchCategories(currentLang),
          fetchProductById(productId, currentLang),
        ]);
        
        if (!apiProduct) {
          console.error('❌ [ProductPage] Product not found:', productId);
          setProduct(null);
          setLoading(false);
          return;
        }
        
        console.log('✅ [ProductPage] Product loaded:', apiProduct.id, apiProduct.name);

        // Helper function to find category name by ID with translation
        const findCategoryName = (categoryId: number): string => {
          const findInCategories = (cats: APICategory[]): string | null => {
            for (const cat of cats) {
              if (cat.id === categoryId) {
                const translatedTitle = getTranslatedText(
                  cat.title_translations,
                  currentLang,
                  cat.title || ''
                );
                return translatedTitle ? translatedTitle.toUpperCase() : null;
              }
              if (cat.subcategories && cat.subcategories.length > 0) {
                const found = findInCategories(cat.subcategories);
                if (found) return found;
              }
            }
            return null;
          };
          
          const foundName = findInCategories(categories);
          return foundName || '';
        };

        // Transform API product to component format
        const firstVariant = apiProduct.variants && apiProduct.variants.length > 0 
          ? apiProduct.variants[0] 
          : null;
        
        // Get images from variants
        const images: string[] = [];
        if (firstVariant) {
          if (firstVariant.images && firstVariant.images.length > 0) {
            images.push(...firstVariant.images.map((img: any) => img.image_url));
          } else if (firstVariant.color_image) {
            images.push(firstVariant.color_image);
          }
        }
        
        // Get sizes from first variant
        const sizes = firstVariant?.sizes || [];
        
        // Get colors from all variants
        const colors = apiProduct.variants?.map((v: any) => v.color_name) || [];
        
        // Get category name from API
        const categoryName = apiProduct.category_id ? findCategoryName(apiProduct.category_id) : '';
        
        const transformedProduct = {
          id: apiProduct.id,
          name: apiProduct.name || 'Unnamed Product',
          price: firstVariant?.price || apiProduct.price || 0,
          imageUrl: images[0] || 'https://via.placeholder.com/400x600',
          category: categoryName,
          subCategory: '',
          subSubCategory: '',
          size: sizes,
          color: colors,
          brand: '',
          description: apiProduct.description || '',
          images: images.length > 0 ? images : [images[0] || 'https://via.placeholder.com/400x600'],
          variants: apiProduct.variants || [],
        };
        
        setProduct(transformedProduct);
        setSelectedVariant(firstVariant);
        
        // Auto-select first color if available
        if (firstVariant && firstVariant.color_name) {
          const hasSizeStock = firstVariant.size_stock && Object.values(firstVariant.size_stock).some((stock: any) => stock > 0);
          if (firstVariant.stock > 0 || hasSizeStock) {
            setSelectedColor(firstVariant.color_name);
          } else if (colors.length > 0) {
            // Select first color even if stock is 0, so user can see the product
            setSelectedColor(firstVariant.color_name);
          }
        }
        
        // Load recommended products
        const recommended = await fetchProducts({
          limit: 4,
          lang: currentLang,
        });
        
        // Transform recommended products with category names
        const transformedRecommended = (recommended.products || [])
          .filter((p: any) => p.id !== productId)
          .slice(0, 4)
          .map((p: any) => {
            const pFirstVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
            let pImageUrl = 'https://via.placeholder.com/400x600';
            if (pFirstVariant) {
              if (pFirstVariant.images && pFirstVariant.images.length > 0) {
                pImageUrl = pFirstVariant.images[0].image_url;
              } else if (pFirstVariant.color_image) {
                pImageUrl = pFirstVariant.color_image;
              }
            }
            
            // Get category name for recommended product
            const pCategoryName = p.category_id ? findCategoryName(p.category_id) : '';
            
            return {
              id: p.id,
              name: p.name || 'Unnamed Product',
              price: pFirstVariant?.price || p.price || 0,
              imageUrl: pImageUrl,
              category: pCategoryName,
              subCategory: '',
            };
          });
        
        setRecommendedProducts(transformedRecommended);
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id, language]); // Reload when language changes

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <UrbanNavigation />
        <div className="pt-24 pb-16 px-6 lg:px-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <UrbanNavigation />
        <div className="pt-24 pb-16 px-6 lg:px-12 text-center">
          <h1 className="text-2xl mb-4">{t('product.productNotFound', language)}</h1>
          <Link href="/" className="text-[#2c3b6e] hover:text-black">
            {t('product.goToHomepage', language)}
          </Link>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  const images = product.images || [product.imageUrl];

  // Handle variant selection (color)
  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    const variant = product.variants?.find((v: any) => v.color_name === colorName);
    if (variant) {
      setSelectedVariant(variant);
      // Update images when variant changes
      const newImages: string[] = [];
      if (variant.images && variant.images.length > 0) {
        newImages.push(...variant.images.map((img: any) => img.image_url));
      } else if (variant.color_image) {
        newImages.push(variant.color_image);
      }
      if (newImages.length > 0) {
        setProduct({ ...product, images: newImages, imageUrl: newImages[0] });
        setSelectedImage(0);
      }
      // Update available sizes for this variant
      if (variant.sizes && variant.sizes.length > 0) {
        setProduct({ ...product, size: variant.sizes });
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.size && product.size.length > 0) {
      setNotification({ message: t('product.pleaseSelectSize', language), type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (!selectedColor && product.color && product.color.length > 0) {
      setNotification({ message: t('product.pleaseSelectColor', language), type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsAddingToCart(true);
    
    // Use selected variant price if available
    const price = selectedVariant?.price || product.price;
    
    addToCart({
      ...product,
      price: price,
      size: selectedSize,
      color: selectedColor,
      variantId: selectedVariant?.id,
    });
    
    setTimeout(() => {
      setIsAddingToCart(false);
      setNotification({ message: t('product.itemAddedToCart', language), type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }, 500);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-24 left-1/2 z-[60] transform -translate-x-1/2"
          >
            <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'error' 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <AlertCircle className={`w-5 h-5 ${
                notification.type === 'error' ? 'text-red-600' : 'text-green-600'
              }`} strokeWidth={1.5} />
              <p className={`text-sm tracking-wide ${
                notification.type === 'error' ? 'text-red-800' : 'text-green-800'
              }`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pb-16 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button & Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2c3b6e] transition-colors tracking-wide"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {/* Breadcrumbs */}
              {(product.category || product.subCategory || product.subSubCategory) && (
                <div className="flex items-center gap-2 text-xs tracking-wide text-gray-600">
                  <ChevronRight className="w-3 h-3 text-gray-400 hidden sm:block" />
                  {product.category && (
                    <>
                      <Link
                        href={`/category/${product.category.toLowerCase()}`}
                        className="hover:text-[#2c3b6e] transition-colors"
                      >
                        {product.category}
                      </Link>
                      {product.subCategory && (
                        <>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          {product.subSubCategory ? (
                            <Link
                              href={`/category/${product.category.toLowerCase()}?subCategory=${encodeURIComponent(product.subCategory)}`}
                              className="hover:text-[#2c3b6e] transition-colors"
                            >
                              {product.subCategory}
                            </Link>
                          ) : (
                            <span className="text-[#2c3b6e] font-medium">
                              {product.subCategory}
                            </span>
                          )}
                        </>
                      )}
                      {product.subSubCategory && (
                        <>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          <span className="text-[#2c3b6e] font-medium">
                            {product.subSubCategory}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                    src={images[selectedImage]}
                    alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={selectedImage === 0}
                      quality={90}
                      unoptimized={false}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 overflow-hidden rounded-sm border-2 transition-all ${
                        selectedImage === index
                          ? 'border-[#2c3b6e]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                          loading="lazy"
                          quality={75}
                          unoptimized={false}
                      />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category & Brand */}
              <div className="space-y-2">
                {product.subCategory && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs tracking-[0.1em] text-gray-500 uppercase"
                  >
                    {product.subCategory}
                  </motion.p>
                )}
                {product.brand && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-xs tracking-wide text-gray-600"
                  >
                    {product.brand}
                  </motion.p>
                )}
              </div>

              {/* Product Name */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-[#2c3b6e]"
              >
                {product.name}
              </motion.h1>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-baseline gap-4"
              >
                <span className="text-2xl md:text-3xl font-medium text-black">
                  {formatPrice(selectedVariant?.price || product.price)}
                </span>
              </motion.div>

              {/* Description */}
              {product.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <h3 className="text-xs tracking-[0.1em] text-gray-700 uppercase">
                    {t('product.description', language)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                  {product.description}
                  </p>
                </motion.div>
              )}

              {/* Size Selection */}
              {product.size && product.size.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs tracking-[0.1em] text-gray-700 uppercase">
                      {t('product.size', language)}
                    </label>
                    {selectedSize && (
                      <span className="text-xs text-gray-500">{selectedSize}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.size.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 text-xs tracking-[0.1em] border-b-2 transition-all duration-300 ${
                          selectedSize === size
                            ? 'text-[#2c3b6e] border-[#2c3b6e] font-medium'
                            : 'text-gray-600 border-transparent hover:text-[#2c3b6e] hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Color Selection */}
              {product.color && product.color.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs tracking-[0.1em] text-gray-700 uppercase">
                      {t('product.color', language)}
                    </label>
                    {selectedColor && (
                      <span className="text-xs text-gray-500">{selectedColor}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants?.map((variant: any, index: number) => {
                      const color = variant.color_name;
                      // Check if variant has stock in any size
                      const hasSizeStock = variant.size_stock && Object.values(variant.size_stock).some((stock: any) => stock > 0);
                      // Allow selection even if stock is 0, but show as available if has size_stock
                      const isAvailable = variant && (variant.stock > 0 || hasSizeStock);
                      // Always allow clicking to see the variant, even if out of stock
                      const canSelect = true;
                      
                      return (
                      <motion.button
                          key={`${variant.id}-${color}-${index}`}
                          whileHover={canSelect ? { scale: 1.05, y: -2 } : {}}
                          whileTap={canSelect ? { scale: 0.95 } : {}}
                          onClick={() => canSelect && handleColorSelect(color)}
                          className={`px-4 py-2.5 text-xs tracking-[0.1em] border-b-2 transition-all duration-300 ${
                            selectedColor === color
                              ? 'text-[#2c3b6e] border-[#2c3b6e] font-medium'
                              : isAvailable
                              ? 'text-gray-600 border-transparent hover:text-[#2c3b6e] hover:border-gray-300'
                              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {color}
                        </motion.button>
                      );
                    }) || product.color?.map((color: string, index: number) => (
                      <motion.button
                        key={`color-${color}-${index}`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelect(color)}
                        className={`px-4 py-2.5 text-xs tracking-[0.1em] border-b-2 transition-all duration-300 ${
                          selectedColor === color
                            ? 'text-[#2c3b6e] border-[#2c3b6e] font-medium'
                            : 'text-gray-600 border-transparent hover:text-[#2c3b6e] hover:border-gray-300'
                        }`}
                      >
                        {color}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <label className="text-xs tracking-[0.1em] text-gray-700 uppercase block">
                  {t('product.quantity', language)}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-b-2 border-gray-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={decreaseQuantity}
                      className="p-2 text-gray-600 hover:text-[#2c3b6e] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={increaseQuantity}
                      className="p-2 text-gray-600 hover:text-[#2c3b6e] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Add to Cart Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <span>{t('product.adding', language)}</span>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                    <span>{t('product.addToCart', language)}</span>
                  </>
                )}
              </motion.button>

              {/* Additional Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex items-center gap-6 pt-4 border-t border-gray-200"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (!isAuthenticated) {
                      setNotification({ 
                        message: t('product.pleaseLoginForFavorites', language) || 'Please login to add to favorites', 
                        type: 'error' 
                      });
                      setTimeout(() => setNotification(null), 3000);
                      router.push('/login');
                      return;
                    }
                    
                    setIsFavoriteLoading(true);
                    try {
                      const token = localStorage.getItem('auth_token');
                      if (!token) {
                        router.push('/login');
                        return;
                      }
                      
                      if (isFavorite) {
                        await removeFavorite(product.id, token);
                        setIsFavorite(false);
                        setNotification({ 
                          message: t('product.removedFromFavorites', language) || 'Removed from favorites', 
                          type: 'success' 
                        });
                      } else {
                        await addFavorite(product.id, token);
                        setIsFavorite(true);
                        setNotification({ 
                          message: t('product.addedToFavorites', language) || 'Added to favorites', 
                          type: 'success' 
                        });
                      }
                      setTimeout(() => setNotification(null), 3000);
                    } catch (error) {
                      console.error('Error toggling favorite:', error);
                      setNotification({ 
                        message: t('product.favoriteError', language) || 'Error updating favorites', 
                        type: 'error' 
                      });
                      setTimeout(() => setNotification(null), 3000);
                    } finally {
                      setIsFavoriteLoading(false);
                    }
                  }}
                  disabled={isFavoriteLoading}
                  className={`flex items-center gap-2 text-xs tracking-wide transition-colors ${
                    isFavorite
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-gray-600 hover:text-[#2c3b6e]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? (t('product.removeFromFavorites', language) || 'Remove from favorites') : t('product.saveForLater', language)}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    const productUrl = `${window.location.origin}/product/${product.id}`;
                    const shareData = {
                      title: product.name,
                      text: product.description || product.name,
                      url: productUrl,
                    };
                    
                    try {
                      // Try Web Share API first (mobile)
                      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                        await navigator.share(shareData);
                        setNotification({ 
                          message: t('product.shared', language) || 'Shared successfully!', 
                          type: 'success' 
                        });
                      } else {
                        // Fallback: Copy to clipboard
                        await navigator.clipboard.writeText(productUrl);
                        setNotification({ 
                          message: t('product.linkCopied', language) || 'Link copied to clipboard!', 
                          type: 'success' 
                        });
                      }
                      setTimeout(() => setNotification(null), 3000);
                    } catch (error: any) {
                      // User cancelled or error occurred
                      if (error.name !== 'AbortError') {
                        // Try clipboard as fallback
                        try {
                          await navigator.clipboard.writeText(productUrl);
                          setNotification({ 
                            message: t('product.linkCopied', language) || 'Link copied to clipboard!', 
                            type: 'success' 
                          });
                          setTimeout(() => setNotification(null), 3000);
                        } catch (clipboardError) {
                          console.error('Error copying to clipboard:', clipboardError);
                        }
                      }
                    }
                  }}
                  className="flex items-center gap-2 text-xs tracking-wide text-gray-600 hover:text-[#2c3b6e] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t('product.share', language)}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Recommended Products */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mt-24 lg:mt-32"
          >
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e] mb-3 text-center">
                {t('product.recommended', language)}
              </h2>
              <p className="text-sm text-gray-600 tracking-wide text-center max-w-xl mx-auto">
                {t('product.recommendedSubtitle', language)}
              </p>
            </div>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {recommendedProducts.map((recommendedProduct, index) => (
                  <Link key={recommendedProduct.id} href={`/product/${recommendedProduct.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative bg-gray-100 mb-3 overflow-hidden aspect-[3/4]">
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={recommendedProduct.imageUrl}
                            alt={recommendedProduct.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                            loading="lazy"
                            quality={85}
                            unoptimized={false}
                        />
                        </motion.div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1">
                        {recommendedProduct.subCategory && (
                          <p className="text-[10px] text-gray-500 tracking-[0.1em] uppercase">
                            {recommendedProduct.subCategory}
                          </p>
                        )}
                        <h3 className="text-sm group-hover:text-gray-600 transition-colors tracking-wide line-clamp-2">
                          {recommendedProduct.name}
                        </h3>
                        <p className="text-black font-medium">{formatPrice(recommendedProduct.price)}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}

