// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set in env, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For localhost development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If frontend is on localhost, backend runs on port 8000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Backend always runs on port 8000
      return 'http://localhost:8000';
    }
  }
  
  // Default to production API
  return 'https://api.libertywear.uz';
};

const API_BASE_URL = getApiBaseUrl();

export interface Category {
  id: number;
  title: string;
  slug: string;
  subcategories?: Category[];
  gender?: string;
  image?: string;
  title_translations?: Record<string, string> | string;
}

export interface Product {
  id: number;
  name: string; // Already translated by API
  name_translations?: Record<string, string> | string; // For reference
  description?: string; // Already translated by API
  description_translations?: Record<string, string> | string; // For reference
  price: number;
  imageUrl?: string;
  category_id: number;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  color_name: string;
  color_image?: string;
  price: number;
  stock: number;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  image_url: string;
  order: number;
}

// API Functions
export async function fetchCategories(lang: string = 'en'): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/all?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string, lang: string = 'en'): Promise<Category | null> {
  try {
    // First try to get by slug from API endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/categories/slug/${encodeURIComponent(slug)}?lang=${lang}`);
      if (response.ok) {
        const category = await response.json();
        console.log('✅ [fetchCategoryBySlug] Found category via API:', { id: category.id, title: category.title, slug: category.slug });
        return category;
      }
    } catch (apiError) {
      console.log('⚠️ [fetchCategoryBySlug] API endpoint failed, trying fallback method');
    }
    
    // Fallback: search in all categories
    const allCategories = await fetchCategories(lang);
    console.log('🔍 [fetchCategoryBySlug] All categories:', allCategories.map(c => ({ id: c.id, title: c.title, slug: c.slug })));
    console.log('🔍 [fetchCategoryBySlug] Looking for slug:', slug);
    const category = findCategoryBySlug(allCategories, slug);
    console.log('🔍 [fetchCategoryBySlug] Found category:', category ? { id: category.id, title: category.title, slug: category.slug } : 'null');
    return category || null;
  } catch (error) {
    console.error('❌ [fetchCategoryBySlug] Error fetching category:', error);
    return null;
  }
}

function findCategoryBySlug(categories: Category[], slug: string): Category | null {
  // Try exact match first
  for (const cat of categories) {
    if (cat.slug === slug || cat.slug?.toLowerCase() === slug.toLowerCase()) {
      return cat;
    }
    if (cat.subcategories) {
      const found = findCategoryBySlug(cat.subcategories, slug);
      if (found) return found;
    }
  }
  // Try partial match (slug contains or is contained)
  for (const cat of categories) {
    if (cat.slug && (cat.slug.toLowerCase().includes(slug.toLowerCase()) || slug.toLowerCase().includes(cat.slug.toLowerCase()))) {
      return cat;
    }
  }
  return null;
}

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  category_id?: number; // Deprecated - use itemCategory instead
  itemGender?: string;
  itemCategory?: string;
  lang?: string;
}): Promise<{ products: Product[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    // Note: Backend doesn't accept category_id, use itemCategory (slug) instead
    if (params.itemGender) queryParams.append('itemGender', params.itemGender);
    if (params.itemCategory) queryParams.append('itemCategory', params.itemCategory);
    if (params.lang) queryParams.append('lang', params.lang);

    const url = `${API_BASE_URL}/products?${queryParams.toString()}`;
    console.log('🔍 [fetchProducts] Request URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [fetchProducts] Response error:', response.status, errorText);
      throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log('🔍 [fetchProducts] Response data:', {
      hasProducts: !!data.products,
      hasData: !!data.data,
      productsCount: data.products?.length || data.data?.length || 0,
      total: data.total || data.count || 0,
    });
    // API returns { data: [], count: 0, page: 0, limit: 10 }
    // or sometimes { products: [], total: 0 }
    return {
      products: data.products || data.data || [],
      total: data.total || data.count || 0,
    };
  } catch (error) {
    console.error('❌ [fetchProducts] Error:', error);
    return { products: [], total: 0 };
  }
}

