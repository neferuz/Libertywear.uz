import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function OurPartners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Partner logos - using placeholder images for fashion brands
  const partners = [
    { id: 1, name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop' },
    { id: 2, name: 'Adidas', logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=200&fit=crop' },
    { id: 3, name: 'Gucci', logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=200&fit=crop' },
    { id: 4, name: "Levi's", logo: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=200&fit=crop' },
    { id: 5, name: 'Zara', logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=200&fit=crop' },
    { id: 6, name: 'H&M', logo: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=400&h=200&fit=crop' },
    { id: 7, name: 'Puma', logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=200&fit=crop' },
    { id: 8, name: 'Calvin Klein', logo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=200&fit=crop' },
    { id: 9, name: 'Tommy Hilfiger', logo: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=200&fit=crop' },
    { id: 10, name: 'Ralph Lauren', logo: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=200&fit=crop' },
  ];

  // Duplicate partners for infinite scroll effect
  const extendedPartners = [...partners, ...partners, ...partners];

  // Auto-scroll effect
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          // Reset to beginning seamlessly when reaching the end
          if (next >= partners.length) {
            return 0;
          }
          return next;
        });
      }, 4000); // Slower auto-scroll every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered, partners.length]);

  const paginate = (direction: number) => {
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return partners.length - 1;
      if (next >= partners.length) return 0;
      return next;
    });
  };

  return (
    <section className="py-12 px-6 lg:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-left lg:text-center mb-8 lg:mb-16"
        >
          <h2 className="text-xl lg:text-3xl md:text-4xl mb-2 lg:mb-4 tracking-tight uppercase">OUR PARTNERS</h2>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Logos Grid with smooth scroll */}
          <div className="overflow-hidden">
            <motion.div
              animate={{
                x: `calc(-${currentIndex * 25}%)`,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex gap-6"
            >
              {extendedPartners.map((partner, index) => (
                <motion.div
                  key={`${partner.id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: (index % partners.length) * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onMouseEnter={() => setHoveredLogo(index)}
                  onMouseLeave={() => setHoveredLogo(null)}
                  className="flex-shrink-0"
                  style={{ width: 'calc(25% - 18px)' }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                    className="rounded-xl p-3 flex items-center justify-center h-24 cursor-pointer relative overflow-hidden"
                  >
                    {/* Logo Image with grayscale filter */}
                    <motion.img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-2/3 h-2/3 object-contain transition-all duration-500"
                      style={{
                        filter: hoveredLogo === index ? 'grayscale(0%)' : 'grayscale(100%)',
                        opacity: hoveredLogo === index ? 0.9 : 0.4,
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => paginate(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-[#2c3b6e] p-3 rounded-full transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => paginate(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-[#2c3b6e] p-3 rounded-full transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          {partners.slice(0, 8).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all duration-300 rounded-full ${
                Math.floor(currentIndex) === index
                  ? 'w-8 h-0.5 bg-[#2c3b6e]'
                  : 'w-1.5 h-0.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}