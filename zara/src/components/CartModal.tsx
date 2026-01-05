'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export function CartModal({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
}: CartModalProps) {
  const handleDecreaseQuantity = (item: CartItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemoveItem(item.id);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Блокируем скролл body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      // Блокируем скролл
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Восстанавливаем скролл
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Очистка при размонтировании
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - кликабельный на мобильных */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:pointer-events-none"
            onClick={onClose}
          />

          {/* Clickable area on the left (только для десктопа) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block fixed top-0 left-0 w-[calc(100%-380px)] h-screen z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="fixed top-0 right-0 w-full lg:w-[380px] h-screen bg-white shadow-2xl z-50 overflow-hidden flex flex-col lg:border-l border-gray-100"
            onClick={(e) => e.stopPropagation()}
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
                  <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg tracking-tight font-medium">Shopping Cart</h3>
                  <p className="text-xs text-gray-500 tracking-wide">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
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

            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 px-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="bg-gray-100 rounded-full p-6 mb-4"
                  >
                    <ShoppingBag className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-gray-500 text-sm tracking-wide mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-xs">Start adding items to your cart</p>
                </motion.div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/20 flex items-center justify-center"
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              e.nativeEvent.stopImmediatePropagation();
                              onRemoveItem(item.id);
                            }}
                            className="bg-white/90 text-black p-1.5 rounded-full hover:bg-white transition-colors"
                            type="button"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                          </motion.button>
                        </motion.div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium tracking-wide mb-1 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">${item.price.toFixed(2)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleDecreaseQuantity(item, e)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-100 transition-colors"
                              type="button"
                            >
                              −
                            </motion.button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.nativeEvent.stopImmediatePropagation();
                                onUpdateQuantity(item.id, item.quantity + 1);
                              }}
                              type="button"
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-100 transition-colors"
                            >
                              +
                            </motion.button>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onRemoveItem(item.id);
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                              type="button"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border-t border-gray-200 p-6 bg-gray-50"
              >
                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 tracking-wide">Subtotal</span>
                  <span className="text-lg font-medium tracking-tight">${total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full bg-[#2c3b6e] text-white py-4 px-6 flex items-center justify-center space-x-2 hover:bg-black transition-colors text-sm tracking-[0.1em]"
                  >
                    <span>CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </motion.button>
                </Link>

                {/* View Cart Link */}
                <motion.a
                  href="#cart"
                  whileHover={{ x: 3 }}
                  className="block text-center text-xs text-gray-500 hover:text-black transition-colors mt-3 tracking-wide"
                >
                  View full cart
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

