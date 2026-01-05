import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function UrbanNewsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <section className="py-12 px-6 lg:px-12 bg-white">
      <div className="max-w-[1000px] mx-auto text-left lg:text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl lg:text-3xl md:text-4xl mb-2 lg:mb-3 tracking-tight">
            SUBSCRIBE TO OUR NEWSLETTER
          </h2>
          <p className="text-gray-600 mb-8 lg:mb-10 text-xs lg:text-sm tracking-wide lg:max-w-2xl lg:mx-auto">
            Get the latest updates on new collections, exclusive offers, and style inspiration
            delivered directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md lg:mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-4 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em]"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}