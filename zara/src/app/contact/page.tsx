'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';
import { fetchContactInfo, sendContactMessage, ContactInfo, fetchStoreLocationData, StoreLocationData } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';

// Map icon_type to icon component
const iconMap: Record<string, typeof MapPin> = {
  'map': MapPin,
  'phone': Phone,
  'email': Mail,
  'clock': Clock,
};

export default function ContactPage() {
  const { language } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [storeLocation, setStoreLocation] = useState<StoreLocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>('en');
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const currentLang = language || getLanguageCode();
    setLang(currentLang);
    loadContactData(currentLang);

    // Listen for language changes
    const handleLanguageChange = () => {
      const newLang = language || getLanguageCode();
      setLang((prevLang) => {
        if (newLang !== prevLang) {
          loadContactData(newLang);
          return newLang;
        }
        return prevLang;
      });
    };

    // Check for language changes periodically
    const interval = setInterval(handleLanguageChange, 1000);
    
    // Also listen to storage events
    window.addEventListener('storage', handleLanguageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [language]);

  const loadContactData = async (language: string) => {
    try {
      setLoading(true);
      const [contacts, locationData] = await Promise.all([
        fetchContactInfo(language),
        fetchStoreLocationData(language)
      ]);
      setContactInfo(contacts);
      setStoreLocation(locationData);
    } catch (error) {
      console.error('Error loading contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('📝 [ContactPage] Submitting form data:', formData);
      
      const messageData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        subject: formData.subject?.trim() || undefined,
        message: formData.message.trim(),
      };
      
      console.log('📤 [ContactPage] Sending message data:', messageData);
      
      const success = await sendContactMessage(messageData);

      if (success) {
        console.log('✅ [ContactPage] Message sent successfully');
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
          });
        }, 3000);
      } else {
        console.error('❌ [ContactPage] Failed to send message');
        setSubmitError(t('contact.errorSending', lang));
      }
    } catch (error: any) {
      console.error('❌ [ContactPage] Error submitting form:', error);
      setSubmitError(error.message || t('contact.errorOccurred', lang));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get icon for contact info item
  const getIcon = (iconType: string) => {
    return iconMap[iconType] || MapPin;
  };

  // Parse details string into array
  const parseDetails = (details?: string): string[] => {
    if (!details) return [];
    return details.split('\n').filter(line => line.trim());
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <UrbanNavigation />
      <div className="pb-16 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Hero Section */}
          <div className="pt-16 pb-12 lg:pt-24 lg:pb-16 text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#2c3b6e] mb-6"
            >
              {isClient ? t('contact.title', lang) : 'CONTACT US'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-gray-600 tracking-wide max-w-2xl mx-auto leading-relaxed"
            >
              {isClient ? t('contact.subtitle', lang) : "We'd love to hear from you. Get in touch with us and we'll respond as soon as possible."}
            </motion.p>
          </div>

          {/* Contact Info Cards */}
          {!loading && contactInfo.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-16 lg:mb-24"
            >
              <div className={`flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 ${
                contactInfo.length === 3 ? 'lg:max-w-5xl mx-auto' : ''
              }`}>
                {contactInfo.map((info, index) => {
                  const Icon = getIcon(info.icon_type);
                  const details = parseDetails(info.details);
                  return (
                    <motion.div
                      key={info.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className={`bg-gray-50 p-4 lg:p-8 text-center space-y-3 lg:space-y-4 border border-gray-200 hover:border-[#2c3b6e] transition-colors ${
                        contactInfo.length === 3 
                          ? 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-21.33px)]' 
                          : 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center"
                      >
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#2c3b6e]/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-[#2c3b6e]" strokeWidth={1.5} />
                        </div>
                      </motion.div>
                      <h3 className="text-sm lg:text-lg tracking-tight text-[#2c3b6e] font-medium">
                        {info.title}
                      </h3>
                      {info.content && (
                        <p className="text-[10px] lg:text-xs text-gray-600 leading-relaxed mb-2">
                          {info.content}
                        </p>
                      )}
                      {details.length > 0 && (
                        <div className="space-y-0.5 lg:space-y-1">
                          {details.map((detail, idx) => (
                            <p key={idx} className="text-[10px] lg:text-xs text-gray-600 leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 lg:mb-24">
            {/* Contact Form */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e] mb-4">
                  {isClient ? t('contact.sendMessage', lang) : 'Send us a Message'}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isClient ? t('contact.formDescription', lang) : "Fill out the form below and we'll get back to you as soon as possible."}
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 p-6 rounded-lg flex items-center space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 mb-1">{isClient ? t('contact.messageSent', lang) : 'Message Sent!'}</h3>
                    <p className="text-xs text-green-600">{isClient ? t('contact.messageSentDescription', lang) : "We'll get back to you soon."}</p>
                  </div>
                </motion.div>
              ) : submitError ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 p-6 rounded-lg"
                >
                  <p className="text-sm text-red-800">{submitError}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      {isClient ? t('contact.name', lang) : 'Name'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder={isClient ? t('contact.namePlaceholder', lang) : 'Your name'}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      {isClient ? t('contact.email', lang) : 'Email'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder={isClient ? t('contact.emailPlaceholder', lang) : 'your.email@example.com'}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      {isClient ? t('contact.phone', lang) : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder={isClient ? t('contact.phonePlaceholder', lang) : '+1 (555) 123-4567'}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      {isClient ? t('contact.subject', lang) : 'Subject'}
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                    >
                      <option value="">{isClient ? t('contact.subjectPlaceholder', lang) : 'Select a subject'}</option>
                      <option value="general">{isClient ? t('contact.subjectOptions.general', lang) : 'General Inquiry'}</option>
                      <option value="order">{isClient ? t('contact.subjectOptions.order', lang) : 'Order Question'}</option>
                      <option value="return">{isClient ? t('contact.subjectOptions.return', lang) : 'Returns & Exchanges'}</option>
                      <option value="feedback">{isClient ? t('contact.subjectOptions.feedback', lang) : 'Feedback'}</option>
                      <option value="other">{isClient ? t('contact.subjectOptions.other', lang) : 'Other'}</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      {isClient ? t('contact.message', lang) : 'Message'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors resize-none"
                      placeholder={isClient ? t('contact.messagePlaceholder', lang) : 'Your message...'}
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full bg-[#2c3b6e] text-white px-8 py-4 hover:bg-black transition-colors flex items-center justify-center space-x-2 text-sm tracking-[0.1em] disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  >
                    {isSubmitting ? (
                      <span>{isClient ? t('contact.sending', lang) : 'Sending...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" strokeWidth={2} />
                        <span>{isClient ? t('contact.sendMessageButton', lang) : 'Send Message'}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.section>

            {/* Map Section */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl tracking-tight text-[#2c3b6e] mb-4">
                  {isClient ? t('contact.findUs', lang) : 'Find Us'}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {isClient ? t('contact.findUsDescription', lang) : 'Visit our store location in the heart of the city.'}
                </p>
              </div>

              {/* Map Container */}
              <div className="relative w-full h-[400px] lg:h-[500px] bg-gray-100 overflow-hidden border border-gray-200">
                {storeLocation ? (
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184132684887!2d${storeLocation.map_longitude}!3d${storeLocation.map_latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus&zoom=${storeLocation.map_zoom || '15'}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                ) : (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184132684887!2d-73.98811768459398!3d40.75889597932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                )}
              </div>

              {/* Map Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-50 p-6 border border-gray-200 space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#2c3b6e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-sm font-medium text-[#2c3b6e] mb-1">{isClient ? t('contact.storeLocation', lang) : 'Store Location'}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {storeLocation ? (
                        storeLocation.address_translations[lang as keyof typeof storeLocation.address_translations]?.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < storeLocation.address_translations[lang as keyof typeof storeLocation.address_translations].split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          123 Fashion Avenue<br />
                          New York, NY 10001<br />
                          United States
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pt-3 border-t border-gray-200">
                  <Clock className="w-5 h-5 text-[#2c3b6e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-sm font-medium text-[#2c3b6e] mb-1">{isClient ? t('contact.storeHours', lang) : 'Store Hours'}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {storeLocation ? (
                        storeLocation.hours_translations[lang as keyof typeof storeLocation.hours_translations]?.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < storeLocation.hours_translations[lang as keyof typeof storeLocation.hours_translations].split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          Monday - Friday: 9:00 AM - 8:00 PM<br />
                          Saturday: 10:00 AM - 6:00 PM<br />
                          Sunday: 12:00 PM - 5:00 PM
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
      <UrbanFooter />
    </div>
  );
}

