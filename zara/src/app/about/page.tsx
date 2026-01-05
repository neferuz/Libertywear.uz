'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, Users, Sparkles, Globe, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';

const values = [
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We source only the finest materials and work with skilled artisans to create products that stand the test of time.',
  },
  {
    icon: Heart,
    title: 'Passion for Fashion',
    description: 'Fashion is our passion. We curate collections that inspire confidence and express individuality.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We strive to provide exceptional service and memorable shopping experiences.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We embrace new trends and technologies while staying true to timeless elegance and sophistication.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting fashion lovers worldwide with premium products and exceptional service.',
  },
  {
    icon: TrendingUp,
    title: 'Sustainable Future',
    description: 'Committed to sustainable practices and ethical sourcing for a better tomorrow.',
  },
];


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pb-16 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Hero Section */}
          <div className="pt-16 pb-16 lg:pt-24 lg:pb-24 text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2c3b6e] mb-6"
            >
              ABOUT US
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-gray-600 tracking-wide max-w-2xl mx-auto leading-relaxed"
            >
              Welcome to Liberty, where luxury meets accessibility. We are dedicated to bringing you the finest fashion pieces that combine timeless elegance with contemporary style.
            </motion.p>
          </div>

          {/* Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-24 lg:mb-32"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e] mb-4">
                  Our Story
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Founded in 2010, Liberty emerged from a simple yet powerful vision: to make luxury fashion accessible to everyone. What started as a small boutique has grown into a global brand, but our core values remain unchanged.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We believe that fashion is more than just clothing—it's a form of self-expression, a way to tell your story without saying a word. Every piece in our collection is carefully curated to help you express your unique style and confidence.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Today, Liberty stands as a testament to quality, innovation, and customer dedication. We continue to push boundaries while staying true to our commitment to excellence and sustainability.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-square bg-gray-100 overflow-hidden rounded-sm"
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-24 lg:mb-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e] mb-4">
                Our Values
              </h2>
              <p className="text-sm text-gray-600 tracking-wide max-w-xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center space-y-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#2c3b6e]/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-[#2c3b6e]" strokeWidth={1.5} />
                      </div>
                    </motion.div>
                    <h3 className="text-lg tracking-tight text-[#2c3b6e] font-medium">
                      {value.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 lg:py-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e]">
                Join Our Journey
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Discover our collections and become part of the Liberty family. Experience luxury fashion that speaks to your unique style.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Link
                  href="/"
                  className="inline-block bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors text-sm tracking-[0.1em] uppercase"
                >
                  Explore Collections
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

