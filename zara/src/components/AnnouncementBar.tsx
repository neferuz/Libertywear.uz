'use client';

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchAnnouncementBarText } from '@/lib/api';
import { getLanguageCode } from '@/lib/translations';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  }
  return 'https://api.libertywear.uz';
};

export function AnnouncementBar() {
  const { language } = useLanguage();
  const [text, setText] = useState<string>('GET 50% OFF TODAY ONLY!');
  const [isClient, setIsClient] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const loadData = async () => {
      const currentLang = language || getLanguageCode();
      const announcementText = await fetchAnnouncementBarText(currentLang);
      setText(announcementText);
      
      // Check if announcement bar is active
      try {
        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/site-settings/value/announcement_bar_active`);
        if (response.ok) {
          const data = await response.json();
          setIsActive(data.value === 'true');
        }
      } catch (error) {
        console.error('Error checking announcement bar status:', error);
        setIsActive(true); // Default to active if check fails
      }
    };
    loadData();
  }, [language]);

  // Use default text until client-side hydration is complete
  const displayText = isClient ? text : 'GET 50% OFF TODAY ONLY!';

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  return (
    <div className="bg-[#2c3b6e] text-white overflow-hidden">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex items-center whitespace-nowrap py-2"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center">
            <motion.span
              whileHover={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}
              className="text-xs tracking-wider px-8 cursor-default"
            >
              {displayText}
            </motion.span>
            <span className="text-white text-xs">★</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}