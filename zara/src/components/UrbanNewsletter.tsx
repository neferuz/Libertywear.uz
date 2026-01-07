'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

export function UrbanNewsletter() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use language directly from context
  const currentLang = language || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call (just for UX)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Save to localStorage (optional, for demo)
    const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
    if (!subscriptions.includes(email.toLowerCase())) {
      subscriptions.push(email.toLowerCase());
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
    }
    
    setEmail('');
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <>
      <section className="py-12 px-6 lg:px-12 bg-white">
        <div className="max-w-[1000px] mx-auto text-left lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl lg:text-3xl md:text-4xl mb-2 lg:mb-3 tracking-tight">
              {t('newsletter.title', currentLang)}
            </h2>
            <p className="text-gray-600 mb-8 lg:mb-10 text-xs lg:text-sm tracking-wide lg:max-w-2xl lg:mx-auto">
              {t('newsletter.description', currentLang)}
            </p>

            <form onSubmit={handleSubmit} className="max-w-md lg:mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder', currentLang)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-4 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? t('newsletter.subscribing', currentLang) || 'Subscribing...' : t('newsletter.button', currentLang)}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Success Alert */}
      <AnimatePresence>
        {showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-2xl rounded-xl border border-gray-100 p-6 max-w-md w-[90%]"
            >
            <div className="flex items-start space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={2} />
                </div>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#2c3b6e] mb-1">
                  {t('newsletter.success', currentLang)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('newsletter.successMessage', currentLang)}
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
