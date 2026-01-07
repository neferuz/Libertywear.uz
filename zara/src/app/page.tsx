'use client';

import { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanHeroCarousel } from '@/components/UrbanHeroCarousel';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ShopByCategory } from '@/components/ShopByCategory';
import { PromoBanner } from '@/components/PromoBanner';
import { UrbanNewsletter } from '@/components/UrbanNewsletter';
import { OurPartners } from '@/components/OurPartners';
import { UrbanFooter } from '@/components/UrbanFooter';
import { ChatWidget } from '@/components/ChatWidget';
import { Loader } from '@/components/Loader';
import { fetchProducts, fetchCategories, fetchSliderSlides, Product as APIProduct, Category as APICategory, SliderSlide } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { getLanguageCode, t } from '@/lib/translations';

// Helper function to get translated text from API translations
const getTranslatedText = (translations: any, lang: string, fallback: string): string => {
  if (!translations) return fallback;
  
  if (typeof translations === 'string') {
    try {
      const parsed = JSON.parse(translations);
      return parsed[lang] || parsed['en'] || fallback;
    } catch {
      return fallback;
    }
  }
  
  if (typeof translations === 'object') {
    return translations[lang] || translations['en'] || fallback;
  }
  
  return fallback;
};

export default function Home() {
  // Hero carousel slides
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<APIProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const currentLang = getLanguageCode();
        console.log('🔄 Загрузка данных для языка:', currentLang);
        
        // Fetch categories, products, and slider slides in parallel
        const [categoriesData, productsData, sliderSlides] = await Promise.all([
          fetchCategories(currentLang),
          fetchProducts({ limit: 8, lang: currentLang }),
          fetchSliderSlides(true), // Only active slides
        ]);

        // Transform categories for ShopByCategory component
        const transformedCategories = categoriesData
          .filter((cat: APICategory) => cat.gender) // Only show main categories (Women, Men, Kids)
          .map((cat: APICategory) => {
            const title = getTranslatedText(cat.title_translations, currentLang, cat.title || '');
            // Get full image URL from API - field is 'image' not 'image_url'
            let imageUrl = (cat as any).image || 'https://via.placeholder.com/400x600';
            // If image is relative, make it absolute
            if (imageUrl && !imageUrl.startsWith('http')) {
              const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
              // If image starts with /uploads, it's already a path
              if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('/api/uploads')) {
                imageUrl = `${API_BASE}${imageUrl}`;
              } else {
                imageUrl = `${API_BASE}/uploads/${imageUrl}`;
              }
            }
            
            return {
              id: cat.id,
              name: title.toUpperCase(),
              imageUrl: imageUrl,
              subtext: t('shopByCategory.subtext', currentLang),
              slug: cat.slug || cat.title?.toLowerCase().replace(/\s+/g, '-'),
            };
          });
        setCategories(transformedCategories);

        // Helper function to get product image URL from API product
        const getProductImageUrl = (product: any): string => {
          if (!product) return 'https://via.placeholder.com/400x600';
          
          // Try to get image from first variant
          if (product.variants && product.variants.length > 0) {
            const firstVariant = product.variants[0];
            if (firstVariant.images && firstVariant.images.length > 0) {
              return firstVariant.images[0].image_url;
            }
            if (firstVariant.color_image) {
              return firstVariant.color_image;
            }
          }
          
          // Fallback to imageUrl if exists
          if (product.imageUrl) {
            return product.imageUrl;
          }
          
          return 'https://via.placeholder.com/400x600';
        };

        // Transform products to add imageUrl
        const transformedProducts = (productsData.products || []).map((product: any) => ({
          ...product,
          imageUrl: getProductImageUrl(product),
          category: product.category || 'UNISEX',
        }));
        setFeaturedProducts(transformedProducts);

        // Transform slider slides from API
        console.log('📥 Получены слайды из API:', sliderSlides);
        const transformedSlides = sliderSlides.map((slide: SliderSlide) => {
          // Helper to get translated text
          const getTranslated = (translations: Record<string, string> | string | undefined, fallback: string): string => {
            if (!translations) {
              console.log(`⚠️ Нет переводов для поля, используется fallback: ${fallback}`);
              return fallback;
            }
            if (typeof translations === 'string') {
              try {
                const parsed = JSON.parse(translations);
                const result = parsed[currentLang] || parsed['en'] || parsed['ru'] || fallback;
                console.log(`📝 Перевод из строки (${currentLang}):`, result);
                return result;
              } catch {
                return fallback;
              }
            }
            if (typeof translations === 'object') {
              const result = translations[currentLang] || translations['en'] || translations['ru'] || fallback;
              console.log(`📝 Перевод из объекта (${currentLang}):`, result, 'Доступные языки:', Object.keys(translations));
              return result;
            }
            return fallback;
          };

          // Get image URL - use mobile on mobile, desktop on desktop
          let imageUrl = slide.image_url_desktop;
          if (typeof window !== 'undefined' && window.innerWidth < 768 && slide.image_url_mobile) {
            imageUrl = slide.image_url_mobile;
          }
          
          // If image is relative, make it absolute
          if (imageUrl && !imageUrl.startsWith('http')) {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('/api/uploads')) {
              imageUrl = `${API_BASE}${imageUrl}`;
            } else {
              imageUrl = `${API_BASE}/uploads/${imageUrl}`;
            }
          }

          // Process mobile image URL
          let imageUrlMobile = slide.image_url_mobile;
          if (imageUrlMobile && !imageUrlMobile.startsWith('http')) {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            if (imageUrlMobile.startsWith('/uploads') || imageUrlMobile.startsWith('/api/uploads')) {
              imageUrlMobile = `${API_BASE}${imageUrlMobile}`;
            } else {
              imageUrlMobile = `${API_BASE}/uploads/${imageUrlMobile}`;
            }
          }

          // Get title from translations or legacy title field
          const slideTitle = getTranslated(slide.title_translations, slide.title || 'NEW COLLECTION');
          
          return {
            id: slide.id,
            imageUrl: imageUrl,
            imageUrlMobile: imageUrlMobile || imageUrl, // Use desktop as fallback
            alt_text: slide.alt_text || slideTitle,
            tag: getTranslated(slide.tag_translations, 'NEW COLLECTION'),
            headline: getTranslated(slide.headline_translations, slideTitle),
            description: getTranslated(slide.description_translations, 'Discover our collection'),
            ctaText: getTranslated(slide.cta_text_translations, 'SHOP NOW'),
            ctaLink: slide.cta_link || slide.link || '/',
          };
        });

        // If no slider slides from API, use categories as fallback
        if (transformedSlides.length === 0) {
          const categorySlides = categoriesData
            .filter((cat: APICategory) => cat.gender)
            .slice(0, 3)
            .map((cat, index) => {
              const title = getTranslatedText(cat.title_translations, currentLang, cat.title || '');
              const description = getTranslatedText(cat.description_translations, currentLang, cat.description || 'Explore our collection');
              let imageUrl = (cat as any).image || `https://images.unsplash.com/photo-${1440000000000 + index}?w=1920&h=1080&fit=crop`;
              if (imageUrl && !imageUrl.startsWith('http')) {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                if (imageUrl.startsWith('/uploads') || imageUrl.startsWith('/api/uploads')) {
                  imageUrl = `${API_BASE}${imageUrl}`;
                } else {
                  imageUrl = `${API_BASE}/uploads/${imageUrl}`;
                }
              }
              
              return {
                id: cat.id,
                imageUrl: imageUrl,
                tag: title.toUpperCase(),
                headline: title.toUpperCase(),
                description: description,
                ctaText: 'SHOP NOW',
                ctaLink: `/category/${cat.slug}`,
              };
            });

          if (categorySlides.length === 0) {
            // Ultimate fallback - default slides
            setHeroSlides([
              {
                id: 1,
                imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
                tag: 'NEW COLLECTION',
                headline: 'NEW COLLECTION',
                description: 'Discover the latest trends',
                ctaText: 'SHOP NOW',
                ctaLink: '/category/women',
              },
              {
                id: 2,
                imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop',
                tag: 'SUMMER SALE',
                headline: 'SUMMER SALE',
                description: 'Up to 50% off',
                ctaText: 'SHOP NOW',
                ctaLink: '/category/men',
              },
              {
                id: 3,
                imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop',
                tag: 'PREMIUM QUALITY',
                headline: 'PREMIUM QUALITY',
                description: 'Luxury fashion for everyone',
                ctaText: 'SHOP NOW',
                ctaLink: '/category/kids',
              },
            ]);
          } else {
            setHeroSlides(categorySlides);
          }
        } else {
          setHeroSlides(transformedSlides);
        }
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language, t]); // Добавлен t в зависимости для перезагрузки при изменении языка

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <UrbanNavigation />
      <UrbanHeroCarousel slides={heroSlides} />
      <FeaturedProducts products={featuredProducts} />
      <ShopByCategory categories={categories} />
      <PromoBanner />
      <UrbanNewsletter />
      <OurPartners />
      <UrbanFooter />
      <ChatWidget />
    </div>
  );
}
