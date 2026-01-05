import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

interface SubSubCategory {
  name: string;
  href: string;
}

interface SubCategory {
  name: string;
  href: string;
  subItems?: SubSubCategory[];
}

interface MegaMenuColumn {
  title: string;
  items: SubCategory[];
  featured?: {
    type: 'image' | 'sale';
    imageUrl?: string;
    title?: string;
    description?: string;
  };
}

interface MegaMenuData {
  [key: string]: MegaMenuColumn[];
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [expandedMobileSubCategory, setExpandedMobileSubCategory] = useState<string | null>(null);
  const [menuCloseTimeout, setMenuCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const megaMenuData: MegaMenuData = {
    'WOMEN': [
      {
        title: 'Tops',
        items: [
          { 
            name: 'Shirts', 
            href: '#',
            subItems: [
              { name: 'Long Sleeve', href: '#' },
              { name: 'Short Sleeve', href: '#' },
              { name: 'Sleeveless', href: '#' },
            ]
          },
          { 
            name: 'Blouses', 
            href: '#',
            subItems: [
              { name: 'Silk Blouses', href: '#' },
              { name: 'Cotton Blouses', href: '#' },
              { name: 'Printed', href: '#' },
            ]
          },
          { name: 'T-Shirts', href: '#' },
          { 
            name: 'Knitwear', 
            href: '#',
            subItems: [
              { name: 'Sweaters', href: '#' },
              { name: 'Cardigans', href: '#' },
              { name: 'Turtlenecks', href: '#' },
            ]
          },
        ],
      },
      {
        title: 'Bottoms',
        items: [
          { 
            name: 'Jeans', 
            href: '#',
            subItems: [
              { name: 'Skinny', href: '#' },
              { name: 'Straight', href: '#' },
              { name: 'Wide Leg', href: '#' },
              { name: 'Boyfriend', href: '#' },
            ]
          },
          { 
            name: 'Pants', 
            href: '#',
            subItems: [
              { name: 'Trousers', href: '#' },
              { name: 'Joggers', href: '#' },
              { name: 'Leggings', href: '#' },
            ]
          },
          { name: 'Skirts', href: '#' },
          { name: 'Shorts', href: '#' },
        ],
      },
      {
        title: 'Dresses & Outerwear',
        items: [
          { 
            name: 'Dresses', 
            href: '#',
            subItems: [
              { name: 'Casual', href: '#' },
              { name: 'Evening', href: '#' },
              { name: 'Maxi', href: '#' },
              { name: 'Mini', href: '#' },
            ]
          },
          { 
            name: 'Jackets', 
            href: '#',
            subItems: [
              { name: 'Denim', href: '#' },
              { name: 'Leather', href: '#' },
              { name: 'Bomber', href: '#' },
            ]
          },
          { name: 'Coats', href: '#' },
          { name: 'Blazers', href: '#' },
        ],
      },
      {
        title: 'Shoes & Bags',
        items: [
          { name: 'Heels', href: '#' },
          { name: 'Sneakers', href: '#' },
          { name: 'Boots', href: '#' },
          { name: 'Handbags', href: '#' },
          { name: 'Backpacks', href: '#' },
        ],
      },
      {
        title: 'Featured',
        items: [],
        featured: {
          type: 'sale',
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
          title: 'SPRING SALE',
          description: 'Up to 50% OFF',
        },
      },
    ],
    'MEN': [
      {
        title: 'Tops',
        items: [
          { 
            name: 'Shirts', 
            href: '#',
            subItems: [
              { name: 'Dress Shirts', href: '#' },
              { name: 'Casual Shirts', href: '#' },
              { name: 'Flannel', href: '#' },
            ]
          },
          { name: 'T-Shirts', href: '#' },
          { name: 'Polo', href: '#' },
          { 
            name: 'Sweaters', 
            href: '#',
            subItems: [
              { name: 'Crewneck', href: '#' },
              { name: 'V-Neck', href: '#' },
              { name: 'Hoodies', href: '#' },
            ]
          },
        ],
      },
      {
        title: 'Bottoms',
        items: [
          { 
            name: 'Jeans', 
            href: '#',
            subItems: [
              { name: 'Slim Fit', href: '#' },
              { name: 'Regular', href: '#' },
              { name: 'Relaxed', href: '#' },
            ]
          },
          { name: 'Chinos', href: '#' },
          { name: 'Joggers', href: '#' },
          { name: 'Shorts', href: '#' },
        ],
      },
      {
        title: 'Outerwear',
        items: [
          { name: 'Jackets', href: '#' },
          { name: 'Coats', href: '#' },
          { name: 'Blazers', href: '#' },
          { name: 'Vests', href: '#' },
        ],
      },
      {
        title: 'Shoes & Accessories',
        items: [
          { name: 'Sneakers', href: '#' },
          { name: 'Boots', href: '#' },
          { name: 'Loafers', href: '#' },
          { name: 'Belts', href: '#' },
          { name: 'Bags', href: '#' },
        ],
      },
      {
        title: 'Featured',
        items: [],
        featured: {
          type: 'image',
          imageUrl: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=800&fit=crop',
          title: 'NEW COLLECTION',
          description: 'Explore Now',
        },
      },
    ],
    'KIDS': [
      {
        title: 'Boys',
        items: [
          { name: 'T-Shirts', href: '#' },
          { name: 'Shirts', href: '#' },
          { name: 'Pants', href: '#' },
          { name: 'Jeans', href: '#' },
          { name: 'Outerwear', href: '#' },
        ],
      },
      {
        title: 'Girls',
        items: [
          { name: 'Dresses', href: '#' },
          { name: 'Tops', href: '#' },
          { name: 'Skirts', href: '#' },
          { name: 'Jeans', href: '#' },
          { name: 'Outerwear', href: '#' },
        ],
      },
      {
        title: 'Babies',
        items: [
          { name: 'Bodysuits', href: '#' },
          { name: 'Rompers', href: '#' },
          { name: 'Sleepwear', href: '#' },
          { name: 'Accessories', href: '#' },
        ],
      },
      {
        title: 'Shoes & Accessories',
        items: [
          { name: 'Sneakers', href: '#' },
          { name: 'Sandals', href: '#' },
          { name: 'Backpacks', href: '#' },
          { name: 'Hats', href: '#' },
        ],
      },
    ],
    'ACCESSORIES': [
      {
        title: 'Bags',
        items: [
          { name: 'Handbags', href: '#' },
          { name: 'Backpacks', href: '#' },
          { name: 'Totes', href: '#' },
          { name: 'Crossbody', href: '#' },
          { name: 'Clutches', href: '#' },
        ],
      },
      {
        title: 'Jewelry',
        items: [
          { name: 'Necklaces', href: '#' },
          { name: 'Earrings', href: '#' },
          { name: 'Bracelets', href: '#' },
          { name: 'Rings', href: '#' },
        ],
      },
      {
        title: 'Accessories',
        items: [
          { name: 'Belts', href: '#' },
          { name: 'Scarves', href: '#' },
          { name: 'Hats', href: '#' },
          { name: 'Sunglasses', href: '#' },
          { name: 'Watches', href: '#' },
        ],
      },
      {
        title: 'Shoes',
        items: [
          { name: 'Sneakers', href: '#' },
          { name: 'Boots', href: '#' },
          { name: 'Heels', href: '#' },
          { name: 'Sandals', href: '#' },
        ],
      },
    ],
  };

  const mainCategories = ['WOMEN', 'MEN', 'KIDS', 'ACCESSORIES'];

  const handleMenuEnter = (category: string) => {
    if (menuCloseTimeout) {
      clearTimeout(menuCloseTimeout);
      setMenuCloseTimeout(null);
    }
    setActiveMenu(category);
  };

  const handleMenuLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
      setHoveredSubCategory(null);
    }, 300);
    setMenuCloseTimeout(timeout);
  };

  const toggleMobileCategory = (category: string) => {
    if (expandedMobileCategory === category) {
      setExpandedMobileCategory(null);
      setExpandedMobileSubCategory(null);
    } else {
      setExpandedMobileCategory(category);
      setExpandedMobileSubCategory(null);
    }
  };

  const toggleMobileSubCategory = (subCategory: string) => {
    setExpandedMobileSubCategory(expandedMobileSubCategory === subCategory ? null : subCategory);
  };

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/98 backdrop-blur-xl shadow-md' 
            : 'bg-white'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            
            {/* MOBILE LAYOUT */}
            <div className="lg:hidden flex items-center justify-between w-full">
              {/* Left: Hamburger Menu */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(true)}
                className="text-black p-2 -ml-2"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </motion.button>

              {/* Center: Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 -translate-x-1/2"
              >
                <a href="/" className="text-xl sm:text-2xl tracking-[0.3em] text-black">
                  LIBERTY
                </a>
              </motion.div>

              {/* Right: Search, User & Cart */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileSearchExpanded(true)}
                  className="text-black p-2"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-black p-2"
                  aria-label="User account"
                >
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative text-black p-2 -mr-2"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-0 bg-[#2c3b6e] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden lg:flex items-center justify-between w-full">
              {/* Left: Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="flex-shrink-0"
              >
                <a href="/" className="text-2xl lg:text-3xl tracking-[0.3em] text-black">
                  LIBERTY
                </a>
              </motion.div>

              {/* Center: Main Categories */}
              <div className="flex items-center space-x-12">
                {mainCategories.map((category) => (
                  <div
                    key={category}
                    className="relative py-8"
                    onMouseEnter={() => handleMenuEnter(category)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <a
                      href={`#${category.toLowerCase()}`}
                      className="text-sm tracking-[0.15em] text-black relative group transition-colors duration-300 hover:text-gray-600"
                    >
                      {category}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Right: Icons */}
              <div className="flex items-center space-x-6">
                {/* Search */}
                <AnimatePresence>
                  {searchExpanded ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 260, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="relative"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                          if (!searchQuery) setSearchExpanded(false);
                        }}
                        autoFocus
                        placeholder="Search..."
                        className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-200 focus:border-black rounded-full focus:outline-none text-sm transition-all"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchExpanded(true)}
                      className="text-black hover:text-gray-600 transition-colors"
                    >
                      <Search className="w-5 h-5" strokeWidth={1.5} />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="relative text-black hover:text-gray-600 transition-colors"
                >
                  <Heart className="w-5 h-5" strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-[#2c3b6e] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Shopping Cart */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="relative text-black hover:text-gray-600 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-[#2c3b6e] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* User Profile */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="text-black hover:text-gray-600 transition-colors"
                >
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Desktop Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMenu && megaMenuData[activeMenu] && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={() => handleMenuEnter(activeMenu)}
            onMouseLeave={handleMenuLeave}
            className="hidden lg:block fixed top-20 lg:top-24 left-0 right-0 z-40 bg-white border-t border-gray-100"
            style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' }}
          >
            <div className="max-w-[1800px] mx-auto px-12 py-12">
              <div className="grid grid-cols-5 gap-12">
                {megaMenuData[activeMenu].map((column, colIndex) => (
                  <motion.div
                    key={column.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: colIndex * 0.08, ease: [0.4, 0, 0.2, 1] }}
                    className="relative"
                  >
                    {column.featured ? (
                      <div className="relative h-full rounded-lg overflow-hidden group cursor-pointer">
                        <img
                          src={column.featured.imageUrl}
                          alt={column.featured.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-white text-xl tracking-[0.2em] mb-2">{column.featured.title}</h3>
                          <p className="text-white/90 text-sm">{column.featured.description}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xs tracking-[0.15em] mb-6 text-black uppercase">
                          {column.title}
                        </h3>
                        <ul className="space-y-3">
                          {column.items.map((item, itemIndex) => (
                            <li
                              key={item.name}
                              className="relative"
                              onMouseEnter={() => item.subItems ? setHoveredSubCategory(item.name) : null}
                              onMouseLeave={() => setHoveredSubCategory(null)}
                            >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  duration: 0.4, 
                                  delay: colIndex * 0.08 + itemIndex * 0.04,
                                  ease: [0.4, 0, 0.2, 1]
                                }}
                              >
                                <a
                                  href={item.href}
                                  className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center justify-between group"
                                >
                                  <span className="relative">
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 h-[1px] bg-black w-0 transition-all duration-300 group-hover:w-full" />
                                  </span>
                                  {item.subItems && (
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                                  )}
                                </a>
                              </motion.div>

                              {/* Sub-subcategories panel */}
                              <AnimatePresence>
                                {item.subItems && hoveredSubCategory === item.name && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    className="absolute left-full top-0 ml-8 bg-white border border-gray-100 rounded-lg p-4 min-w-[180px] z-50"
                                    style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
                                  >
                                    <ul className="space-y-2">
                                      {item.subItems.map((subItem) => (
                                        <li key={subItem.name}>
                                          <a
                                            href={subItem.href}
                                            className="text-sm text-gray-600 hover:text-black transition-colors duration-200 block py-1 relative group"
                                          >
                                            {subItem.name}
                                            <span className="absolute bottom-0 left-0 h-[1px] bg-black w-0 transition-all duration-300 group-hover:w-full" />
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-full max-w-sm bg-white overflow-y-auto lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="text-xl tracking-[0.3em] text-black">MENU</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-black p-2 -mr-2"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" strokeWidth={1.5} />
                  </motion.button>
                </div>

                {/* Main Categories Accordion */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6">
                    {mainCategories.map((category, categoryIndex) => {
                      const categoryData = megaMenuData[category];
                      const isExpanded = expandedMobileCategory === category;

                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: categoryIndex * 0.08, duration: 0.4 }}
                          className="border-b border-gray-100 last:border-0"
                        >
                          {/* Main Category Button */}
                          <button
                            onClick={() => toggleMobileCategory(category)}
                            className="w-full flex items-center justify-between py-4 text-left group"
                          >
                            <span className="text-base tracking-[0.15em] text-black group-hover:text-gray-600 transition-colors">
                              {category}
                            </span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            >
                              <ChevronDown className="w-5 h-5 text-black" strokeWidth={1.5} />
                            </motion.div>
                          </button>

                          {/* Subcategories Accordion */}
                          <AnimatePresence>
                            {isExpanded && categoryData && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="pb-4 space-y-3">
                                  {categoryData.map((column, colIndex) => {
                                    if (column.featured) return null;

                                    return (
                                      <motion.div
                                        key={column.title}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: colIndex * 0.05, duration: 0.3 }}
                                        className="pl-4"
                                      >
                                        {/* Column Title */}
                                        <h4 className="text-xs tracking-[0.1em] text-gray-500 mb-2 uppercase">
                                          {column.title}
                                        </h4>

                                        {/* Column Items */}
                                        <ul className="space-y-2">
                                          {column.items.map((item, itemIndex) => {
                                            const hasSubItems = item.subItems && item.subItems.length > 0;
                                            const isSubExpanded = expandedMobileSubCategory === item.name;

                                            return (
                                              <motion.li
                                                key={item.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: itemIndex * 0.03, duration: 0.3 }}
                                              >
                                                {hasSubItems ? (
                                                  <>
                                                    <button
                                                      onClick={() => toggleMobileSubCategory(item.name)}
                                                      className="w-full flex items-center justify-between py-2 text-left group"
                                                    >
                                                      <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                                                        {item.name}
                                                      </span>
                                                      <motion.div
                                                        animate={{ rotate: isSubExpanded ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                      >
                                                        <ChevronDown className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                                                      </motion.div>
                                                    </button>

                                                    {/* Sub-subcategories */}
                                                    <AnimatePresence>
                                                      {isSubExpanded && (
                                                        <motion.ul
                                                          initial={{ height: 0, opacity: 0 }}
                                                          animate={{ height: 'auto', opacity: 1 }}
                                                          exit={{ height: 0, opacity: 0 }}
                                                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                                          className="overflow-hidden pl-4 space-y-2 mt-2"
                                                        >
                                                          {item.subItems!.map((subItem, subIndex) => (
                                                            <motion.li
                                                              key={subItem.name}
                                                              initial={{ opacity: 0, x: -10 }}
                                                              animate={{ opacity: 1, x: 0 }}
                                                              transition={{ delay: subIndex * 0.03, duration: 0.3 }}
                                                            >
                                                              <a
                                                                href={subItem.href}
                                                                className="block py-1 text-sm text-gray-600 hover:text-black transition-colors"
                                                                onClick={() => setMobileMenuOpen(false)}
                                                              >
                                                                {subItem.name}
                                                              </a>
                                                            </motion.li>
                                                          ))}
                                                        </motion.ul>
                                                      )}
                                                    </AnimatePresence>
                                                  </>
                                                ) : (
                                                  <a
                                                    href={item.href}
                                                    className="block py-2 text-sm text-gray-700 hover:text-black transition-colors"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                  >
                                                    {item.name}
                                                  </a>
                                                )}
                                              </motion.li>
                                            );
                                          })}
                                        </ul>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Additional Links */}
                  <div className="px-6 py-6 border-t border-gray-100 space-y-4">
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      href="#sale"
                      className="block py-2 text-base tracking-[0.1em] text-[#2c3b6e] hover:text-black transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      SALE
                    </motion.a>
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      href="#new"
                      className="block py-2 text-base tracking-[0.1em] text-black hover:text-gray-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      NEW ARRIVALS
                    </motion.a>
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      href="#blogs"
                      className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </motion.a>
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      href="#faq"
                      className="block py-2 text-sm text-gray-600 hover:text-black transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQs
                    </motion.a>
                  </div>
                </div>

                {/* Footer - Account Links */}
                <div className="px-6 py-6 border-t border-gray-100 space-y-4 bg-gray-50">
                  <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    href="#account"
                    className="flex items-center space-x-3 py-2 text-black hover:text-gray-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm">My Account</span>
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    href="#wishlist"
                    className="flex items-center space-x-3 py-2 text-black hover:text-gray-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm">Wishlist ({wishlistCount})</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-16 sm:top-20 left-0 right-0 z-[60] bg-white border-b border-gray-200 px-4 py-4 lg:hidden"
            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!searchQuery) setMobileSearchExpanded(false);
                }}
                autoFocus
                placeholder="Search products..."
                className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 focus:border-black rounded-full focus:outline-none text-sm"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}