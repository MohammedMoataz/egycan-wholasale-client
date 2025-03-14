import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import {
  Layout,
  Typography,
  Button,
  Spin,
  Pagination,
  Row,
  Col,
  message,
  Card,
  Input,
  Divider,
  Empty,
  Avatar,
  List,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { getCategories, getSubcategories } from "../../../api/categories";
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
const { Title, Text } = Typography;

// Subcategories list component
const SubcategoriesList: React.FC<{
  subcategories: EnhancedSubcategory[];
  openEditSubcategoryModal: (subcategory: EnhancedSubcategory) => void;
  openDeleteModal: (
    type: "category" | "subcategory",
    item: EnhancedCategory | EnhancedSubcategory
  ) => void;
  searchQuery: string;
}> = ({
  subcategories,
  openEditSubcategoryModal,
  openDeleteModal,
  searchQuery,
}) => {
  // Filter subcategories based on search query
  const filteredSubcategories = useMemo(
    () =>
      subcategories.filter((sub) =>
        searchQuery
          ? sub.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      ),
    [subcategories, searchQuery]
  );

  if (filteredSubcategories.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No subcategories found"
      />
    );
  }

  return (
    <List
      size="small"
      dataSource={filteredSubcategories}
      renderItem={(subcategory) => (
        <List.Item
          actions={[
            <Button
              key="edit"
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditSubcategoryModal(subcategory)}
            />,
            <Button
              key="delete"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal("subcategory", subcategory)}
            />,
          ]}
        >
          <List.Item.Meta
            avatar={
              subcategory.imageUrl ? (
                <Avatar src={subcategory.imageUrl} />
              ) : (
                <Avatar icon={<PictureOutlined />} />
              )
            }
            title={subcategory.name}
            description={subcategory.description}
          />
        </List.Item>
      )}
    />
  );
};

