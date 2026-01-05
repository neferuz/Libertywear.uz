'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Minus, Plus, X, ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useCart } from '@/context/CartContext';

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const product = allProducts.find((p) => p.id === Number(params.id));

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <UrbanNavigation />
        <div className="pt-24 pb-16 px-6 lg:px-12 text-center">
          <h1 className="text-2xl mb-4">Product not found</h1>
          <Link href="/" className="text-[#2c3b6e] hover:text-black">
            Go to homepage
          </Link>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  const images = product.images || [product.imageUrl];

  const handleAddToCart = () => {
    if (!selectedSize && product.size && product.size.length > 0) {
      setNotification({ message: 'Please select a size', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (!selectedColor && product.color && product.color.length > 0) {
      setNotification({ message: 'Please select a color', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsAddingToCart(true);
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
    });
    setTimeout(() => {
      setIsAddingToCart(false);
      setNotification({ message: 'Item added to cart', type: 'success' });
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
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
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
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
                  ${product.price}
                </span>
              </motion.div>

              {/* Description */}
              {product.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-gray-600 leading-relaxed max-w-lg"
                >
                  {product.description}
                </motion.p>
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
                      Size
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
                      Color
                    </label>
                    {selectedColor && (
                      <span className="text-xs text-gray-500">{selectedColor}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.color.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
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
                  Quantity
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
                  <span>Adding...</span>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                    <span>ADD TO CART</span>
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
                <button className="flex items-center gap-2 text-xs tracking-wide text-gray-600 hover:text-[#2c3b6e] transition-colors">
                  <Heart className="w-4 h-4" />
                  <span>Save for later</span>
                </button>
                <button className="flex items-center gap-2 text-xs tracking-wide text-gray-600 hover:text-[#2c3b6e] transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
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
                YOU MAY ALSO LIKE
              </h2>
              <p className="text-sm text-gray-600 tracking-wide text-center max-w-xl mx-auto">
                Discover more products from our collection
              </p>
            </div>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {allProducts
                .filter((p) => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
                .slice(0, 4)
                .map((recommendedProduct, index) => (
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
                        <motion.img
                          src={recommendedProduct.imageUrl}
                          alt={recommendedProduct.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
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
                        <p className="text-black font-medium">${recommendedProduct.price}</p>
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

