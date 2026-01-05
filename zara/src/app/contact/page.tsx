'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { UrbanNavigation } from '@/components/UrbanNavigation';
import { UrbanFooter } from '@/components/UrbanFooter';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Address',
    details: [
      '123 Fashion Avenue',
      'New York, NY 10001',
      'United States',
    ],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: [
      '+1 (555) 123-4567',
      '+1 (555) 123-4568',
    ],
  },
  {
    icon: Mail,
    title: 'Email',
    details: [
      'info@liberty.com',
      'support@liberty.com',
    ],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: [
      'Monday - Friday: 9:00 AM - 8:00 PM',
      'Saturday: 10:00 AM - 6:00 PM',
      'Sunday: 12:00 PM - 5:00 PM',
    ],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
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
              CONTACT US
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm md:text-base text-gray-600 tracking-wide max-w-2xl mx-auto leading-relaxed"
            >
              We'd love to hear from you. Get in touch with us and we'll respond as soon as possible.
            </motion.p>
          </div>

          {/* Contact Info Cards */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-16 lg:mb-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 p-4 lg:p-8 text-center space-y-3 lg:space-y-4 border border-gray-200 hover:border-[#2c3b6e] transition-colors"
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
                    <div className="space-y-0.5 lg:space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-[10px] lg:text-xs text-gray-600 leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

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
                  Send us a Message
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Fill out the form below and we'll get back to you as soon as possible.
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
                    <h3 className="text-sm font-medium text-green-800 mb-1">Message Sent!</h3>
                    <p className="text-xs text-green-600">We'll get back to you soon.</p>
                  </div>
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
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder="Your name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <label className="block text-xs tracking-[0.1em] text-gray-700 uppercase mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#2c3b6e] focus:outline-none bg-transparent text-sm tracking-wide transition-colors resize-none"
                      placeholder="Your message..."
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
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" strokeWidth={2} />
                        <span>Send Message</span>
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
                  Find Us
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Visit our store location in the heart of the city.
                </p>
              </div>

              {/* Map Container */}
              <div className="relative w-full h-[400px] lg:h-[500px] bg-gray-100 overflow-hidden border border-gray-200">
                {/* Placeholder for map - можно заменить на реальную карту (Google Maps, Mapbox и т.д.) */}
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
                    <h3 className="text-sm font-medium text-[#2c3b6e] mb-1">Store Location</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      123 Fashion Avenue<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pt-3 border-t border-gray-200">
                  <Clock className="w-5 h-5 text-[#2c3b6e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-sm font-medium text-[#2c3b6e] mb-1">Store Hours</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Monday - Friday: 9:00 AM - 8:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 12:00 PM - 5:00 PM
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