// Categories grid component
const CategoriesGrid: React.FC<{
  categories: EnhancedCategory[];
  subcategoriesByCategory: Record<number, EnhancedSubcategory[]>;
  expandedCategories: number[];
  toggleCategory: (categoryId: number) => void;
  openEditCategoryModal: (category: EnhancedCategory) => void;
  openDeleteModal: (
    type: "category" | "subcategory",
    item: EnhancedCategory | EnhancedSubcategory
  ) => void;
  openCreateSubcategoryModal: (categoryId: number) => void;
  openEditSubcategoryModal: (subcategory: EnhancedSubcategory) => void;
  searchQuery: string;
}> = ({
  categories,
  subcategoriesByCategory,
  expandedCategories,
  toggleCategory,
  openEditCategoryModal,
  openDeleteModal,
  openCreateSubcategoryModal,
  openEditSubcategoryModal,
  searchQuery,
}) => {
  // Filter categories based on search query
  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) =>
        searchQuery
          ? cat.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      ),
    [categories, searchQuery]
  );

  if (filteredCategories.length === 0) {
    return <Empty description="No categories found" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {filteredCategories.map((category) => (
        <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
          <Card
            hoverable
            style={{ overflow: "hidden" }}
            cover={
              category.imageUrl ? (
                <img
                  alt={category.name}
                  src={category.imageUrl}
                  style={{ height: 160, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: 160,
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PictureOutlined style={{ fontSize: 48, color: "#aaa" }} />
                </div>
              )
            }
            actions={[
              <Button
                key="expand"
                type="text"
                icon={
                  expandedCategories.includes(category.id!) ? (
                    <DownOutlined />
                  ) : (
                    <RightOutlined />
                  )
                }
                onClick={() => toggleCategory(category.id!)}
              />,
              <Button
                key="add"
                type="text"
                icon={<PlusOutlined />}
                onClick={() => openCreateSubcategoryModal(category.id!)}
              />,
              <Button
                key="edit"
                type="text"
                icon={<EditOutlined />}
                onClick={() => openEditCategoryModal(category)}
              />,
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => openDeleteModal("category", category)}
              />,
            ]}
          >
            <Card.Meta
              title={category.name}
              description={
                category.description ? (
                  <Text type="secondary" ellipsis>
                    {category.description}
                  </Text>
                ) : (
                  <Text type="secondary" italic>
                    No description
                  </Text>
                )
              }
            />

            {expandedCategories.includes(category.id!) && (
              <div style={{ marginTop: 16 }}>
                <Divider plain>Subcategories</Divider>
                <SubcategoriesList
                  subcategories={subcategoriesByCategory[category.id!] || []}
                  openEditSubcategoryModal={openEditSubcategoryModal}
                  openDeleteModal={openDeleteModal}
                  searchQuery={searchQuery}
                />
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

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
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Increased for grid layout

  // Fetch categories with pagination
  const { data: allCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", currentPage, pageSize],
    queryFn: () => getCategories(currentPage, pageSize),
  });

  const categories: Category[] = allCategories?.data || [];
  const meta: Meta = allCategories?.meta;
  const totalItems = meta?.totalNoOfData || 0;

  // Use useQueries to properly fetch subcategories for all expanded categories
  const subcategoryQueries = useQueries({
    queries: expandedCategories.map((categoryId) => ({
      queryKey: ["subcategories", categoryId],
      queryFn: () => getSubcategories(categoryId),
      enabled: expandedCategories.includes(categoryId),
    })),
  });

  // Process subcategory data
  const subcategoriesByCategory = useMemo(() => {
    const result: Record<number, EnhancedSubcategory[]> = {};

    subcategoryQueries.forEach((query, index) => {
      const categoryId = expandedCategories[index];
      if (query.data?.data && categoryId) {
        result[categoryId] = query.data.data.map((sub) => ({
          ...sub,
          categoryName:
            categories.find((cat) => cat.id === categoryId)?.name ||
            "Unknown Category",
        }));
      }
    });

    return result;
  }, [subcategoryQueries, expandedCategories, categories]);

  const toggleCategory = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      // Remove from expanded categories
      setExpandedCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      // Add to expanded categories
      setExpandedCategories((prev) => [...prev, categoryId]);
      // Prefetch can be called inside a callback, it's not a hook
      queryClient.prefetchQuery({
        queryKey: ["subcategories", categoryId],
        queryFn: () => getSubcategories(categoryId),
      });
    }
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
    // Only invalidate the specific subcategory query
    if (selectedCategoryId) {
      queryClient.invalidateQueries({
        queryKey: ["subcategories", selectedCategoryId],
      });
    }
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
      // Also remove from expanded categories
      if (currentCategory) {
        setExpandedCategories((prev) =>
          prev.filter((id) => id !== currentCategory.id)
        );
      }
      message.success("Category deleted successfully");
    } else {
      // Only invalidate the specific subcategory query
      if (currentSubcategory) {
        queryClient.invalidateQueries({
          queryKey: ["subcategories", currentSubcategory.categoryId],
        });
      }
      message.success("Subcategory deleted successfully");
    }
    setIsDeleteModalOpen(false);
  };

  // Show loading state if categories or any expanded subcategories are loading
  const isLoading =
    categoriesLoading || subcategoryQueries.some((query) => query.isLoading);

  return (
    <Content style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Categories & Subcategories</Title>
        </Col>
        <Col flex="auto" style={{ margin: "0 24px" }}>
          <Input.Search
            placeholder="Search categories..."
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%" }}
          />
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

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <CategoriesGrid
            categories={categories as EnhancedCategory[]}
            subcategoriesByCategory={subcategoriesByCategory}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            openEditCategoryModal={openEditCategoryModal}
            openDeleteModal={openDeleteModal}
            openCreateSubcategoryModal={openCreateSubcategoryModal}
            openEditSubcategoryModal={openEditSubcategoryModal}
            searchQuery={searchQuery}
          />

          {totalItems > pageSize && (
            <Row justify="end" style={{ marginTop: 24 }}>
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
