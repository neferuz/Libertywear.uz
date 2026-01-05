// Автоматическое определение URL бэкенда
const getBackendUrl = () => {
  // Если открыто с домена admin.libertywear.uz (HTTPS), используем основной домен с /api
  if (window.location.hostname === 'admin.libertywear.uz') {
    // Используем основной домен с путем /api
    const url = 'https://libertywear.uz/api';
    console.log('🔧 [CONFIG] Using API URL for admin.libertywear.uz:', url);
    // Добавляем в window для отладки
    window.__API_URL__ = url;
    return url;
  }
  // Если открыто с IP адреса или другого домена, используем тот же протокол и хост
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Используем тот же протокол (http/https) и хост, но порт 8000 для прямого доступа
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // Если это IP адрес, используем порт 8000
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      const url = `${protocol}//${hostname}:8000`;
      console.log('🔧 [CONFIG] Using API URL for IP:', url);
      window.__API_URL__ = url;
      return url;
    }
    // Если это другой домен, используем /api путь на том же домене
    const url = `${protocol}//${hostname}/api`;
    console.log('🔧 [CONFIG] Using API URL for other domain:', url);
    window.__API_URL__ = url;
    return url;
  }
  // Иначе используем localhost
  const url = 'http://localhost:8000';
  console.log('🔧 [CONFIG] Using API URL for localhost:', url);
  window.__API_URL__ = url;
  return url;
};

export const BASE_URL = getBackendUrl();
export const BASE_URL1 = getBackendUrl();

// Для отладки в консоли
if (typeof window !== 'undefined') {
  window.BASE_URL = BASE_URL;
  console.log('✅ [CONFIG] BASE_URL exported to window.BASE_URL:', BASE_URL);
}