export async function fetchProductById(id: number, lang: string = 'en'): Promise<Product | null> {
  try {
    const url = `${API_BASE_URL}/products/${id}?lang=${lang}`;
    console.log('🔍 [fetchProductById] Fetching product:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.error('❌ [fetchProductById] Product not found (404):', id);
        return null;
      }
      const errorText = await response.text();
      console.error('❌ [fetchProductById] HTTP error:', response.status, errorText);
      throw new Error(`Failed to fetch product: ${response.status} ${errorText}`);
    }
    
    const product = await response.json();
    console.log('✅ [fetchProductById] Product fetched:', product.id, product.name);
    return product;
  } catch (error) {
    console.error('❌ [fetchProductById] Error fetching product:', error);
    return null;
  }
}

export interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url?: string;
  order: number;
  is_active: boolean;
}

export async function fetchPartners(activeOnly: boolean = true): Promise<Partner[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/partners/?active_only=${activeOnly}`);
    if (!response.ok) {
      throw new Error('Failed to fetch partners');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

export async function fetchSiteSetting(key: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings/value/${key}`);
    if (!response.ok) {
      // If setting doesn't exist, return default value for show_partners_block
      if (key === 'show_partners_block') {
        return 'true';
      }
      return null;
    }
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error(`Error fetching site setting ${key}:`, error);
    // Default to true for show_partners_block
    if (key === 'show_partners_block') {
      return 'true';
    }
    return null;
  }
}

