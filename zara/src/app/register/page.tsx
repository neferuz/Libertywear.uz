'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Building,
  X,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { registerUser, verifyEmail, loginUser } from '@/lib/api';

export default function RegisterPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
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

const regions = [
    t('auth.selectRegion', currentLang),
  'Tashkent',
  'Samarkand',
  'Bukhara',
  'Andijan',
  'Fergana',
  'Namangan',
  'Nukus',
  'Other',
];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region: '',
    phone: '',
    city: '',
    address: '',
    postalCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Map form data to API format
      const registerData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        state: formData.region,
        city: formData.city,
        address: formData.address,
        pincode: formData.postalCode,
      };

      const registerResponse = await registerUser(registerData);
      setRegisteredEmail(formData.email);
      setEmailSent(registerResponse.verification_code_sent || false);
      setDevCode(registerResponse.dev_code || null);
      setShowVerifyModal(true);
      
      // Не заполняем поле автоматически - пользователь должен ввести код из email
      setVerificationCode('');
    } catch (err: any) {
      setError(err.message || t('auth.registrationError', currentLang));
    } finally {
    setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    // Проверяем длину кода (может быть 5 или 6 цифр)
    if (verificationCode.length < 5 || verificationCode.length > 6) {
      setError(t('auth.invalidCode', currentLang));
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      await verifyEmail({
        email: registeredEmail,
        code: verificationCode,
      });

      // After successful verification, automatically login
      const loginResponse = await loginUser(registeredEmail, formData.password);
      
      // Store token and user data
      localStorage.setItem('auth_token', loginResponse.access_token);
      localStorage.setItem('user_data', JSON.stringify(loginResponse.user));
      
      // Dispatch auth-changed event
      window.dispatchEvent(new Event('auth-changed'));
      
      // Redirect to account page
      router.push('/account');
    } catch (err: any) {
      const errorMessage = err?.message || (typeof err === 'string' ? err : JSON.stringify(err)) || t('auth.verifyError', currentLang);
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-[600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl mb-3 tracking-tight text-[#2c3b6e]">
                {t('auth.createAccountTitle', currentLang)}
              </h1>
              <p className="text-gray-600 text-sm tracking-wide">
                {t('auth.createAccountDescription', currentLang)}
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5"
            >
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label
                  htmlFor="name"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.name', currentLang)}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('auth.namePlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                transition={{ duration: 0.5, delay: 0.5 }}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Region Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label
                  htmlFor="region"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.region', currentLang)}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-10 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white appearance-none cursor-pointer relative z-0"
                  >
                    {regions.map((region) => (
                      <option key={region} value={region === t('auth.selectRegion', currentLang) ? '' : region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label
                  htmlFor="phone"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.phone', currentLang)}
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('auth.phonePlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                </div>
              </motion.div>

              {/* City Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label
                  htmlFor="city"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.city', currentLang)}
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t('auth.cityPlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                </div>
              </motion.div>

              {/* Address Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label
                  htmlFor="address"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.address', currentLang)}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('auth.addressPlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                </div>
              </motion.div>

              {/* Postal Code Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <label
                  htmlFor="postalCode"
                  className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase"
                >
                  {t('auth.postalCode', currentLang)}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder={t('auth.postalCodePlaceholder', currentLang)}
                    required
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white"
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              {error && !showVerifyModal && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="w-full bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <span>{t('auth.creatingAccount', currentLang)}</span>
                ) : (
                  <>
                    <span>{t('auth.createAccountTitle', currentLang)}</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </motion.button>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="text-center pt-4"
              >
                <p className="text-sm text-gray-600">
                  {t('auth.alreadyHaveAccount', currentLang)}{' '}
                  <Link
                    href="/login"
                    className="text-[#2c3b6e] hover:text-black font-medium transition-colors tracking-wide"
                  >
                    {t('auth.signInLink', currentLang)}
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>
      <UrbanFooter />

      {/* Email Verification Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !isVerifying && setShowVerifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            >
              <button
                onClick={() => !isVerifying && setShowVerifyModal(false)}
                disabled={isVerifying}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-[#2c3b6e]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-[#2c3b6e]" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-[#2c3b6e] mb-2">
                  {t('auth.verifyEmailTitle', currentLang)}
                </h2>
                <p className="text-gray-600 text-sm">
                  {t('auth.verifyEmailDescription', currentLang)}
                </p>
                <p className="text-[#2c3b6e] font-medium text-sm mt-2">
                  {registeredEmail}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] text-gray-700 mb-2 uppercase">
                    {t('auth.verifyCodeLabel', currentLang)}
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    placeholder={t('auth.verifyCodePlaceholder', currentLang)}
                    maxLength={6}
                    minLength={5}
                    disabled={isVerifying}
                    className="w-full px-4 py-4 border border-gray-300 focus:outline-none focus:border-[#2c3b6e] transition-colors text-sm bg-white text-center text-2xl tracking-widest disabled:opacity-50"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length < 5 || verificationCode.length > 6}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <span>{t('auth.verifyingCode', currentLang)}</span>
                  ) : (
                    <>
                      <span>{t('auth.verifyButton', currentLang)}</span>
                      <CheckCircle className="w-4 h-4" strokeWidth={2} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

