// Маппинг социальных сетей на иконки из react-icons/fi
export const getSocialIcon = (name, url) => {
  if (!name && !url) return 'FiLink';
  
  const lowerName = (name || '').toLowerCase();
  const lowerUrl = (url || '').toLowerCase();
  
  // Определяем по названию
  if (lowerName.includes('instagram') || lowerUrl.includes('instagram')) {
    return 'FiInstagram';
  }
  if (lowerName.includes('facebook') || lowerUrl.includes('facebook')) {
    return 'FiFacebook';
  }
  if (lowerName.includes('twitter') || lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) {
    return 'FiTwitter';
  }
  if (lowerName.includes('youtube') || lowerUrl.includes('youtube')) {
    return 'FiYoutube';
  }
  if (lowerName.includes('telegram') || lowerUrl.includes('telegram')) {
    return 'FiSend';
  }
  if (lowerName.includes('whatsapp') || lowerUrl.includes('whatsapp')) {
    return 'FiMessageCircle';
  }
  if (lowerName.includes('linkedin') || lowerUrl.includes('linkedin')) {
    return 'FiLinkedin';
  }
  if (lowerName.includes('tiktok') || lowerUrl.includes('tiktok')) {
    return 'FiVideo';
  }
  if (lowerName.includes('vk') || lowerUrl.includes('vk.com')) {
    return 'FiUsers';
  }
  if (lowerName.includes('pinterest') || lowerUrl.includes('pinterest')) {
    return 'FiImage';
  }
  if (lowerName.includes('snapchat') || lowerUrl.includes('snapchat')) {
    return 'FiCamera';
  }
  
  // По умолчанию
  return 'FiLink';
};

// Список доступных иконок для выбора
export const availableIcons = [
  { name: 'Instagram', value: 'FiInstagram', icon: 'FiInstagram' },
  { name: 'Facebook', value: 'FiFacebook', icon: 'FiFacebook' },
  { name: 'Twitter/X', value: 'FiTwitter', icon: 'FiTwitter' },
  { name: 'YouTube', value: 'FiYoutube', icon: 'FiYoutube' },
  { name: 'Telegram', value: 'FiSend', icon: 'FiSend' },
  { name: 'WhatsApp', value: 'FiMessageCircle', icon: 'FiMessageCircle' },
  { name: 'LinkedIn', value: 'FiLinkedin', icon: 'FiLinkedin' },
  { name: 'TikTok', value: 'FiVideo', icon: 'FiVideo' },
  { name: 'VK', value: 'FiUsers', icon: 'FiUsers' },
  { name: 'Pinterest', value: 'FiImage', icon: 'FiImage' },
  { name: 'Snapchat', value: 'FiCamera', icon: 'FiCamera' },
  { name: 'Ссылка', value: 'FiLink', icon: 'FiLink' },
];

