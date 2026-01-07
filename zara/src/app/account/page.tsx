'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, MapPin, Building, LogOut, Edit2, Save, X, Heart, ShoppingBag, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { getFavorites, removeFavorite, getOrders, FavoriteProduct, OrderItem, updateUserProfile, UserData } from '@/lib/api';

type TabType = 'profile' | 'favorites' | 'orders';

// Format price with space as thousand separator and "сум" currency
const formatPrice = (price: number | null): string => {
  if (!price) return '0 сум';
  const integerPrice = Math.round(price);
  const formattedPrice = integerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedPrice} сум`;
};

export default function AccountPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    address: '',
    pincode: '',
    city: '',
  });

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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUserData = localStorage.getItem('user_data');
    
    if (!token || !savedUserData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(savedUserData);
      setUserData(user);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        state: user.state || '',
        address: user.address || '',
        pincode: user.pincode || '',
        city: user.city || '',
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'favorites' && userData) {
      loadFavorites();
    }
  }, [activeTab, userData]);

  useEffect(() => {
    if (activeTab === 'orders' && userData) {
      loadOrders();
    }
  }, [activeTab, userData]);

  const loadFavorites = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    setFavoritesLoading(true);
    try {
      const data = await getFavorites(token);
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const loadOrders = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('⚠️ [AccountPage] No auth token for loading orders');
      return;
    }
    
    setOrdersLoading(true);
    try {
      console.log('🔍 [AccountPage] Loading orders with token:', token.substring(0, 20) + '...');
      const data = await getOrders(token, 0, 20);
      console.log('🔍 [AccountPage] Orders response:', {
        ordersCount: data.orders.length,
        total: data.total,
        orders: data.orders,
      });
      setOrders(data.orders);
    } catch (error) {
      console.error('❌ [AccountPage] Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    try {
      await removeFavorite(productId, token);
      setFavorites(favorites.filter(fav => fav.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Dispatch event to notify navigation about auth change
    window.dispatchEvent(new Event('auth-changed'));
    
    router.push('/');
    router.refresh();
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const updatedUser = await updateUserProfile(formData, token);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUserData(updatedUser as UserData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        state: userData.state || '',
        address: userData.address || '',
        pincode: userData.pincode || '',
        city: userData.city || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden w-full">
        <UrbanNavigation />
        <div className="pt-24 pb-16 px-6 lg:px-12 text-center">
          <h1 className="text-2xl mb-4">{t('account.loading', currentLang)}</h1>
        </div>
        <UrbanFooter />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl mb-2 tracking-tight text-[#2c3b6e]">
                {t('account.title', currentLang)}
              </h1>
              <p className="text-gray-600 text-sm tracking-wide">
                {t('account.subtitle', currentLang)}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              {(['profile', 'favorites', 'orders'] as TabType[]).map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm tracking-[0.1em] transition-colors relative ${
                    activeTab === tab
                      ? 'text-[#2c3b6e] font-medium'
                      : 'text-gray-600 hover:text-[#2c3b6e]'
                  }`}
                >
                  {tab === 'profile' && t('account.tabs.profile', currentLang)}
                  {tab === 'favorites' && t('account.tabs.favorites', currentLang)}
                  {tab === 'orders' && t('account.tabs.orders', currentLang)}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2c3b6e]"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white border border-gray-200 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-medium text-[#2c3b6e]">
                        {t('account.profileInfo', currentLang)}
                      </h2>
                      {!isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#2c3b6e] hover:text-black transition-colors border border-[#2c3b6e] hover:bg-[#2c3b6e] hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('account.edit', currentLang)}
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                          {t('account.email', currentLang)}
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{userData.email}</p>
                            {userData.is_email_verified ? (
                              <span className="text-xs text-green-600">{t('account.emailVerified', currentLang)}</span>
                            ) : (
                              <span className="text-xs text-red-600">{t('account.emailNotVerified', currentLang)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="space-y-2">
                        <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                          {t('account.name', currentLang)}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900 flex-1">{userData.name}</p>
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                          {t('account.phone', currentLang)}
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder={t('account.phonePlaceholder', currentLang)}
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900 flex-1">{userData.phone || t('account.notProvided', currentLang)}</p>
                          </div>
                        )}
                      </div>

                      {/* Region */}
                      <div className="space-y-2">
                        <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                          {t('account.region', currentLang)}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder={t('account.regionPlaceholder', currentLang)}
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900 flex-1">{userData.state || t('account.notProvided', currentLang)}</p>
                          </div>
                        )}
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                          {t('account.city', currentLang)}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder={t('account.cityPlaceholder', currentLang)}
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <Building className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900 flex-1">{userData.city || t('account.notProvided', currentLang)}</p>
                          </div>
                        )}
                      </div>

                      {/* Postal Code */}
                      <div className="space-y-2">
                        <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                          {t('account.postalCode', currentLang)}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            placeholder={t('account.postalCodePlaceholder', currentLang)}
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-900 flex-1">{userData.pincode || t('account.notProvided', currentLang)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address - Full Width */}
                    <div className="space-y-2 mt-6">
                      <label className="block text-xs tracking-[0.1em] text-gray-500 uppercase">
                        {t('account.address', currentLang)}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder={t('account.addressPlaceholder', currentLang)}
                          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                        />
                      ) : (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-900 flex-1">{userData.address || t('account.notProvided', currentLang)}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          className="flex-1 bg-[#2c3b6e] text-white px-6 py-3 hover:bg-black transition-colors flex items-center justify-center gap-2 text-sm tracking-[0.1em]"
                        >
                          <Save className="w-4 h-4" />
                          {t('account.save', currentLang)}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancel}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm tracking-[0.1em]"
                        >
                          <X className="w-4 h-4" />
                          {t('account.cancel', currentLang)}
                        </motion.button>
                      </div>
                    )}

                    {/* Logout Button */}
                    {!isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full mt-6 bg-red-50 text-red-600 px-6 py-3 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm tracking-[0.1em] border border-red-200"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('account.logout', currentLang)}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'favorites' && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white border border-gray-200 p-6 md:p-8">
                    <h2 className="text-lg font-medium text-[#2c3b6e] mb-6">
                      {t('account.tabs.favorites', currentLang)}
                    </h2>
                    
                    {favoritesLoading ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">{t('account.loading', currentLang)}</p>
                      </div>
                    ) : favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t('account.noFavorites', currentLang)}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favorites.map((favorite) => (
                          <motion.div
                            key={favorite.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative"
                          >
                            <Link href={`/product/${favorite.product_id}`}>
                              <div className="relative aspect-[3/4] bg-gray-100 rounded overflow-hidden mb-2">
                                {favorite.product_image ? (
                                  <Image
                                    src={favorite.product_image}
                                    alt={favorite.product_name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ShoppingBag className="w-12 h-12" />
                                  </div>
                                )}
                              </div>
                              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                                {favorite.product_name}
                              </h3>
                              <p className="text-sm text-[#2c3b6e] font-medium">
                                {formatPrice(favorite.product_price)}
                              </p>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveFavorite(favorite.product_id)}
                              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white border border-gray-200 p-6 md:p-8">
                    <h2 className="text-lg font-medium text-[#2c3b6e] mb-6">
                      {t('account.tabs.orders', currentLang)}
                    </h2>
                    
                    {ordersLoading ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">{t('account.loading', currentLang)}</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t('account.noOrders', currentLang)}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(() => {
                          // Group orders by order.id to show all items in one order together
                          const groupedOrders = orders.reduce((acc, order) => {
                            if (!acc[order.id]) {
                              acc[order.id] = {
                                id: order.id,
                                orderDate: order.orderDate,
                                status: order.status,
                                address: order.address,
                                totalAmount: order.totalAmount,
                                items: [],
                              };
                            }
                            acc[order.id].items.push(order);
                            // Update totalAmount to be the sum of all items
                            acc[order.id].totalAmount = acc[order.id].items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                            return acc;
                          }, {} as Record<number, { id: number; orderDate: number | null; status: string; address: string; totalAmount: number; items: OrderItem[] }>);

                          return Object.values(groupedOrders).map((orderGroup) => (
                            <motion.div
                              key={orderGroup.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-gray-200 rounded p-6 hover:border-[#2c3b6e] transition-colors"
                            >
                              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                                    {t('account.order', currentLang)} #{orderGroup.id}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {orderGroup.orderDate ? new Date(orderGroup.orderDate).toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : currentLang === 'uz' ? 'uz-UZ' : 'en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }) : ''}
                                  </p>
                                  {orderGroup.address && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {t('account.address', currentLang)}: {orderGroup.address}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className={`text-xs px-3 py-1 rounded block mb-2 ${
                                    orderGroup.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    orderGroup.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {t(`account.orderStatus.${orderGroup.status}`, currentLang) || orderGroup.status}
                                  </span>
                                  <p className="text-sm font-medium text-[#2c3b6e]">
                                    {formatPrice(orderGroup.totalAmount)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                {orderGroup.items.map((item) => (
                                  <div key={item._id} className="flex items-start gap-4">
                                    {item.imageURL ? (
                                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                        <Image
                                          src={item.imageURL}
                                          alt={item.productName}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                                        {item.productName}
                                      </h4>
                                      <div className="flex items-center gap-4 text-xs text-gray-600">
                                        {item.size && <span>{t('account.size', currentLang)}: {item.size}</span>}
                                        <span>{t('account.quantity', currentLang)}: {item.quantity}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm font-medium text-[#2c3b6e]">
                                      {formatPrice(item.price * item.quantity)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}
