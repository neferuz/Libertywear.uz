'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { loginUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set language only on client side to avoid hydration mismatch
    setCurrentLang(getLanguageCode());
    
    // Listen for language changes
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await loginUser(email, password);
      
      // Save token and user data to localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      // Dispatch event to notify navigation about auth change
      window.dispatchEvent(new Event('auth-changed'));
      
      // Redirect to account page
      router.push('/account');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || '';
      
      // Translate common error messages
      if (errorMessage.includes('Email не подтвержден') || errorMessage.includes('Email not verified')) {
        setError(t('auth.emailNotVerified', currentLang));
      } else if (errorMessage.includes('деактивирован') || errorMessage.includes('deactivated')) {
        setError(t('auth.accountDeactivated', currentLang));
      } else {
        setError(t('auth.loginError', currentLang));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-[500px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl mb-3 tracking-tight text-[#2c3b6e]">
                {t('auth.signIn', currentLang)}
              </h1>
              <p className="text-gray-600 text-sm tracking-wide">
                {t('auth.signInDescription', currentLang)}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label
                  htmlFor="email"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.email', currentLang)}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="password"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.password', currentLang)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Forgot Password Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-right"
              >
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-600 hover:text-[#2c3b6e] transition-colors tracking-wide"
                >
                  {t('auth.forgotPassword', currentLang)}
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>{t('auth.signingIn', currentLang)}</span>
                ) : (
                  <>
                    <span>{t('auth.signIn', currentLang)}</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </motion.button>

              {/* Register Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center pt-4"
              >
                <p className="text-sm text-gray-600">
                  {t('auth.dontHaveAccount', currentLang)}{' '}
                  <Link
                    href="/register"
                    className="text-[#2c3b6e] hover:text-black font-medium transition-colors tracking-wide"
                  >
                    {t('auth.createAccount', currentLang)}
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}

