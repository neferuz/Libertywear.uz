import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  subtext: string;
}

interface ShopByCategoryProps {
  categories: Category[];
}

export function ShopByCategory({ categories }: ShopByCategoryProps) {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval: NodeJS.Timeout;
    let isPaused = false;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          if (currentScroll >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 400, behavior: 'smooth' });
          }
        }
      }, 4000);
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 420;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  // Calculate current index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = window.innerWidth >= 1024 ? 420 : 296; // Desktop: 380px + 40px gap, Mobile: 280px + 16px gap
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.max(0, Math.min(newIndex, categories.length - 1)));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories.length]);

  const goToSlide = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = window.innerWidth >= 1024 ? 420 : 296;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 text-left lg:text-center px-6"
        >
          <h2 className="text-xl lg:text-3xl md:text-4xl mb-2 lg:mb-3 tracking-tight uppercase">
            SHOP BY CATEGORY
          </h2>
          <p className="text-gray-600 text-xs lg:text-sm tracking-wide lg:max-w-xl lg:mx-auto">
            Explore our curated collections designed for every style and occasion
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 lg:px-12"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="flex-shrink-0 snap-start w-[280px] lg:w-[380px] cursor-pointer"
              >
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '6/7' }}>
                  {/* Image */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: hoveredCategory === category.id ? 1.05 : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Gradient Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    animate={{
                      opacity: hoveredCategory === category.id ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Hover Overlay Darkening */}
                  <motion.div
                    className="absolute inset-0 bg-black/0"
                    animate={{
                      backgroundColor:
                        hoveredCategory === category.id
                          ? 'rgba(0, 0, 0, 0.15)'
                          : 'rgba(0, 0, 0, 0)',
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <motion.div
                      className="text-center"
                      animate={{
                        y: hoveredCategory === category.id ? -10 : 0,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <h3
                        className="text-white text-3xl md:text-4xl mb-3 tracking-wide"
                        style={{
                          textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                        }}
                      >
                        {category.name}
                      </h3>

                      {/* Shop Now */}
                      <div className="flex items-center justify-center space-x-2 text-white/90">
                        <span className="text-sm tracking-wide">
                          {category.subtext}
                        </span>
                        <motion.div
                          animate={{
                            x: hoveredCategory === category.id ? 4 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Border Glow on Hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2c3b6e] to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{
                      opacity: hoveredCategory === category.id ? 1 : 0,
                      scaleX: hoveredCategory === category.id ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{
                      boxShadow:
                        hoveredCategory === category.id
                          ? '0 0 20px rgba(44, 59, 110, 0.6)'
                          : 'none',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            {Array.from({ length: categories.length }).map((_, index) => (
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
    </section>
  );
}