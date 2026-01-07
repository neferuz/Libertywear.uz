'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Heart, Users, Sparkles, Globe, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { fetchAboutSections, fetchTeamMembers, fetchAboutHero, AboutSection, TeamMember } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

// Values will be generated dynamically based on language
const getValues = (lang: string) => [
  {
    icon: Award,
    title: t('about.values.qualityExcellence.title', lang),
    description: t('about.values.qualityExcellence.description', lang),
  },
  {
    icon: Heart,
    title: t('about.values.passionForFashion.title', lang),
    description: t('about.values.passionForFashion.description', lang),
  },
  {
    icon: Users,
    title: t('about.values.customerFirst.title', lang),
    description: t('about.values.customerFirst.description', lang),
  },
  {
    icon: Sparkles,
    title: t('about.values.innovation.title', lang),
    description: t('about.values.innovation.description', lang),
  },
  {
    icon: Globe,
    title: t('about.values.globalReach.title', lang),
    description: t('about.values.globalReach.description', lang),
  },
  {
    icon: TrendingUp,
    title: t('about.values.sustainableFuture.title', lang),
    description: t('about.values.sustainableFuture.description', lang),
  },
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

export default function AboutPage() {
  const { language } = useLanguage();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [hero, setHero] = useState<{ title: string; description: string }>({
    title: 'ABOUT US',
    description: 'Welcome to Liberty, where luxury meets accessibility. We are dedicated to bringing you the finest fashion pieces that combine timeless elegance with contemporary style.',
  });
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    const currentLang = getLanguageCode();
    setLang(currentLang);
    loadData(currentLang);

    // Listen for language changes
    const handleLanguageChange = () => {
      const newLang = getLanguageCode();
      setLang((prevLang) => {
        if (newLang !== prevLang) {
          loadData(newLang);
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

  const loadData = async (language: string) => {
    try {
      setLoading(true);
      const [sectionsData, teamData, heroData] = await Promise.all([
        fetchAboutSections(language),
        fetchTeamMembers(language),
        fetchAboutHero(language),
      ]);
      setSections(sectionsData);
      setTeamMembers(teamData);
      setHero(heroData);
    } catch (error) {
      console.error('Error loading about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string): string => {
    if (!url) return 'https://via.placeholder.com/800x800';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) {
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://api.libertywear.uz';
      return `${baseUrl}${url}`;
    }
    return url;
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
          <div className="pt-16 pb-16 lg:pt-24 lg:pb-24 text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2c3b6e] mb-6"
            >
              {hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-gray-600 tracking-wide max-w-2xl mx-auto leading-relaxed"
            >
              {hero.description}
            </motion.p>
          </div>

          {/* About Sections from Admin */}
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-24 lg:mb-32"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${section.reverse ? 'lg:flex-row-reverse' : ''}`}>
                <motion.div
                  initial={{ opacity: 0, x: section.reverse ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                  className={`space-y-6 ${section.reverse ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e] mb-4">
                    {section.title}
                  </h2>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.description}
                  </div>
                </motion.div>
                {section.image && (
                  <motion.div
                    initial={{ opacity: 0, x: section.reverse ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className={`relative aspect-square bg-gray-100 overflow-hidden rounded-sm ${section.reverse ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <Image
                      src={getImageUrl(section.image)}
                      alt={section.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                    />
                  </motion.div>
                )}
              </div>
            </motion.section>
          ))}

          {/* Team Members Section */}
          {teamMembers.length > 0 && (
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
                  {t('about.ourTeam', lang)}
                </h2>
                <p className="text-sm text-gray-600 tracking-wide max-w-xl mx-auto">
                  {t('about.teamDescription', lang)}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center space-y-4"
                  >
                    {member.image && (
                      <div className="relative aspect-square w-full max-w-[300px] mx-auto bg-gray-100 overflow-hidden rounded-full mb-4">
                        <Image
                          src={getImageUrl(member.image)}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          loading="lazy"
                          quality={85}
                        />
                      </div>
                    )}
                    <h3 className="text-lg tracking-tight text-[#2c3b6e] font-medium">
                      {member.name}
                    </h3>
                    {member.position && (
                      <p className="text-sm text-gray-500">
                        {member.position}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                        {member.bio}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

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
                {t('about.ourValues', lang)}
              </h2>
              <p className="text-sm text-gray-600 tracking-wide max-w-xl mx-auto">
                {t('about.valuesDescription', lang)}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {getValues(lang).map((value, index) => {
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
                {t('about.joinJourney', lang)}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('about.joinDescription', lang)}
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
                  {t('about.exploreCollections', lang)}
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

