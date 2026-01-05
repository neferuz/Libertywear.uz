import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function PromoBanner() {
  return (
    <section className="py-20 px-6 lg:px-12 bg-[#2c3b6e]">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-[#2c3b6e] text-white p-12 lg:p-16 flex flex-col justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block border border-white/30 px-4 py-1.5 mb-6 self-start"
            >
              <span className="text-xs tracking-[0.15em]">LIMITED TIME OFFER</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight leading-tight"
            >
              WINTER SALE
              <br />
              UP TO 70% OFF
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/80 mb-8 text-base leading-relaxed max-w-md"
            >
              Don't miss out on our biggest sale of the season. Premium quality clothing and
              accessories at unbeatable prices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.a
                href="#sale"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 hover:bg-gray-100 transition-colors text-sm tracking-[0.1em]"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="relative min-h-[400px] lg:min-h-0"
          >
            <img
              src="https://images.unsplash.com/photo-1614714053570-6c6b6aa54a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2xvdGhpbmclMjBjYW1wYWlnbiUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzY3MTMxOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Winter Sale"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}