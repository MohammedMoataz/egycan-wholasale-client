// src/contexts/CategoriesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { message } from "antd";
import { Category } from "../types";
import {
  getCategories as fetchCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "../api/categories";

interface CategoriesContextProps {
  categories: Category[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  selectedCategory: Category | null;
  modalVisible: boolean;
  openCreateModal: () => void;
  openEditModal: (category: Category) => void;
  closeModal: () => void;
  createCategory: (categoryData: any) => Promise<void>;
  updateCategory: (id: string, categoryData: any) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextProps | undefined>(
  undefined
);

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    refreshCategories();
  }, []);

  const refreshCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCategories(1, 10);
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories. Please try again later.");
      message.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedCategory(null);
    setModalVisible(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const createCategory = async (categoryData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiCreateCategory(categoryData);
      message.success("Category created successfully");
      await refreshCategories();
      closeModal();
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category. Please try again later.");
      message.error("Failed to create category");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategory = async (id: string, categoryData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiUpdateCategory(id, categoryData);
      message.success("Category updated successfully");
      await refreshCategories();
      closeModal();
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category. Please try again later.");
      message.error("Failed to update category");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiDeleteCategory(id);
      message.success("Category deleted successfully");
      await refreshCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category. Please try again later.");
      message.error("Failed to delete category");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    categories,
    isLoading,
    isSubmitting,
    error,
    selectedCategory,
    modalVisible,
    openCreateModal,
    openEditModal,
    closeModal,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextProps => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};
