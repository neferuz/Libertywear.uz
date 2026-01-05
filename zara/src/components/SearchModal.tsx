'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Пример популярных поисковых запросов
const popularSearches = [
  'Premium T-Shirts',
  'Designer Jeans',
  'Luxury Handbags',
  'Winter Collection',
  'Summer Essentials',
];

// Пример недавних поисков
const recentSearches = [
  'Leather Jackets',
  'Sneakers',
  'Watches',
];

export function SearchModal({
  isOpen,
  onClose,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Здесь будет логика поиска
    }
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
                    <h3 className="text-lg tracking-tight font-medium">Search Products</h3>
                    <p className="text-xs text-gray-500 tracking-wide">
                      Find your perfect style
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
                      placeholder="Search for products, brands, categories..."
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
                      Search results for "{searchQuery}"
                    </p>
                    <div className="space-y-3">
                      {/* Placeholder для результатов поиска */}
                      {[1, 2, 3].map((item) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: item * 0.05 }}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium tracking-wide mb-1 group-hover:text-[#2c3b6e] transition-colors">
                              Product Name {item}
                            </h4>
                            <p className="text-xs text-gray-500">Category • ${(50 + item * 10).toFixed(2)}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#2c3b6e] transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  // Default View - Popular & Recent Searches
                  <div className="p-6">
                    {/* Recent Searches */}
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
                            Recent Searches
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((search, index) => (
                            <motion.button
                              key={search}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                              whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
                              onClick={() => setSearchQuery(search)}
                              className="w-full text-left px-4 py-3 text-sm tracking-wide text-gray-700 hover:text-black rounded-lg transition-colors flex items-center justify-between group"
                            >
                              <span>{search}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Popular Searches */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center space-x-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                        <h4 className="text-xs text-gray-500 tracking-[0.1em] uppercase">
                          Popular Searches
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {popularSearches.map((search, index) => (
                          <motion.button
                            key={search}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            whileHover={{ x: 4, backgroundColor: '#f9fafb' }}
                            onClick={() => setSearchQuery(search)}
                            className="w-full text-left px-4 py-3 text-sm tracking-wide text-gray-700 hover:text-black rounded-lg transition-colors flex items-center justify-between group"
                          >
                            <span>{search}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Quick Categories */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <h4 className="text-xs text-gray-500 tracking-[0.1em] uppercase mb-4">
                        Quick Categories
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {['WOMEN', 'MEN', 'KIDS', 'SALE'].map((category, index) => (
                          <motion.button
                            key={category}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            whileHover={{ scale: 1.02, backgroundColor: '#2c3b6e' }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 text-sm tracking-[0.1em] border border-gray-200 rounded-lg hover:text-white hover:border-[#2c3b6e] transition-all text-gray-700 font-medium"
                          >
                            {category}
                          </motion.button>
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
                    Press <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 mx-1">Enter</kbd> to search
                  </p>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">Esc</kbd>
                    <span className="text-xs text-gray-400">to close</span>
                  </div>
                </div>
              </motion.div>
        </motion.div>
      </div>
    </>
  );
}
