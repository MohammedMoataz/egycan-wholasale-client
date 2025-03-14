export interface ResponseData<T> {
  data: T[];
  meta: Meta;
}

export interface Meta {
  totalNoOfPages: number;
  totalNoOfData: number;
  currentPage: number;
  pageSize: number;
}

export interface LoginFormData {
  email: string;
  password: string;
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
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface BusinessInfo {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  imageUrl: string | null;
  role: 'customer' | 'admin' | string;
}

export interface UpdateProfileData {
  name: string;
  phone: string;
  imageUrl?: string | null;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// export interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// export interface User {
//   id?: number;
//   name: string;
//   email: string;
//   role: 'customer' | 'manager' | 'admin';
//   status: 'pending' | 'active' | 'rejected';
//   phone: string;
//   businessName?: string;
//   businessEmail?: string;
//   businessPhone?: string;
//   registrationNumber?: string;
//   taxId?: string;
//   businessAddress?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface Business {
  id: number;
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  status: 'accepted' | 'pending' | 'rejected';
  ownerId: number;
  createdAt: string;
  owner: {
    id: number;
    name: string;
    email: string;
    imageUrl: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
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

export interface UserResponse {
  success: boolean;
  data: ResponseData<User> | User | User[]
}

export interface BusinessResponse {
  success: boolean;
  data: ResponseData<Business> | Business | Business[]
}

export interface InvoiceResponse {
  success: boolean;
  data: ResponseData<Invoice> | Invoice | Invoice[]
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
