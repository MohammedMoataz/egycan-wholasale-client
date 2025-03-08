export interface Meta {
  totalNoOfPages: number;
  totalNoOfData: number;
  currentPage: number;
  pageSize: number;
}

export interface ResponseData<T> {
  data: T[];
  meta: Meta;
}

// User Types
export interface User {
  id?: number;
  name: string;
  email: string;
  role: 'customer' | 'manager' | 'admin';
  status: 'pending' | 'active' | 'rejected';
  phoneNumber: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  registrationNumber?: string;
  taxId?: string;
  businessAddress?: string;
  website?: string;
  businessType?: string;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
}

// Registration Types
export interface PersonalInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface BusinessInfo {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  registrationNumber: string;
  taxId: string;
  businessAddress: string;
  website: string;
  businessType: string;
  document?: File;
}

// Product Types
export interface Category {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  subcategories: Subcategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  id?: number;
  name: string;
  categoryId: number;
  category?: Category;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandFormData {
  name: string;
  description: string;
  imageFile: File | null;
}

export interface ProductImage {
  id?: number;
  productId: number;
  imageUrl: string;
  createdAt?: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  categoryId: number;
  subcategoryId: number;
  brandId: number;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  subcategory?: Subcategory;
  brand?: Brand;
  images?: ProductImage[];
}

// Cart Types
export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
}

// Invoice Types
export interface InvoiceItem {
  id?: number;
  invoiceId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  createdAt?: string;
}

export interface Invoice {
  id?: number;
  userId: number;
  user?: User;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  pdfUrl: string;
  createdAt?: string;
  updatedAt?: string;
  items?: InvoiceItem[];
}


export interface BrandResponse {
  success: boolean;
  data: ResponseData<Brand> | Brand
}

export interface CategoryResponse {
  success: boolean;
  data: ResponseData<Category> | Category
}

export interface SubcategoryResponse {
  success: boolean;
  data: ResponseData<Subcategory> | Subcategory
}

export interface ProductResponse {
  success: boolean;
  data: ResponseData<Product> | Product | Product[]
}


// Filter Types
export interface ProductFilters {
  page: number;
  limit: number;
  categoryId?: number;
  subcategoryId?: number;
  brandId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}
