'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqCategories = [
  'All',
  'Orders',
  'Shipping',
  'Returns',
  'Products',
  'Account',
];

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'How do I place an order?',
    answer: 'You can place an order by browsing our products, selecting your desired items, and adding them to your cart. Once you\'re ready, proceed to checkout where you\'ll enter your shipping and payment information.',
    category: 'Orders',
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway.',
    category: 'Orders',
  },
  {
    id: 3,
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) and overnight shipping options are also available at checkout. International orders may take 10-14 business days.',
    category: 'Shipping',
  },
  {
    id: 4,
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination. You can view available shipping options and costs during checkout.',
    category: 'Shipping',
  },
  {
    id: 5,
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all unworn items with tags attached. Items must be in original condition. Returns are free for orders over $100. Please contact our customer service to initiate a return.',
    category: 'Returns',
  },
  {
    id: 6,
    question: 'How do I return an item?',
    answer: 'To return an item, log into your account, go to your order history, and select the item you wish to return. Follow the instructions to print a return label and send the item back to us. Once received, we\'ll process your refund within 5-7 business days.',
    category: 'Returns',
  },
  {
    id: 7,
    question: 'How do I know what size to order?',
    answer: 'We provide detailed size charts for each product category. You can find size guides on each product page. If you\'re unsure, our customer service team is happy to help you find the perfect fit.',
    category: 'Products',
  },
  {
    id: 8,
    question: 'Are your products authentic?',
    answer: 'Absolutely. All our products are 100% authentic and sourced directly from authorized distributors and brands. We guarantee the authenticity of every item we sell.',
    category: 'Products',
  },
  {
    id: 9,
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Sign In" button in the top navigation, then selecting "Create Account". Fill out the registration form with your details, and you\'ll be able to track orders, save favorites, and enjoy faster checkout.',
    category: 'Account',
  },
  {
    id: 10,
    question: 'How do I reset my password?',
    answer: 'If you\'ve forgotten your password, click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a link to reset your password. The link will be valid for 24 hours.',
    category: 'Account',
  },
  {
    id: 11,
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed. Please contact customer service immediately if you need to make changes.',
    category: 'Orders',
  },
  {
    id: 12,
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer premium gift wrapping services for an additional fee. You can select this option during checkout. We also include a personalized gift message with your order.',
    category: 'Orders',
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = selectedCategory === 'All'
    ? faqData
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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

