'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Send, MessageCircle, Video, Users, Image as ImageIcon, Camera, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { fetchSocialLinks, SocialLinkItem, fetchCategories, Category } from '@/lib/api';

// Map icon names to React icons (from react-icons/fi to lucide-react)
const getSocialIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'FiFacebook': Facebook,
    'FiInstagram': Instagram,
    'FiTwitter': Twitter,
    'FiYoutube': Youtube,
    'FiLinkedin': Linkedin,
    'FiSend': Send,
    'FiMessageCircle': MessageCircle,
    'FiVideo': Video,
    'FiUsers': Users,
    'FiImage': ImageIcon,
    'FiCamera': Camera,
    'FiLink': LinkIcon,
  };
  
  return iconMap[iconName] || LinkIcon;
};

export function UrbanFooter() {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    setCurrentLang(getLanguageCode());
    
    const handleLanguageChange = () => {
      setCurrentLang(getLanguageCode());
    };
    
    const interval = setInterval(handleLanguageChange, 500);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [language]);

  // Helper to get translated text from API translations
  const getTranslatedText = (translations: any, lang: string, fallback: string): string => {
    if (!translations) return fallback;
    if (typeof translations === 'string') {
      try {
        translations = JSON.parse(translations);
      } catch (e) {
        return fallback;
      }
    }
    if (translations[lang]) return translations[lang];
    if (translations['ru']) return translations['ru'];
    if (translations['en']) return translations['en'];
    return fallback;
  };

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const data = await fetchSocialLinks();
        setSocialLinks(data.links || []);
      } catch (error) {
        console.error('Error loading social links:', error);
        setSocialLinks([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadSocialLinks();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        // Map UI language to API language
        const langMap: Record<string, string> = {
          'en': 'en',
          'ru': 'ru',
          'uz': 'uz',
          'es': 'es',
        };
        const apiLang = langMap[currentLang] || 'en';
        const data = await fetchCategories(apiLang);
        setCategories(data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    if (currentLang) {
      loadCategories();
    }
  }, [language, currentLang]);

  // Get main categories (Women, Men, Kids) from API
  const getMainCategories = () => {
    const mainCategories: { name: string; href: string }[] = [];
    
    // Map known category slugs to their routes
    const slugMap: Record<string, string> = {
      'women': '/category/zhenschiny',
      'men': '/category/muzhchiny',
      'kids': '/category/deti',
      'zhenschiny': '/category/zhenschiny',
      'muzhchiny': '/category/muzhchiny',
      'deti': '/category/deti',
    };
    
    categories.forEach((category) => {
      const categoryName = getTranslatedText(category.title_translations, currentLang, category.title);
      const slug = category.slug;
      const href = slugMap[slug.toLowerCase()] || `/category/${slug}`;
      mainCategories.push({ name: categoryName, href });
    });
    
    // If no categories from API, use defaults
    if (mainCategories.length === 0) {
      return [
        { name: t('footer.women', currentLang), href: '/category/zhenschiny' },
        { name: t('footer.men', currentLang), href: '/category/muzhchiny' },
        { name: t('footer.kids', currentLang), href: '/category/deti' },
      ];
    }
    
    // Limit to first 6 categories to keep footer clean
    return mainCategories.slice(0, 6);
  };

  // Get popular subcategories from main categories
  const getPopularSubcategories = () => {
    const subcategories: { name: string; href: string }[] = [];
    
    categories.forEach((category) => {
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.slice(0, 3).forEach((sub) => {
          const subName = getTranslatedText(sub.title_translations, currentLang, sub.title);
          const subSlug = sub.slug || sub.title.toLowerCase().replace(/\s+/g, '-');
          subcategories.push({ name: subName, href: `/category/${subSlug}` });
        });
      }
    });
    
    return subcategories.slice(0, 6);
  };

  const popularSubcategories = getPopularSubcategories();
  
  // Combine shop and popular into one section if popular exists
  const shopLinks = getMainCategories();
  if (popularSubcategories.length > 0) {
    shopLinks.push(...popularSubcategories.slice(0, 3));
  }

  const footerSections = [
    {
      title: t('footer.shop', currentLang),
      links: shopLinks,
    },
    {
      title: t('footer.help', currentLang),
      links: [
        { name: t('footer.myAccount', currentLang), href: '/account' },
        { name: t('footer.faqs', currentLang), href: '/faq' },
        { name: t('footer.contactUs', currentLang), href: '/contact' },
      ],
    },
    {
      title: t('footer.about', currentLang),
      links: [
        { name: t('footer.aboutUs', currentLang), href: '/about' },
      ],
    },
  ];

  return (
    <footer className="bg-[#2c3b6e] text-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 mb-12">
          {/* Logo and Description */}
          <div>
            <h3 className="text-xl tracking-[0.15em] mb-4">LIBERTY</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {currentLang === 'en' && 'Premium fashion for the modern lifestyle. Quality clothing and accessories that define your style.'}
              {currentLang === 'ru' && 'Премиальная мода для современного образа жизни. Качественная одежда и аксессуары, которые определяют ваш стиль.'}
              {currentLang === 'uz' && 'Zamonaviy turmush tarzi uchun premium moda. Sizning uslubingizni belgilaydigan sifatli kiyim va aksessuarlar.'}
              {currentLang === 'es' && 'Moda premium para el estilo de vida moderno. Ropa y accesorios de calidad que definen tu estilo.'}
            </p>
            {/* Social Icons */}
            {!loading && socialLinks.length > 0 && (
              <div className="flex items-center space-x-4 flex-wrap">
                {socialLinks.map((link, index) => {
                  // Use icon from API if available, otherwise try to determine from name/url
                  let iconName = link.icon;
                  if (!iconName && link.name) {
                    const lowerName = link.name.toLowerCase();
                    const lowerUrl = link.url?.toLowerCase() || '';
                    if (lowerName.includes('instagram') || lowerUrl.includes('instagram')) iconName = 'FiInstagram';
                    else if (lowerName.includes('facebook') || lowerUrl.includes('facebook')) iconName = 'FiFacebook';
                    else if (lowerName.includes('twitter') || lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) iconName = 'FiTwitter';
                    else if (lowerName.includes('youtube') || lowerUrl.includes('youtube')) iconName = 'FiYoutube';
                    else if (lowerName.includes('telegram') || lowerUrl.includes('telegram')) iconName = 'FiSend';
                    else if (lowerName.includes('linkedin') || lowerUrl.includes('linkedin')) iconName = 'FiLinkedin';
                    else iconName = 'FiLink';
                  }
                  
                  const IconComponent = getSocialIcon(iconName || 'FiLink');
                  
                  // Handle custom icons
                  if (link.iconType === 'custom' && link.iconUrl) {
                    return (
                <motion.a
                  key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                        <img src={link.iconUrl} alt={link.name} className="w-5 h-5" />
                      </motion.a>
                    );
                  }
                  
                  return (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/60 hover:text-white transition-colors"
                      title={link.name}
                    >
                      <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                </motion.a>
                  );
                })}
            </div>
            )}
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="min-w-0">
              <h4 className="text-xs tracking-[0.15em] mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                      href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors block"
                      >
                        <motion.span
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                        {link.name}
                        </motion.span>
                      </Link>
                    </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-white/40 tracking-wide space-y-2">
          <p>{t('footer.copyright', currentLang)}</p>
          <p>
            {t('footer.poweredBy', currentLang)}{' '}
            <a 
              href="https://pro-ai.uz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors font-medium"
            >
              {t('footer.proAiAgency', currentLang)}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
