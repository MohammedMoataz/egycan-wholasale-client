// src/contexts/BrandsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { message } from "antd";
import { Brand } from "../types";
import {
  getBrands as fetchBrands,
  createBrand as apiCreateBrand,
  updateBrand as apiUpdateBrand,
  deleteBrand as apiDeleteBrand,
} from "../api/brands";

interface BrandsContextProps {
  brands: Brand[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  selectedBrand: Brand | null;
  modalVisible: boolean;
  openCreateModal: () => void;
  openEditModal: (brand: Brand) => void;
  closeModal: () => void;
  createBrand: (brandData: any) => Promise<void>;
  updateBrand: (id: string, brandData: any) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  refreshBrands: () => Promise<void>;
}

const BrandsContext = createContext<BrandsContextProps | undefined>(undefined);

export const BrandsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    refreshBrands();
  }, []);

  const refreshBrands = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBrands(1, 10);
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to fetch brands. Please try again later.");
      message.error("Failed to fetch brands");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedBrand(null);
    setModalVisible(true);
  };

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBrand(null);
  };

  const createBrand = async (brandData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiCreateBrand(brandData);
      message.success("Brand created successfully");
      await refreshBrands();
      closeModal();
    } catch (err) {
      console.error("Error creating brand:", err);
      setError("Failed to create brand. Please try again later.");
      message.error("Failed to create brand");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBrand = async (id: string, brandData: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiUpdateBrand(id, brandData);
      message.success("Brand updated successfully");
      await refreshBrands();
      closeModal();
    } catch (err) {
      console.error("Error updating brand:", err);
      setError("Failed to update brand. Please try again later.");
      message.error("Failed to update brand");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBrand = async (id: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await apiDeleteBrand(id);
      message.success("Brand deleted successfully");
      await refreshBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
      setError("Failed to delete brand. Please try again later.");
      message.error("Failed to delete brand");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    brands,
    isLoading,
    isSubmitting,
    error,
    selectedBrand,
    modalVisible,
    openCreateModal,
    openEditModal,
    closeModal,
    createBrand,
    updateBrand,
    deleteBrand,
    refreshBrands,
  };

  return (
    <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
  );
};

export const useBrands = (): BrandsContextProps => {
  const context = useContext(BrandsContext);
  if (context === undefined) {
    throw new Error("useBrands must be used within a BrandsProvider");
  }
  return context;
};
