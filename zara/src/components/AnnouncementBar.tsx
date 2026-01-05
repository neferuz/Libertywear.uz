import { motion } from 'motion/react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#2c3b6e] text-white overflow-hidden">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex items-center whitespace-nowrap py-2"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center">
            <motion.span
              whileHover={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}
              className="text-xs tracking-wider px-8 cursor-default"
            >
              GET 50% OFF TODAY ONLY!
            </motion.span>
            <span className="text-white text-xs">★</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}