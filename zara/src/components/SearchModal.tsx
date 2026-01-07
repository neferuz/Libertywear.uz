'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { fetchProducts, fetchCategories, Product } from '@/lib/api';
import { getLanguageCode } from '@/lib/translations';
import Image from 'next/image';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}


// Helper function to get product image URL
const getProductImageUrl = (product: Product): string => {
  if (product.imageUrl) return product.imageUrl;
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    if (firstVariant.images && firstVariant.images.length > 0) {
      return firstVariant.images[0].image_url;
    }
    if (firstVariant.color_image) return firstVariant.color_image;
  }
  return 'https://via.placeholder.com/400x600';
};

export function SearchModal({
  isOpen,
  onClose,
}: SearchModalProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [quickCategories, setQuickCategories] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allProductsCache, setAllProductsCache] = useState<Product[]>([]);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        try {
          const searches = JSON.parse(saved);
          setRecentSearches(Array.isArray(searches) ? searches : []);
        } catch (e) {
          setRecentSearches([]);
        }
      }
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (!query.trim()) return;
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      let searches: string[] = [];
      
      if (saved) {
        try {
          searches = JSON.parse(saved);
        } catch (e) {
          searches = [];
        }
      }
      
      // Remove duplicate if exists
      searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
      // Add to beginning
      searches.unshift(query);
      // Keep only last 5 searches
      searches = searches.slice(0, 5);
      
      localStorage.setItem('recentSearches', JSON.stringify(searches));
      setRecentSearches(searches);
    }
  };

  // Preload products cache when modal opens or language changes
  useEffect(() => {
    if (isOpen) {
      const loadProductsCache = async () => {
        try {
          setIsCacheLoaded(false); // Reset cache when language changes
          const currentLang = getLanguageCode();
          const results = await fetchProducts({
            limit: 100, // Load more products for better search coverage
            lang: currentLang,
          });
          setAllProductsCache(results.products);
          setIsCacheLoaded(true);
        } catch (error) {
          console.error('Error loading products cache:', error);
        }
      };
      loadProductsCache();
    }
  }, [isOpen, language]); // Reload cache when language changes

  // Load quick categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const currentLang = getLanguageCode();
        const categories = await fetchCategories(currentLang);
        // Get main categories (WOMEN, MEN, KIDS) and SALE if available
        const mainCategories = categories
          .filter((cat: any) => !cat.parent_id)
          .slice(0, 4)
          .map((cat: any) => {
            // Get translated name
            let name = cat.title;
            if (cat.title_translations) {
              const translations = typeof cat.title_translations === 'string' 
                ? JSON.parse(cat.title_translations)
                : cat.title_translations;
              name = translations[currentLang] || translations['ru'] || translations['en'] || cat.title;
            }
            return {
              id: cat.id,
              name: name.toUpperCase(),
              slug: cat.slug,
            };
          });
        setQuickCategories(mainCategories);
      } catch (error) {
        console.error('Error loading categories for search:', error);
        // Fallback to default categories
        setQuickCategories([
          { id: 1, name: 'WOMEN', slug: 'women' },
          { id: 2, name: 'MEN', slug: 'men' },
          { id: 3, name: 'KIDS', slug: 'kids' },
          { id: 4, name: 'SALE', slug: 'sale' },
        ]);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, language]);

  // Блокируем скролл body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Search products from cache (much faster)
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchProducts = () => {
        setIsSearching(true);
        
        // Use cached products if available, otherwise fetch
        const searchInProducts = (products: Product[]) => {
          const query = searchQuery.toLowerCase().trim();
          const filtered = products.filter((product: Product) => {
            const name = product.name?.toLowerCase() || '';
            const description = product.description?.toLowerCase() || '';
            return name.includes(query) || description.includes(query);
          });
          return filtered.slice(0, 5);
        };

        if (isCacheLoaded && allProductsCache.length > 0) {
          // Use cache - instant results
          const filtered = searchInProducts(allProductsCache);
          setSearchResults(filtered);
          setIsSearching(false);
        } else {
          // Fallback to API if cache not ready
          const fetchAndSearch = async () => {
            try {
              const currentLang = getLanguageCode();
              const results = await fetchProducts({
                limit: 100,
                lang: currentLang,
              });
              const filtered = searchInProducts(results.products);
              setSearchResults(filtered);
              // Update cache for next time
              setAllProductsCache(results.products);
              setIsCacheLoaded(true);
            } catch (error) {
              console.error('Error searching products:', error);
              setSearchResults([]);
            } finally {
              setIsSearching(false);
            }
          };
          fetchAndSearch();
        }
      };

      // Reduced debounce from 300ms to 100ms for faster response
      const timeoutId = setTimeout(searchProducts, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, isCacheLoaded, allProductsCache, language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery.trim());
      // Search will be handled by useEffect that watches searchQuery
    }
  };

  const handleSearchClick = (query: string) => {
    setSearchQuery(query);
    saveSearchToHistory(query);
    // Search will be handled by useEffect that watches searchQuery
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Wrapper - для центрирования */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none lg:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="w-full h-full lg:w-[600px] lg:h-auto lg:max-h-[80vh] bg-white shadow-2xl overflow-hidden flex flex-col rounded-none lg:rounded-[40px] border-0 lg:border border-gray-100 pointer-events-auto"
        >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="bg-[#2c3b6e] p-2 rounded">
                    <Search className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg tracking-tight font-medium">{t('search.title', language)}</h3>
                    <p className="text-xs text-gray-500 tracking-wide">
                      {t('search.subtitle', language)}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Search Input */}
              <div className="p-6 border-b border-gray-200">
                <form onSubmit={handleSearch} className="relative">
                  <motion.div
                    animate={{
                      borderColor: isFocused ? '#2c3b6e' : '#d1d5db',
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center border-2 rounded-[20px] overflow-hidden bg-gray-50 focus-within:bg-white transition-colors"
                  >
                    <Search className="w-5 h-5 text-gray-400 ml-4" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={t('search.placeholder', language)}
                      className="flex-1 px-4 py-4 bg-transparent border-0 focus:outline-none text-sm tracking-wide placeholder:text-gray-400"
                      autoFocus
                    />
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchQuery('')}
                        className="mr-2 text-gray-400 hover:text-black transition-colors"
                      >
                        <X className="w-4 h-4" strokeWidth={2} />
                      </motion.button>
                    )}
                  </motion.div>
                </form>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {searchQuery ? (
                  // Search Results
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                  >
                    <p className="text-sm text-gray-500 mb-4 tracking-wide">
                      {t('search.searchResults', language)} "{searchQuery}"
                    </p>
                    {isSearching ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">{t('common.loading', language)}</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-3">
                        {searchResults.map((product) => {
                          const imageUrl = getProductImageUrl(product);
                          return (
                            <motion.a
                              key={product.id}
                              href={`/product/${product.id}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={onClose}
                              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                              <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={imageUrl}
                                  alt={product.name || 'Product'}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                  loading="lazy"
                                  quality={85}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium tracking-wide mb-1 group-hover:text-[#2c3b6e] transition-colors truncate">
                                  {product.name || 'Unnamed Product'}
                                </h4>
                                <p className="text-xs text-gray-500">Product</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2c3b6e] transition-colors flex-shrink-0" />
                            </motion.a>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">{t('search.noResults', language)}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  // Default View - Recent Searches (from localStorage)
                  <div className="p-6">
                    {/* Recent Searches - Only show if there are saved searches */}
                    {recentSearches.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                      >
                        <div className="flex items-center space-x-2 mb-4">
                          <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                          <h4 className="text-xs text-gray-500 tracking-[0.1em] uppercase">
                            {t('search.recentSearches', language)}
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((search, index) => (
                            <motion.button
                              key={`${search}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                              whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
                              onClick={() => handleSearchClick(search)}
                              className="w-full text-left px-4 py-3 text-sm tracking-wide text-gray-700 hover:text-black rounded-lg transition-colors flex items-center justify-between group"
                            >
                              <span>{search}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Quick Categories */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <h4 className="text-xs text-gray-500 tracking-[0.1em] uppercase mb-4">
                        {t('search.quickCategories', language)}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {quickCategories.map((category, index) => (
                          <motion.a
                            key={category.id}
                            href={category.slug ? `/category/${category.slug}` : '#'}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            whileHover={{ scale: 1.02, backgroundColor: '#2c3b6e' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="px-4 py-3 text-sm tracking-[0.1em] border border-gray-200 rounded-lg hover:text-white hover:border-[#2c3b6e] transition-all text-gray-700 font-medium text-center"
                          >
                            {category.name}
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="border-t border-gray-200 p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 tracking-wide">
                    {t('search.pressEnter', language)} <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 mx-1">Enter</kbd> {t('search.toSearch', language)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">Esc</kbd>
                    <span className="text-xs text-gray-400">{t('search.escToClose', language)}</span>
                  </div>
                </div>
              </motion.div>
        </motion.div>
      </div>
    </>
  );
}
