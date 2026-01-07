'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface SubSubCategory {
  id: number;
  name: string;
  href: string;
}

interface SubCategory {
  id: number;
  name: string;
  href: string;
  subSubCategories?: SubSubCategory[];
}

interface Category {
  id: number;
  name: string;
  href: string;
  subCategories: SubCategory[];
}

interface CategoryMenuProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function CategoryMenu({ category, isOpen, onClose, onMouseEnter, onMouseLeave }: CategoryMenuProps) {
  const [hoveredSubCategory, setHoveredSubCategory] = useState<number | null>(null);

  // Debug: log category data
  if (isOpen && category.subCategories.length > 0) {
    console.log('🔍 [CategoryMenu] Category:', category.name);
    console.log('🔍 [CategoryMenu] SubCategories:', category.subCategories.length);
    console.log('🔍 [CategoryMenu] SubCategories data:', category.subCategories);
  }

  if (!isOpen) return null;
  
  // If no subcategories, don't show menu
  if (!category.subCategories || category.subCategories.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="absolute top-full left-0 pt-2 z-50 category-menu-container"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ marginTop: '-8px', paddingTop: '12px' }} // Overlap to prevent gap
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white border border-gray-200 shadow-2xl rounded-xl overflow-visible flex"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {/* Main Subcategories */}
            <div className="py-2 flex-shrink-0 min-w-[280px]">
              {category.subCategories.map((subCategory, index) => (
                <div key={subCategory.id} className="relative">
                  {index > 0 && (
                    <div className="mx-6 border-t border-gray-100" />
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="group"
                    onMouseEnter={() => setHoveredSubCategory(subCategory.id)}
                  >
                    <Link
                      href={`${category.href}?subCategory=${encodeURIComponent(subCategory.name)}`}
                      className="flex items-center justify-between px-6 py-3 text-sm tracking-wide text-gray-700 hover:text-[#2c3b6e] transition-colors relative group/item"
                    >
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="font-medium"
                      >
                        {subCategory.name}
                      </motion.span>
                      {subCategory.subSubCategories && subCategory.subSubCategories.length > 0 && (
                        <motion.div
                          animate={{ x: hoveredSubCategory === subCategory.id ? 2 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-[#2c3b6e] transition-colors" />
                        </motion.div>
                      )}
                    </Link>

                    {/* Sub-Sub Categories - внутри того же контейнера */}
                    {subCategory.subSubCategories && subCategory.subSubCategories.length > 0 && (
                      <AnimatePresence>
                        {hoveredSubCategory === subCategory.id && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            className="absolute left-full top-0 ml-1 bg-white border border-gray-200 shadow-2xl min-w-[240px] rounded-xl z-[60]"
                            onMouseEnter={() => {
                              setHoveredSubCategory(subCategory.id);
                              if (onMouseEnter) onMouseEnter();
                            }}
                            onMouseLeave={(e) => {
                              // Проверяем, не переходим ли мы в родительское меню
                              const relatedTarget = e.relatedTarget as HTMLElement;
                              if (!relatedTarget || !relatedTarget.closest('.category-menu-container')) {
                                // Если уходим совсем, не закрываем сразу
                              }
                            }}
                          >
                            <div className="py-2">
                              {subCategory.subSubCategories.map((subSubCategory, subIndex) => (
                                <div key={subSubCategory.id}>
                                  {subIndex > 0 && (
                                    <div className="mx-6 border-t border-gray-100" />
                                  )}
                                  <Link
                                    href={`${category.href}?subCategory=${encodeURIComponent(subCategory.name)}&subSubCategory=${encodeURIComponent(subSubCategory.name)}`}
                                    className="block px-6 py-2.5 text-sm tracking-wide text-gray-600 hover:text-[#2c3b6e] transition-colors"
                                  >
                                    <motion.span
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: subIndex * 0.03, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                      whileHover={{ x: 4 }}
                                    >
                                      {subSubCategory.name}
                                    </motion.span>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