export interface AboutSection {
  id: number;
  title: string;
  description: string;
  image?: string;
  reverse: boolean;
  order: number;
  title_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  image?: string;
  bio?: string;
  order: number;
  name_translations?: Record<string, string>;
  position_translations?: Record<string, string>;
  bio_translations?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

// Helper function to get translated text
function getTranslatedText(
  translations: Record<string, string> | null | undefined,
  lang: string,
  fallback: string
): string {
  if (!translations) return fallback;
  if (translations[lang]) return translations[lang];
  if (translations['ru']) return translations['ru'];
  if (translations['en']) return translations['en'];
  return fallback;
}

export async function fetchAboutSections(lang: string = 'en'): Promise<AboutSection[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/about/sections`);
    if (!response.ok) {
      throw new Error('Failed to fetch about sections');
    }
    const sections = await response.json();
    // Apply translations
    return sections.map((section: AboutSection) => ({
      ...section,
      title: getTranslatedText(section.title_translations, lang, section.title),
      description: getTranslatedText(section.description_translations, lang, section.description),
    }));
  } catch (error) {
    console.error('Error fetching about sections:', error);
    return [];
  }
}

export async function fetchTeamMembers(lang: string = 'en'): Promise<TeamMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/about/team`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    const members = await response.json();
    // Apply translations
    return members.map((member: TeamMember) => ({
      ...member,
      name: getTranslatedText(member.name_translations, lang, member.name),
      position: getTranslatedText(member.position_translations, lang, member.position),
      bio: getTranslatedText(member.bio_translations, lang, member.bio || ''),
    }));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export async function fetchAboutHero(lang: string = 'en'): Promise<{ title: string; description: string }> {
  try {
    const [titleRes, descRes] = await Promise.all([
      fetch(`${API_BASE_URL}/site-settings/value/about_hero_title`).catch(() => null),
      fetch(`${API_BASE_URL}/site-settings/value/about_hero_description`).catch(() => null),
    ]);

    let title = 'ABOUT US';
    let description = 'Welcome to Liberty, where luxury meets accessibility. We are dedicated to bringing you the finest fashion pieces that combine timeless elegance with contemporary style.';

    if (titleRes && titleRes.ok) {
      const titleData = await titleRes.json();
      if (titleData.value) {
        try {
          const titleTranslations = JSON.parse(titleData.value);
          title = getTranslatedText(titleTranslations, lang, title);
        } catch (e) {
          console.error('Error parsing hero title translations:', e);
        }
      }
    }

    if (descRes && descRes.ok) {
      const descData = await descRes.json();
      if (descData.value) {
        try {
          const descTranslations = JSON.parse(descData.value);
          description = getTranslatedText(descTranslations, lang, description);
        } catch (e) {
          console.error('Error parsing hero description translations:', e);
        }
      }
    }

    return { title, description };
  } catch (error) {
    console.error('Error fetching about hero:', error);
    return {
      title: 'ABOUT US',
      description: 'Welcome to Liberty, where luxury meets accessibility. We are dedicated to bringing you the finest fashion pieces that combine timeless elegance with contemporary style.',
    };
  }
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  question_translations?: Record<string, string>;
  answer_translations?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export async function fetchFAQItems(lang: string = 'en'): Promise<FAQItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/faq`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQ items');
    }
    const items = await response.json();
    // Apply translations
    return items.map((item: FAQItem) => ({
      ...item,
      question: getTranslatedText(item.question_translations, lang, item.question),
      answer: getTranslatedText(item.answer_translations, lang, item.answer),
      category: item.category || 'All',
    }));
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    return [];
  }
}

export interface ContactInfo {
  id: number;
  icon_type: string; // 'map', 'phone', 'email', 'clock'
  title: string;
  content: string;
  details?: string;
  order: number;
  title_translations?: Record<string, string>;
  content_translations?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export async function fetchContactInfo(lang: string = 'en'): Promise<ContactInfo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contact info');
    }
    const contacts = await response.json();
    // Apply translations
    return contacts.map((contact: ContactInfo) => ({
      ...contact,
      title: getTranslatedText(contact.title_translations, lang, contact.title),
      content: getTranslatedText(contact.content_translations, lang, contact.content),
    }));
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return [];
  }
}

export interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function sendContactMessage(data: ContactMessageData): Promise<boolean> {
  try {
    console.log('📤 [sendContactMessage] Sending message:', data);
    const response = await fetch(`${API_BASE_URL}/contact-messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('📥 [sendContactMessage] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [sendContactMessage] Error response:', errorText);
      throw new Error(`Failed to send contact message: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ [sendContactMessage] Message sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ [sendContactMessage] Error sending contact message:', error);
    return false;
  }
}

// Authentication functions
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    state?: string;
    address?: string;
    pincode?: string;
    city?: string;
    is_email_verified: boolean;
    created_at: string;
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData)) {
        errorMessage = errorData.map((e: any) => e.msg || e.loc?.join('.') || JSON.stringify(e)).join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  state?: string;
  address?: string;
  pincode?: string;
  city?: string;
}

export async function registerUser(data: RegisterData): Promise<{ 
  message: string; 
  email: string;
  verification_code_sent: boolean;
  dev_code?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export async function verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon?: string;
  iconUrl?: string;
  iconType?: string;
}

export interface SocialLinksResponse {
  id: number;
  links: SocialLinkItem[];
}

export async function fetchSocialLinks(): Promise<SocialLinksResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/social-links/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching social links:', error);
    throw error;
  }
}

export interface SliderSlide {
  id: number;
  image_url_desktop: string;  // Рекомендуемый размер: 1920x600px для десктопа
  image_url_mobile?: string;  // Рекомендуемый размер: 768x500px для мобильного
  alt_text?: string;
  tag_translations?: Record<string, string> | string;  // {"ru": "текст", "uz": "matn", "en": "text", "es": "texto"}
  headline_translations?: Record<string, string> | string;
  description_translations?: Record<string, string> | string;
  cta_text_translations?: Record<string, string> | string;
  title?: string;  // Legacy field
  link?: string;  // Legacy field
  cta_link?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FavoriteProduct {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product_name: string;
  product_price: number | null;
  product_image: string | null;
  product_slug: string | null;
}

export async function getFavorites(token: string): Promise<FavoriteProduct[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

export async function addFavorite(productId: number, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

export async function removeFavorite(productId: number, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

export interface OrderItem {
  _id: string;
  id: number;
  productName: string;
  imageURL: string | null;
  price: number;
  quantity: number;
  size: string | null;
  status: string;
  orderDate: number | null;
  address: string;
  totalAmount: number;
}

export interface OrdersResponse {
  orders: OrderItem[];
  total: number;
  page: number;
  limit: number;
}

export async function getOrders(token: string, page: number = 0, limit: number = 10): Promise<OrdersResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/order/?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 [getOrders] API Response:', data);
    
    // API returns { status: 1, data: [...], count: ..., page: ..., limit: ... }
    // But we expect { orders: [...], total: ..., page: ..., limit: ... }
    return {
      orders: data.data || data.orders || [],
      total: data.count || data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  phone?: string;
  state?: string;
  address?: string;
  pincode?: string;
  city?: string;
  is_email_verified: boolean;
  created_at: string;
}

export async function updateUserProfile(data: Partial<RegisterData>, token: string): Promise<UserData> {
  try {
    // For now, we'll update localStorage. Later we can add API endpoint
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const updatedUser = { ...userData, ...data };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    return updatedUser as UserData;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export interface ChatMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  admin_reply?: string | null;
  is_read: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface ChatMessageCreate {
  name: string;
  email: string;
  message: string;
}

export async function sendChatMessage(data: ChatMessageCreate): Promise<ChatMessage> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

export async function getChatMessages(skip: number = 0, limit: number = 100): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
}

export async function fetchSliderSlides(activeOnly: boolean = true): Promise<SliderSlide[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/slider/?active_only=${activeOnly}`);
    if (!response.ok) {
      throw new Error('Failed to fetch slider slides');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching slider slides:', error);
    return [];
  }
}

export interface AnnouncementBarText {
  ru: string;
  uz: string;
  en: string;
  es: string;
}

export async function fetchAnnouncementBarText(lang: string = 'en'): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings/value/announcement_bar_text`);
    if (!response.ok) {
      // Return default text if setting not found
      const defaults: AnnouncementBarText = {
        ru: 'ПОЛУЧИТЕ 50% СКИДКУ ТОЛЬКО СЕГОДНЯ!',
        uz: 'BUGUN 50% CHEGIRMA OLING!',
        en: 'GET 50% OFF TODAY ONLY!',
        es: '¡OBTÉN 50% DE DESCUENTO SOLO HOY!'
      };
      return defaults[lang as keyof AnnouncementBarText] || defaults.en;
    }
    
    const data = await response.json();
    if (!data.value) {
      const defaults: AnnouncementBarText = {
        ru: 'ПОЛУЧИТЕ 50% СКИДКУ ТОЛЬКО СЕГОДНЯ!',
        uz: 'BUGUN 50% CHEGIRMA OLING!',
        en: 'GET 50% OFF TODAY ONLY!',
        es: '¡OBTÉN 50% DE DESCUENTO SOLO HOY!'
      };
      return defaults[lang as keyof AnnouncementBarText] || defaults.en;
    }
    
    try {
      const translations = JSON.parse(data.value);
      return translations[lang] || translations.en || 'GET 50% OFF TODAY ONLY!';
    } catch (e) {
      // If value is not JSON, return it as is
      return data.value;
    }
  } catch (error) {
    console.error('Error fetching announcement bar text:', error);
    return 'GET 50% OFF TODAY ONLY!';
  }
}

export interface PromoBannerData {
  tag_translations: { ru: string; uz: string; en: string; es: string };
  title_translations: { ru: string; uz: string; en: string; es: string };
  subtitle_translations: { ru: string; uz: string; en: string; es: string };
  description_translations: { ru: string; uz: string; en: string; es: string };
  button_text_translations: { ru: string; uz: string; en: string; es: string };
  button_link: string;
  image_url: string;
  is_active: boolean;
}

export async function fetchPromoBannerData(lang: string = 'en'): Promise<PromoBannerData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings/value/promo_banner_data`);
    if (!response.ok) {
      // Return default data if setting not found
      return {
        tag_translations: {
          ru: 'ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ',
          uz: 'CHEKLANGAN TAKLIF',
          en: 'LIMITED OFFER',
          es: 'OFERTA LIMITADA'
        },
        title_translations: {
          ru: 'ЗИМНЯЯ РАСПРОДАЖА',
          uz: 'QISH SOTILISHI',
          en: 'WINTER SALE',
          es: 'VENTA DE INVIERNO'
        },
        subtitle_translations: {
          ru: 'ДО 70% СКИДКА',
          uz: '70% GACHA CHEGIRMA',
          en: 'UP TO 70% OFF',
          es: 'HASTA 70% DE DESCUENTO'
        },
        description_translations: {
          ru: 'Не упустите нашу самую большую распродажу сезона. Премиальное качество одежды и аксессуаров по непревзойденным ценам.',
          uz: 'Mavsumning eng katta sotilishini o\'tkazib yubormang. Noo\'rin narxlarda premium sifatli kiyim va aksessuarlar.',
          en: 'Don\'t miss our biggest sale of the season. Premium quality clothing and accessories at unbeatable prices.',
          es: 'No te pierdas nuestra mayor venta de la temporada. Ropa y accesorios de calidad premium a precios insuperables.'
        },
        button_text_translations: {
          ru: 'КУПИТЬ СЕЙЧАС',
          uz: 'HOZIR SOTIB OLING',
          en: 'SHOP NOW',
          es: 'COMPRAR AHORA'
        },
        button_link: '/category/women',
        image_url: 'https://images.unsplash.com/photo-1614714053570-6c6b6aa54a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2xvdGhpbmclMjBjYW1wYWlnbiUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzY3MTMxOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        is_active: true
      };
    }
    
