// src/contexts/ProductsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { message } from "antd";
import { Product } from "../types";
import {
  getProducts as fetchProducts,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from "../api/products";

interface ProductsContextProps {
  products: Product[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  formModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedProduct: Product | null;
  filters: {
    page: number;
    limit: number;
    category?: string;
    brand?: string;
    search?: string;
  };
  setFilters: (filters: any) => void;
  openCreateModal: () => void;
  openEditModal: (product: Product) => void;
  closeFormModal: () => void;
  openDeleteModal: (product: Product) => void;
  closeDeleteModal: () => void;
  createProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, productData: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(
  undefined
);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [formModalVisible, setFormModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  // Fetch products on mount and whenever filters change
  useEffect(() => {
    refreshProducts();
  }, [filters]);

  // Filter products by search term
  useEffect(() => {
    // Debounce search to avoid too many requests
    const timerId = setTimeout(() => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        search: searchTerm,
        page: 1, // Reset to first page when searching
      }));
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const refreshProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(filters);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
      message.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setFormModalVisible(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormModalVisible(true);
  };

  const closeFormModal = () => {
    setFormModalVisible(false);
    setSelectedProduct(null);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedProduct(null);
  };

  const createProduct = async (productData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiCreateProduct(productData);
      message.success("Product created successfully");
      await refreshProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product. Please try again later.");
      message.error("Failed to create product");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiUpdateProduct(id, productData);
      message.success("Product updated successfully");
      await refreshProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again later.");
      message.error("Failed to update product");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      await apiDeleteProduct(id);
      message.success("Product deleted successfully");
      await refreshProducts();
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again later.");
      message.error("Failed to delete product");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const value = {
    products,
    isLoading,
    isSubmitting,
    isDeleting,
    error,
    searchTerm,
    setSearchTerm,
    formModalVisible,
    deleteModalVisible,
    selectedProduct,
    filters,
    setFilters,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (): ProductsContextProps => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
