'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Lock, MapPin, Truck, CheckCircle, ChevronLeft, ChevronRight, Banknote, Wallet, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { createOrder, CreateOrderItem } from '@/lib/api';

// Format price with space as thousand separator and "сум" currency
const formatPrice = (price: number): string => {
  // Round to integer (no decimals for сум)
  const integerPrice = Math.round(price);
  
  // Add space as thousand separator
  const formattedPrice = integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return `${formattedPrice} сум`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, removeFromCart } = useCart();
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
    
    // Use language from context first, fallback to getLanguageCode()
    const lang = language || getLanguageCode();
    setCurrentLang(lang);
    
    const handleLanguageChange = () => {
      const newLang = language || getLanguageCode();
      setCurrentLang(newLang);
    };
    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [language]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Uzbekistan',
    phone: '',
    paymentMethod: 'cash',
  });
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Load user data from localStorage or API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingUserData(true);
        
        // First, try to get from localStorage
        if (typeof window !== 'undefined') {
          const savedData = localStorage.getItem('user_data');
          const token = localStorage.getItem('auth_token');
          
          if (savedData) {
            try {
              const userData = JSON.parse(savedData);
              console.log('📥 Загружены данные пользователя из localStorage:', userData);
              
              // Parse name into firstName and lastName
              const nameParts = (userData.name || '').split(' ');
              const firstName = nameParts[0] || '';
              const lastName = nameParts.slice(1).join(' ') || '';
              
              setFormData({
                firstName: firstName,
                lastName: lastName,
                address: userData.address || '',
                city: userData.city || '',
                postalCode: userData.pincode || userData.postal_code || '',
                country: userData.state || userData.region || 'Uzbekistan',
                phone: userData.phone || '',
                paymentMethod: 'cash',
              });
              
              setIsLoadingUserData(false);
              return;
            } catch (e) {
              console.error('Ошибка парсинга данных из localStorage:', e);
            }
          }
          
          // If no data in localStorage but we have a token, try to fetch from API
          if (token && !savedData) {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                const userData = await response.json();
                console.log('📥 Загружены данные пользователя из API:', userData);
                
                // Parse name into firstName and lastName
                const nameParts = (userData.name || '').split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
                setFormData({
                  firstName: firstName,
                  lastName: lastName,
                  address: userData.address || '',
                  city: userData.city || '',
                  postalCode: userData.pincode || userData.postal_code || '',
                  country: userData.state || userData.region || userData.country || 'Uzbekistan',
                  phone: userData.phone || '',
                  paymentMethod: 'cash',
                });
                
                // Save to localStorage for future use
                localStorage.setItem('user_data', JSON.stringify(userData));
              }
            } catch (error) {
              console.error('Ошибка загрузки данных пользователя из API:', error);
            }
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Проверяем, что пользователь авторизован
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert(t('checkout.loginRequired', displayLang) || 'Please login to place an order');
        router.push('/login');
        setIsProcessing(false);
        return;
      }

      // Формируем адрес из данных формы
      const fullAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.phone}, ${formData.country}`;

      // Преобразуем товары из корзины в формат для API
      const orderItems: CreateOrderItem[] = items.map(item => {
        // Извлекаем variant_id из item, если он есть
        // Предполагаем, что item может содержать variantId или variant_id
        const variantId = (item as any).variantId || (item as any).variant_id;
        
        return {
          id: item.id,
          productId: item.id,
          variantId: variantId,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.size,
          imageURL: item.imageUrl,
        };
      });

      console.log('📤 [Checkout] Creating order with items:', orderItems);
      console.log('📤 [Checkout] Address:', fullAddress);
      console.log('📤 [Checkout] Payment method:', formData.paymentMethod);

      // Отправляем заказ на backend
      const result = await createOrder(
        orderItems,
        fullAddress,
        formData.paymentMethod,
        '' // notes
      );

      console.log('✅ [Checkout] Order created successfully:', result);

      // Очищаем корзину после успешного заказа
      // Создаем копию массива items, так как мы будем изменять его во время итерации
      const itemsToRemove = [...items];
      itemsToRemove.forEach(item => {
        removeFromCart(item.id);
      });

      // Показываем страницу успешного заказа
      setIsProcessing(false);
      setIsCompleted(true);
    } catch (error: any) {
      console.error('❌ [Checkout] Error creating order:', error);
      alert(error.message || t('checkout.orderError', displayLang) || 'Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = 15.00;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  
  // Use default language until client-side hydration is complete
  const displayLang = isClient ? currentLang : 'en';

  if (items.length === 0 && !isCompleted) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden w-full">
        <UrbanNavigation />
        <div className="pb-16 px-6 lg:px-12">
          <div className="max-w-[1600px] mx-auto pt-24 text-center">
            <h1 className="text-2xl mb-4 text-[#2c3b6e]">{t('checkout.emptyCart', displayLang)}</h1>
            <Link href="/" className="text-[#2c3b6e] hover:text-black transition-colors">
              {t('checkout.continueShopping', displayLang)}
            </Link>
          </div>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden w-full">
        <UrbanNavigation />
        <div className="pb-16 px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto pt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={1.5} />
                </div>
              </motion.div>
              <h1 className="text-3xl md:text-4xl tracking-tight text-[#2c3b6e]">
                {t('checkout.orderComplete', displayLang)}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                {t('checkout.confirmationMessage', displayLang)}
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
                  {t('checkout.continueShopping', displayLang)}
                </Link>
              </motion.div>
            </motion.div>
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
          {/* Mobile Header - Only on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden pt-8 pb-2"
          >
            <h1 className="text-2xl tracking-tight text-[#2c3b6e] mb-1">
              CHECKOUT
            </h1>
            <p className="text-xs text-gray-600 tracking-wide">
              Complete your order below
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="pt-4 lg:pt-16 pb-3 lg:pb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2c3b6e] transition-colors tracking-wide"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('checkout.back', displayLang)}</span>
            </button>
          </motion.div>

          {/* Mobile Order Summary - Collapsible */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden mb-4"
          >
            <div className="border border-gray-200 bg-white">
              {/* Header - Always Visible */}
              <motion.button
                onClick={() => setIsOrderSummaryExpanded(!isOrderSummaryExpanded)}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg tracking-tight text-[#2c3b6e] font-medium">
                    {t('checkout.orderSummary', displayLang)}
                  </h2>
                  <span className="text-xs text-gray-500">
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isOrderSummaryExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#2c3b6e]" strokeWidth={1.5} />
                </motion.div>
              </motion.button>

              {/* Collapsible Content */}
              <AnimatePresence>
                {isOrderSummaryExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-6 border-t border-gray-200">
                      {/* Order Items Carousel */}
                      <div className="border-b border-gray-200 pb-6">
                        {items.length > 0 && (
                          <>
                            <div className="relative">
                              <div className="overflow-hidden">
                                <motion.div
                                  className="flex"
                                  animate={{
                                    x: `-${currentItemIndex * 100}%`,
                                  }}
                                  transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                  }}
                                >
                                  {items.map((item, index) => (
                                    <motion.div
                                      key={item.id}
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="flex gap-4 min-w-full px-1"
                                    >
                                      <div className="w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img
                                          src={item.imageUrl}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-sm tracking-wide text-black mb-1 line-clamp-2">
                                          {item.name}
                                        </h3>
                                        {item.size && (
                                          <p className="text-xs text-gray-500 mb-1">{t('checkout.size', displayLang)}: {item.size}</p>
                                        )}
                                        {item.color && (
                                          <p className="text-xs text-gray-500 mb-1">{t('checkout.color', displayLang)}: {item.color}</p>
                                        )}
                                        <p className="text-xs text-gray-500">{t('checkout.qty', displayLang)}: {item.quantity}</p>
                                      </div>
                                      <div className="text-sm font-medium text-black">
                                        {formatPrice(item.price * item.quantity)}
                                      </div>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </div>

                              {/* Navigation Arrows */}
                              {items.length > 1 && (
                                <>
                                  <motion.button
                                    onClick={() => setCurrentItemIndex((prev) => (prev - 1 + items.length) % items.length)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                                  >
                                    <ChevronLeft className="w-4 h-4 text-[#2c3b6e]" strokeWidth={2} />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => setCurrentItemIndex((prev) => (prev + 1) % items.length)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                                  >
                                    <ChevronRight className="w-4 h-4 text-[#2c3b6e]" strokeWidth={2} />
                                  </motion.button>
                                </>
                              )}
                            </div>

                            {/* Pagination Dots */}
                            {items.length > 1 && (
                              <div className="flex items-center justify-center gap-2 mt-4">
                                {items.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentItemIndex(index)}
                                    className={`transition-all duration-300 ${
                                      index === currentItemIndex
                                        ? 'w-8 h-0.5 bg-[#2c3b6e]'
                                        : 'w-1.5 h-0.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Order Totals */}
                      <div className="space-y-3 border-b border-gray-200 pb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 tracking-wide">Subtotal</span>
                          <span className="text-black">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 tracking-wide">{t('checkout.shipping', displayLang)}</span>
                          <span className="text-black">{formatPrice(shipping)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 tracking-wide">{t('checkout.tax', displayLang)}</span>
                          <span className="text-black">{formatPrice(tax)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-baseline pt-2">
                        <span className="text-lg tracking-tight text-[#2c3b6e] font-medium">{t('checkout.total', displayLang)}</span>
                        <span className="text-2xl tracking-tight text-black font-medium">
                          {formatPrice(total)}
                        </span>
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-4">
                        <Lock className="w-4 h-4" strokeWidth={1.5} />
                        <span>{t('checkout.secureCheckout', displayLang)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-6 lg:space-y-12"
            >
              <div className="hidden lg:block">
                <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-[#2c3b6e] mb-2">
                  CHECKOUT
                </h1>
                <p className="text-sm text-gray-600 tracking-wide">
                  Complete your order below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-12">
                {/* Shipping Address */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 lg:space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#2c3b6e]" strokeWidth={1.5} />
                    <h2 className="text-lg lg:text-xl tracking-tight text-[#2c3b6e] border-b-2 border-[#2c3b6e] pb-2 inline-block">
                      {t('checkout.shippingAddress', displayLang)}
                    </h2>
                    </div>
                    {isLoadingUserData && (
                      <span className="text-xs text-gray-500">{t('checkout.loadingData', displayLang)}</span>
                    )}
                    {!isLoadingUserData && formData.firstName && (
                      <span className="text-xs text-green-600">{t('checkout.dataLoaded', displayLang)}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                        {t('checkout.firstName', displayLang)}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                        placeholder="Алишер"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                        {t('checkout.lastName', displayLang)}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                        placeholder="Наврузов"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      {t('checkout.address', displayLang)}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder="улица Навои, дом 5"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                        {t('checkout.city', displayLang)}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                        placeholder="Ташкент"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                        {t('checkout.postalCode', displayLang)}
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                        placeholder="100000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                        {t('checkout.country', displayLang)}
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      >
                        <option value="">{t('checkout.selectCountry', displayLang)}</option>
                        <option value="UZ">Узбекистан</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder="+998 93 565 38 01"
                    />
                  </div>
                </motion.section>

                {/* Payment Method */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 lg:space-y-6"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#2c3b6e]" strokeWidth={1.5} />
                    <h2 className="text-lg lg:text-xl tracking-tight text-[#2c3b6e] border-b-2 border-[#2c3b6e] pb-2 inline-block">
                      {t('checkout.paymentMethod', displayLang)}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-[#2c3b6e] transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#2c3b6e]"
                      />
                      <Banknote className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                      <span className="text-sm tracking-wide">{t('checkout.cash', displayLang)}</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-[#2c3b6e] transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payme"
                        checked={formData.paymentMethod === 'payme'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#2c3b6e]"
                      />
                      <Wallet className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                      <span className="text-sm tracking-wide">PayMe</span>
                    </label>
                  </div>
                </motion.section>
                {/* Hidden submit button */}
                <button type="submit" id="checkout-form-submit" className="hidden" />
              </form>
            </motion.div>

            {/* Order Summary - Desktop Only */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block lg:col-span-1"
            >
              <div className="lg:sticky lg:top-6 space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
                <div>
                  <h2 className="text-xl tracking-tight text-[#2c3b6e] mb-6 border-b-2 border-[#2c3b6e] pb-2 inline-block">
                    {t('checkout.orderSummary', displayLang)}
                  </h2>
                </div>

                {/* Order Items Carousel */}
                <div className="border-b border-gray-200 pb-6">
                  {items.length > 0 && (
                    <>
                      <div className="relative">
                        {/* Carousel Container */}
                        <div
                          ref={carouselRef}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="flex"
                            animate={{
                              x: `-${currentItemIndex * 100}%`,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 30,
                            }}
                          >
                            {items.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-4 min-w-full px-1"
                              >
                                <div className="w-20 h-20 bg-gray-100 overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm tracking-wide text-black mb-1 line-clamp-2">
                                    {item.name}
                                  </h3>
                                  {item.size && (
                                    <p className="text-xs text-gray-500 mb-1">{t('checkout.size', displayLang)}: {item.size}</p>
                                  )}
                                  {item.color && (
                                    <p className="text-xs text-gray-500 mb-1">{t('checkout.color', displayLang)}: {item.color}</p>
                                  )}
                                  <p className="text-xs text-gray-500">{t('checkout.qty', displayLang)}: {item.quantity}</p>
                                </div>
                                <div className="text-sm font-medium text-black">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        {/* Navigation Arrows */}
                        {items.length > 1 && (
                          <>
                            <motion.button
                              onClick={() => setCurrentItemIndex((prev) => (prev - 1 + items.length) % items.length)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                              disabled={items.length <= 1}
                            >
                              <ChevronLeft className="w-4 h-4 text-[#2c3b6e]" strokeWidth={2} />
                            </motion.button>
                            <motion.button
                              onClick={() => setCurrentItemIndex((prev) => (prev + 1) % items.length)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
                              disabled={items.length <= 1}
                            >
                              <ChevronRight className="w-4 h-4 text-[#2c3b6e]" strokeWidth={2} />
                            </motion.button>
                          </>
                        )}
                      </div>

                      {/* Pagination Dots */}
                      {items.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                          {items.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentItemIndex(index)}
                              className={`transition-all duration-300 ${
                                index === currentItemIndex
                                  ? 'w-8 h-0.5 bg-[#2c3b6e]'
                                  : 'w-1.5 h-0.5 bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-b border-gray-200 pb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 tracking-wide">Subtotal</span>
                    <span className="text-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 tracking-wide">{t('checkout.shipping', displayLang)}</span>
                    <span className="text-black">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 tracking-wide">{t('checkout.tax', displayLang)}</span>
                    <span className="text-black">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-lg tracking-tight text-[#2c3b6e] font-medium">{t('checkout.total', displayLang)}</span>
                  <span className="text-2xl tracking-tight text-black font-medium">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-4">
                  <Lock className="w-4 h-4" strokeWidth={1.5} />
                  <span>Secure checkout</span>
                </div>

                {/* Place Order Button */}
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    const form = document.querySelector('form');
                    if (form) {
                      const submitButton = document.getElementById('checkout-form-submit');
                      if (submitButton) {
                        submitButton.click();
                      }
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isProcessing}
                  className="w-full bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  {isProcessing ? (
                    <span>{t('checkout.processing', displayLang)}</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" strokeWidth={2} />
                      <span>{t('checkout.placeOrder', displayLang).toUpperCase()}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}

