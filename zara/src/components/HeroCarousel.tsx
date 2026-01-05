import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  imageUrl: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  autoSlideInterval?: number;
}

export function HeroCarousel({ slides, autoSlideInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return slides.length - 1;
      if (nextIndex >= slides.length) return 0;
      return nextIndex;
    });
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      paginate(1);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, autoSlideInterval, paginate]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 200, damping: 35 },
            opacity: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
            scale: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Parallax */}
          <div className="relative w-full h-full">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 10, ease: 'linear' }}
              className="w-full h-full"
            >
              <img
                src={slides[currentIndex].imageUrl}
                alt={slides[currentIndex].headline}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="max-w-4xl text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight capitalize"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {slides[currentIndex].headline}
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto lowercase first-letter:uppercase"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {slides[currentIndex].subtext}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <motion.a
                      href={slides[currentIndex].ctaLink}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="inline-block bg-white text-black px-12 py-4 tracking-wide text-sm hover:bg-gray-100 transition-colors capitalize"
                    >
                      {slides[currentIndex].ctaText}
                      <motion.span
                        className="inline-block ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                      >
                        →
                      </motion.span>
                    </motion.a>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-8 lg:px-16 pointer-events-none z-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.9, x: 0 }}
          whileHover={{ scale: 1.2, x: -10, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => paginate(-1)}
          className="pointer-events-auto bg-white/30 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/50 transition-all group"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}
        >
          <ChevronLeft className="w-7 h-7" strokeWidth={2} />
          <motion.span 
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
            style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)' }}
          />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.9, x: 0 }}
          whileHover={{ scale: 1.2, x: 10, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => paginate(1)}
          className="pointer-events-auto bg-white/30 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/50 transition-all group"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}
        >
          <ChevronRight className="w-7 h-7" strokeWidth={2} />
          <motion.span 
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
            style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)' }}
          />
        </motion.button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="group relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/50"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: autoSlideInterval / 1000, ease: 'linear' }}
          key={currentIndex}
        />
      )}
    </div>
  );
}