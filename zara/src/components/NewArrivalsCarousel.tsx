import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  colors: number;
}

interface NewArrivalsCarouselProps {
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

export function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-2 tracking-tight lowercase first-letter:uppercase">new arrivals</h2>
          <p className="text-gray-600 lowercase first-letter:uppercase">embark on new journeys with our latest collection</p>
        </motion.div>

        <div className="relative">
          {/* Scroll Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            style={{ marginLeft: '-20px' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            style={{ marginRight: '-20px' }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <div className="relative bg-gray-50 mb-4 overflow-hidden aspect-[3/4]">
                  <motion.div
                    animate={{
                      scale: hoveredProduct === product.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 280px, 320px"
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                      unoptimized={false}
                    />
                  </motion.div>

                  {/* Quick View Overlay */}
                  <AnimatePresence>
                    {hoveredProduct === product.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/20 flex items-center justify-center"
                      >
                        <motion.button
                          initial={{ scale: 0.8, opacity: 0, y: 10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0, y: 10 }}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="bg-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors lowercase"
                          style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                          <span className="text-sm tracking-wide">quick view</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="text-sm group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-900">{formatPrice(product.price)}</p>
                  <p className="text-xs text-gray-500">
                    {product.colors} {product.colors === 1 ? 'color' : 'colors'} available
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}