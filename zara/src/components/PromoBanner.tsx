'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { fetchPromoBannerData, PromoBannerData } from '@/lib/api';
import { getLanguageCode } from '@/lib/translations';

export function PromoBanner() {
  const { language } = useLanguage();
  const [data, setData] = useState<PromoBannerData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadData = async () => {
      const currentLang = language || getLanguageCode();
      const promoData = await fetchPromoBannerData(currentLang);
      setData(promoData);
    };
    loadData();
  }, [language]);

  // Don't render if not active or data not loaded
  if (!isClient || !data || !data.is_active) {
    return null;
  }

  const currentLang = (language || getLanguageCode()) as 'ru' | 'uz' | 'en' | 'es';
  const tag = data.tag_translations[currentLang] || data.tag_translations.en;
  const title = data.title_translations[currentLang] || data.title_translations.en;
  const subtitle = data.subtitle_translations[currentLang] || data.subtitle_translations.en;
  const description = data.description_translations[currentLang] || data.description_translations.en;
  const buttonText = data.button_text_translations[currentLang] || data.button_text_translations.en;

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
              <span className="text-xs tracking-[0.15em]">{tag}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight leading-tight"
            >
              {title}
              <br />
              {subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/80 mb-8 text-base leading-relaxed max-w-md"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.a
                href={data.button_link || '#sale'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 hover:bg-gray-100 transition-colors text-sm tracking-[0.1em]"
              >
                <span>{buttonText}</span>
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
            <Image
              src={data.image_url}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}