import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Layout,
  Typography,
  Button,
  Spin,
  Pagination,
  Row,
  Col,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getCategories, getAllSubcategories } from "../../../api/categories";
import CategoryList from "./CategoryList";
import CategoryModal from "./CategoryModal";
import SubcategoryModal from "./SubcategoryModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Category, Meta, Subcategory } from "../../../types";

// Update types to include the new fields
export interface EnhancedCategory extends Category {
  description: string;
  imageUrl: string;
}

export interface EnhancedSubcategory extends Subcategory {
  description: string;
  imageUrl: string;
  categoryName?: string;
}

const { Content } = Layout;
const { Title } = Typography;

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<EnhancedCategory | null>(null);
  const [currentSubcategory, setCurrentSubcategory] =
    useState<EnhancedSubcategory | null>(null);
  const [deleteType, setDeleteType] = useState<"category" | "subcategory">(
    "category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of categories per page

  // Fetch categories with pagination
  const { data: allCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", currentPage, pageSize],
    queryFn: () => getCategories(currentPage, pageSize),
  });

  const categories: Category[] = allCategories?.data || [];
  const meta: Meta = allCategories?.meta || { totalNoOfPages: 0 };
  const totalItems = meta?.totalNoOfData || 0;

  // Fetch subcategories
  const { data: allSubcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["allSubcategories"],
    queryFn: () => getAllSubcategories(),
  });

  const subcategories: Subcategory[] = allSubcategories?.data || [];

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const openCreateCategoryModal = () => {
    setCurrentCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: EnhancedCategory) => {
    setCurrentCategory(category);
    setIsCategoryModalOpen(true);
  };

  const openCreateSubcategoryModal = (categoryId: number) => {
    setCurrentSubcategory(null);
    setSelectedCategoryId(categoryId);
    setIsSubcategoryModalOpen(true);
  };

  const openEditSubcategoryModal = (subcategory: EnhancedSubcategory) => {
    setCurrentSubcategory(subcategory);
    setSelectedCategoryId(subcategory.categoryId);
    setIsSubcategoryModalOpen(true);
  };

  const openDeleteModal = (
    type: "category" | "subcategory",
    item: EnhancedCategory | EnhancedSubcategory
  ) => {
    setDeleteType(type);
    if (type === "category") {
      setCurrentCategory(item as EnhancedCategory);
      setCurrentSubcategory(null);
    } else {
      setCurrentSubcategory(item as EnhancedSubcategory);
      setCurrentCategory(null);
    }
    setIsDeleteModalOpen(true);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const onCategorySuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setIsCategoryModalOpen(false);
    message.success(
      currentCategory
        ? "Category updated successfully"
        : "Category created successfully"
    );
  };

  const onSubcategorySuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["allSubcategories"] });
    setIsSubcategoryModalOpen(false);
    message.success(
      currentSubcategory
        ? "Subcategory updated successfully"
        : "Subcategory created successfully"
    );
  };

  const onDeleteSuccess = () => {
    if (deleteType === "category") {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["allSubcategories"] });
      message.success("Category deleted successfully");
    } else {
      queryClient.invalidateQueries({ queryKey: ["allSubcategories"] });
      message.success("Subcategory deleted successfully");
    }
    setIsDeleteModalOpen(false);
  };

  // Group subcategories by category and attach category names
  const enhancedSubcategories =
    subcategories?.map((subcategory) => {
      const parentCategory = categories.find(
        (cat) => cat.id === subcategory.categoryId
      );
      return {
        ...subcategory,
        categoryName: parentCategory?.name || "Unknown Category",
      };
    }) || [];

  const subcategoriesByCategory = enhancedSubcategories.reduce(
    (acc, subcategory) => {
      if (!acc[subcategory.categoryId]) {
        acc[subcategory.categoryId] = [];
      }
      acc[subcategory.categoryId].push(subcategory);
      return acc;
    },
    {} as Record<number, EnhancedSubcategory[]>
  );

  return (
    <Content style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Categories & Subcategories</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateCategoryModal}
          >
            Add Category
          </Button>
        </Col>
      </Row>

      {categoriesLoading || subcategoriesLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <CategoryList
            categories={categories as EnhancedCategory[]}
            subcategoriesByCategory={subcategoriesByCategory}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            openEditCategoryModal={openEditCategoryModal}
            openDeleteModal={openDeleteModal}
            openCreateSubcategoryModal={openCreateSubcategoryModal}
            openEditSubcategoryModal={openEditSubcategoryModal}
          />

          {totalItems > pageSize && (
            <Row justify="end" style={{ marginTop: 16 }}>
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={handleChangePage}
              />
            </Row>
          )}
        </>
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={currentCategory}
        onSuccess={onCategorySuccess}
      />

      <SubcategoryModal
        isOpen={isSubcategoryModalOpen}
        onClose={() => setIsSubcategoryModalOpen(false)}
        subcategory={currentSubcategory}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSuccess={onSubcategorySuccess}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        type={deleteType}
        itemToDelete={
          deleteType === "category" ? currentCategory : currentSubcategory
        }
        onSuccess={onDeleteSuccess}
      />
    </Content>
  );
};

export default AdminCategoriesPage;
