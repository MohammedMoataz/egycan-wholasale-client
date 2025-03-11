import React from "react";
import { Card, List, Typography, Space, Button, Empty, Tag, Image } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PictureOutlined,
  RightOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { EnhancedCategory, EnhancedSubcategory } from "./AdminCategoriesPage";

const { Text, Title } = Typography;

interface CategoryListProps {
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
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  subcategoriesByCategory,
  expandedCategories,
  toggleCategory,
  openEditCategoryModal,
  openDeleteModal,
  openCreateSubcategoryModal,
  openEditSubcategoryModal,
}) => {
  const renderSubcategories = (categoryId: number) => {
    const subs = subcategoriesByCategory[categoryId] || [];

    return (
      <Card style={{ marginTop: 16, background: "#f9f9f9" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Subcategories</Text>
          {subs.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No subcategories"
              style={{ margin: "16px 0" }}
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={subs}
              renderItem={(subcategory) => (
                <List.Item
                  key={subcategory.id}
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
                      onClick={() =>
                        openDeleteModal("subcategory", subcategory)
                      }
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      subcategory.imageUrl ? (
                        <Image
                          src={subcategory.imageUrl}
                          alt={subcategory.name}
                          width={40}
                          height={40}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                          preview={false}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 4,
                          }}
                        >
                          <PictureOutlined style={{ color: "#aaa" }} />
                        </div>
                      )
                    }
                    title={
                      <Space>
                        <span>{subcategory.name}</span>
                        <Tag color="blue">{subcategory.categoryName}</Tag>
                      </Space>
                    }
                    description={
                      subcategory.description && (
                        <Text type="secondary" ellipsis>
                          {subcategory.description}
                        </Text>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Space>
      </Card>
    );
  };

  return (
    <Card>
      {categories.length === 0 ? (
        <Empty description="No categories found" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={categories}
          renderItem={(category) => (
            <List.Item
              key={category.id}
              actions={[
                <Button
                  key="add-subcategory"
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    category.id !== undefined &&
                    openCreateSubcategoryModal(category.id)
                  }
                >
                  Add Subcategory
                </Button>,
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
              <List.Item.Meta
                avatar={
                  category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={64}
                      height={64}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                      preview={false}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                      }}
                    >
                      <PictureOutlined style={{ color: "#aaa" }} />
                    </div>
                  )
                }
                title={
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      category.id !== undefined && toggleCategory(category.id)
                    }
                  >
                    <Space>
                      {category.id !== undefined &&
                      expandedCategories.includes(category.id) ? (
                        <DownOutlined />
                      ) : (
                        <RightOutlined />
                      )}
                      <Title level={5} style={{ margin: 0 }}>
                        {category.name}
                      </Title>
                    </Space>
                  </div>
                }
                description={
                  category.description && (
                    <Text type="secondary" ellipsis>
                      {category.description}
                    </Text>
                  )
                }
              />
              {category.id !== undefined &&
                expandedCategories.includes(category.id) &&
                renderSubcategories(category.id)}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CategoryList;