    const data = await response.json();
    if (!data.value) {
      return null;
    }
    
    try {
      return JSON.parse(data.value) as PromoBannerData;
    } catch (e) {
      console.error('Error parsing promo banner data:', e);
      return null;
    }
  } catch (error) {
    console.error('Error fetching promo banner data:', error);
    return null;
  }
}

export interface StoreLocationData {
  address_translations: { ru: string; uz: string; en: string; es: string };
  hours_translations: { ru: string; uz: string; en: string; es: string };
  map_latitude: string;
  map_longitude: string;
  map_zoom: string;
}

export async function fetchStoreLocationData(lang: string = 'en'): Promise<StoreLocationData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/site-settings/value/store_location_data`);
    if (!response.ok) {
      // Return default data if setting not found
      return {
        address_translations: {
          ru: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
          uz: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
          en: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
          es: '123 Fashion Avenue\nNew York, NY 10001\nUnited States'
        },
        hours_translations: {
          ru: 'Понедельник - Пятница: 9:00 - 20:00\nСуббота: 10:00 - 18:00\nВоскресенье: 12:00 - 17:00',
          uz: 'Dushanba - Juma: 9:00 - 20:00\nShanba: 10:00 - 18:00\nYakshanba: 12:00 - 17:00',
          en: 'Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 12:00 PM - 5:00 PM',
          es: 'Lunes - Viernes: 9:00 AM - 8:00 PM\nSábado: 10:00 AM - 6:00 PM\nDomingo: 12:00 PM - 5:00 PM'
        },
        map_latitude: '40.75889597932681',
        map_longitude: '-73.98811768459398',
        map_zoom: '15'
      };
    }
    
    const data = await response.json();
    if (!data.value) {
      return null;
    }
    
    try {
      return JSON.parse(data.value) as StoreLocationData;
    } catch (e) {
      console.error('Error parsing store location data:', e);
      return null;
    }
  } catch (error) {
    console.error('Error fetching store location data:', error);
    return null;
  }
}

export interface CreateOrderItem {
  pid?: number;
  productId?: number;
  id?: number;
  variantId?: number;
  variant_id?: number;
  quantity: number;
  price: number;
  sizes?: string;
  selectedSize?: string;
  imageURL?: string;
  paymentMethod?: string;
  address?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  status: number;
  message: string;
  order_id: number;
  user_id: number;
}

export async function createOrder(
  items: CreateOrderItem[],
  address: string,
  paymentMethod: string = 'cash',
  notes: string = ''
): Promise<CreateOrderResponse> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    // Формируем данные заказа в формате, который ожидает backend
    const orderItems = items.map(item => ({
      pid: item.id || item.productId || item.pid,
      variantId: item.variantId || item.variant_id,
      quantity: item.quantity,
      price: item.price,
      sizes: item.size || item.sizes || item.selectedSize,
      imageURL: item.imageUrl || item.imageURL,
      paymentMethod: paymentMethod,
      address: address,
      notes: notes,
    }));

    console.log('📤 [createOrder] Sending order:', {
      items: orderItems,
      address,
      paymentMethod,
    });

    const response = await fetch(`${API_BASE_URL}/order/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderItems),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('❌ [createOrder] Error response:', errorData);
      throw new Error(errorData.detail || `Failed to create order: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ [createOrder] Order created:', result);
    return result;
  } catch (error) {
    console.error('❌ [createOrder] Error creating order:', error);
    throw error;
  }
}
