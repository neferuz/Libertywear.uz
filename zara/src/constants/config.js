// Автоматическое определение URL бэкенда
const getBackendUrl = () => {
  // Если открыто с IP адреса (мобильный доступ), используем IP
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:8000`;
  }
  // Иначе используем localhost
  return 'http://localhost:8000';
};

export const BASE_URL = getBackendUrl();
export const BASE_URL1 = getBackendUrl();
