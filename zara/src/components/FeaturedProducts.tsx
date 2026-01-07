import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

// Format price with space as thousand separator and "сум" currency
const formatPrice = (price: number): string => {
  // Round to integer (no decimals for сум)
  const integerPrice = Math.round(price);
  
  // Add space as thousand separator
  const formattedPrice = integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${formattedPrice} сум`;
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { language } = useLanguage();

  // Mobile carousel - show 1.5 products per view
  const totalSlides = products.length;

  // Auto-play carousel (mobile only)
  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides, isDragging]);

  // Sync scroll position with currentIndex
  useEffect(() => {
    if (!carouselRef.current || isDragging) return;
    const cardWidth = 296; // 280px + 16px gap
    carouselRef.current.scrollTo({
      left: currentIndex * cardWidth,
      behavior: 'smooth',
    });
  }, [currentIndex, isDragging]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Mouse drag handlers for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    if (!isDragging || !carouselRef.current) return;
    setIsDragging(false);
    
    // Calculate which slide to snap to
    const cardWidth = 296; // 280px + 16px gap
    const scrollPosition = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollPosition / cardWidth);
    const clampedIndex = Math.max(0, Math.min(newIndex, totalSlides - 1));
    
    setCurrentIndex(clampedIndex);
    setIsAutoPlaying(true);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  return (
    <section className="py-12 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-left lg:text-center"
        >
          <h2 className="text-xl lg:text-3xl md:text-4xl mb-2 lg:mb-3 tracking-tight">{t('featuredProducts.title', language)}</h2>
          <p className="text-gray-600 text-xs lg:text-sm tracking-wide">
            {t('featuredProducts.description', language)}
          </p>
        </motion.div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {products.length > 0 ? products.map((product, index) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <div className="relative bg-gray-100 mb-2 overflow-hidden" style={{ aspectRatio: '5/6' }}>
                  <motion.div
                    animate={{
                      scale: hoveredProduct === product.id ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                      unoptimized={false}
                    />
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 tracking-[0.1em]">
                    {product.category}
                  </p>
                  <h3 className="text-sm group-hover:text-gray-600 transition-colors tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-black">{formatPrice(product.price)}</p>
                </div>
              </motion.div>
            </Link>
          )) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-500 text-sm">{t('common.noProducts', language)}</p>
            </div>
          )}
        </div>

        {/* Mobile: Carousel - Show 1.5 products */}
        <div className="lg:hidden relative w-full">
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-x-auto scrollbar-hide w-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              className="flex gap-3"
              style={{ 
                width: `${Math.max(products.length, 1) * 296}px`,
                scrollSnapType: 'x mandatory',
              }}
            >
              {products.length > 0 ? products.map((product, index) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="group cursor-pointer flex-shrink-0 w-[280px]"
                    onMouseEnter={() => {
                      setHoveredProduct(product.id);
                      setIsAutoPlaying(false);
                    }}
                    onMouseLeave={() => {
                      setHoveredProduct(null);
                      setIsAutoPlaying(true);
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative bg-gray-100 mb-2 overflow-hidden" style={{ aspectRatio: '6/7', height: 'auto' }}>
                      <motion.div
                        animate={{
                          scale: hoveredProduct === product.id ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 280px, 280px"
                          className="object-cover"
                          loading="lazy"
                          quality={85}
                          unoptimized={false}
                        />
                      </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 tracking-[0.1em]">
                        {product.category}
                      </p>
                      <h3 className="text-xs group-hover:text-gray-600 transition-colors tracking-wide line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium text-black">{formatPrice(product.price)}</p>
                    </div>
                  </motion.div>
                </Link>
              )) : (
                <div className="flex-shrink-0 w-[280px] text-center py-12">
                  <p className="text-gray-500 text-xs">{t('common.noProducts', language)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? 'w-8 h-0.5 bg-[#2c3b6e]'
                      : 'w-1.5 h-0.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}