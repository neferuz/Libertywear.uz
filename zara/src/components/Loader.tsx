'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Disable pointer events when loader is closed
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure animation completes
      const timer = setTimeout(() => {
        const loader = document.querySelector('[data-loader]') as HTMLElement;
        if (loader) {
          loader.style.pointerEvents = 'none';
        }
      }, 700); // Slightly longer than animation duration

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.95,
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          style={{ 
            pointerEvents: isLoading ? 'auto' : 'none',
          }}
          data-loader
        >
          {/* Liberty Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
            }}
            exit={{ 
              opacity: 0,
              scale: 0.8,
              filter: 'blur(10px)',
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-center"
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl tracking-[0.15em] text-[#2c3b6e] font-light"
              style={{
                fontFamily: 'serif',
                letterSpacing: '0.12em',
              }}
            >
              LIBERTY
            </motion.h1>
            
            {/* Decorative Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              exit={{ width: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="h-px bg-[#2c3b6e] mx-auto mt-3"
            />
          </motion.div>

          {/* Loading Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-20 flex items-center space-x-2"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-2 h-2 bg-[#2c3b6e] rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

