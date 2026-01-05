const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.libertywear.uz';

export interface Category {
  id: number;
  title: string;
  slug: string;
  subcategories?: Category[];
  gender?: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
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
    // First try to get by slug
    const allCategories = await fetchCategories(lang);
    const category = findCategoryBySlug(allCategories, slug);
    return category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

function findCategoryBySlug(categories: Category[], slug: string): Category | null {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return cat;
    }
    if (cat.subcategories) {
      const found = findCategoryBySlug(cat.subcategories, slug);
      if (found) return found;
    }
  }
  return null;
}

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  category_id?: number;
  itemGender?: string;
  itemCategory?: string;
  lang?: string;
}): Promise<{ products: Product[]; total: number }> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params.itemGender) queryParams.append('itemGender', params.itemGender);
    if (params.itemCategory) queryParams.append('itemCategory', params.itemCategory);
    if (params.lang) queryParams.append('lang', params.lang);

    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return {
      products: data.products || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
}

export async function fetchProductById(id: number, lang: string = 'en'): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
