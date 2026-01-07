'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { fetchFAQItems, FAQItem } from '@/lib/api';

const faqCategories = [
  'All',
  'Orders',
  'Shipping',
  'Returns',
  'Products',
  'Account',
];

// Helper to get language code from localStorage or default to 'en'
function getLanguageCode(): string {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('selectedLanguage');
  if (stored) {
    try {
      const lang = JSON.parse(stored);
      const code = lang.code?.toLowerCase() || 'en';
      // Map UI language codes to API language codes
      const langMap: Record<string, string> = {
        'en': 'en',
        'ru': 'ru',
        'fr': 'en', // French not available, fallback to English
        'de': 'en', // German not available, fallback to English
      };
      return langMap[code] || 'en';
    } catch (e) {
      return 'en';
    }
  }
  return 'en';
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    const currentLang = getLanguageCode();
    setLang(currentLang);
    loadFAQData(currentLang);

    // Listen for language changes
    const handleLanguageChange = () => {
      const newLang = getLanguageCode();
      setLang((prevLang) => {
        if (newLang !== prevLang) {
          loadFAQData(newLang);
          return newLang;
        }
        return prevLang;
      });
    };

    // Check for language changes periodically (since navigation doesn't use context)
    const interval = setInterval(handleLanguageChange, 1000);
    
    // Also listen to storage events
    window.addEventListener('storage', handleLanguageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  const loadFAQData = async (language: string) => {
    try {
      setLoading(true);
      const items = await fetchFAQItems(language);
      setFaqItems(items);
    } catch (error) {
      console.error('Error loading FAQ data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = selectedCategory === 'All'
    ? faqItems
    : faqItems.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden w-full">
        <UrbanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c3b6e] mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pb-16 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Hero Section */}
          <div className="pt-16 pb-12 lg:pt-24 lg:pb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#2c3b6e]/10 flex items-center justify-center">
                <HelpCircle className="w-10 h-10 lg:w-12 lg:h-12 text-[#2c3b6e]" strokeWidth={1.5} />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2c3b6e] mb-6"
            >
              FREQUENTLY ASKED QUESTIONS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-gray-600 tracking-wide max-w-2xl mx-auto leading-relaxed"
            >
              Find answers to common questions about our products, orders, shipping, and more.
            </motion.p>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-12 lg:mb-16"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4">
              {faqCategories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 text-xs tracking-[0.1em] border-b-2 transition-all duration-300 ${
                    selectedCategory === category
                      ? 'text-[#2c3b6e] border-[#2c3b6e] font-medium'
                      : 'text-gray-600 border-transparent hover:text-[#2c3b6e] hover:border-gray-300'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-600">No FAQ items found in this category.</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => {
                const isOpen = openItems.includes(faq.id);
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-gray-200"
                  >
                    <motion.button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left py-6 flex items-center justify-between group"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] tracking-[0.1em] text-gray-500 uppercase">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-sm lg:text-base tracking-tight text-[#2c3b6e] group-hover:text-black transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#2c3b6e] transition-colors" strokeWidth={1.5} />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-0 lg:pl-4">
                            <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Contact CTA */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mt-24 lg:mt-32 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e]">
                Still Have Questions?
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Can't find the answer you're looking for? Please get in touch with our friendly team.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Link
                  href="/contact"
                  className="inline-block bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors text-sm tracking-[0.1em] uppercase"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </motion.section>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}

