import React, { useState } from "react";
import { Card, Select, Button, InputNumber, Space, Drawer, Form } from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getSubcategories } from "../../api/categories";
import { getBrands } from "../../api/brands";
import { ProductFilters } from "../../types";

interface ProductsFilterProps {
  filters: ProductFilters;
  onFilterChange: (key: string, value: string | null) => void;
  onClearFilters: () => void;
}

const { Option } = Select;

const ProductsFilter: React.FC<ProductsFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch categories for filters
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(1, 100),
  });
  const categories = categoriesResponse?.data;

  // Fetch subcategories based on selected category
  const { data: subcategoriesResponse } = useQuery({
    queryKey: ["subcategories", filters.categoryId],
    queryFn: () => getSubcategories(filters.categoryId!),
    enabled: !!filters.categoryId,
  });
  const subcategories = subcategoriesResponse?.data;

  // Fetch brands for filters
  const { data: brandsResponse } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(1, 100),
  });
  const brands = brandsResponse?.data;

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== 1 && value !== 10
  );

  // Reset form values when filters are cleared
  React.useEffect(() => {
    if (!hasActiveFilters) {
      form.resetFields();
    }
  }, [hasActiveFilters, form]);

  const filterContent = (
    <Form form={form} layout="vertical" initialValues={filters}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={() => {
              onClearFilters();
              form.resetFields();
            }}
            size="small"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <Form.Item label="Category" name="categoryId">
        <Select
          value={filters.categoryId?.toString() || undefined}
          onChange={(value) => onFilterChange("categoryId", value)}
          placeholder="All Categories"
          allowClear
          style={{ width: "100%" }}
        >
          {Array.isArray(categories) &&
            categories?.map((category) => (
              <Option key={category.id} value={category.id!.toString()}>
                {category.name}
              </Option>
            ))}
        </Select>
      </Form.Item>

      {/* Subcategory Filter */}
      {filters.categoryId && subcategories && (
        <Form.Item label="Subcategory" name="subcategoryId">
          <Select
            value={filters.subcategoryId?.toString() || undefined}
            onChange={(value) => onFilterChange("subcategoryId", value)}
            placeholder="All Subcategories"
            allowClear
            style={{ width: "100%" }}
          >
            {Array.isArray(subcategories) &&
              subcategories.map((subcategory) => (
                <Option key={subcategory.id} value={subcategory.id!.toString()}>
                  {subcategory.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      )}

      {/* Brand Filter */}
      <Form.Item label="Brand" name="brandId">
        <Select
          value={filters.brandId?.toString() || undefined}
          onChange={(value) => onFilterChange("brandId", value)}
          placeholder="All Brands"
          allowClear
          style={{ width: "100%" }}
        >
          {Array.isArray(brands) &&
            brands?.map((brand) => (
              <Option key={brand.id} value={brand.id!.toString()}>
                {brand.name}
              </Option>
            ))}
        </Select>
      </Form.Item>

      {/* Price Range Filter */}
      <Form.Item label="Price Range">
        <Space className="w-full">
          <InputNumber
            placeholder="Min"
            value={filters.minPrice}
            onChange={(value) =>
              onFilterChange("minPrice", value ? value.toString() : null)
            }
            min={0}
            style={{ width: "100%" }}
          />
          <span>-</span>
          <InputNumber
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(value) =>
              onFilterChange("maxPrice", value ? value.toString() : null)
            }
            min={0}
            style={{ width: "100%" }}
          />
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setIsMobileDrawerOpen(true)}
          block
        >
          Filters
        </Button>

        {/* Mobile Filters (Drawer) */}
        <Drawer
          title="Product Filters"
          placement="left"
          onClose={() => setIsMobileDrawerOpen(false)}
          open={isMobileDrawerOpen}
          width={300}
        >
          {filterContent}
        </Drawer>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block w-full md:w-1/4">
        <Card>{filterContent}</Card>
      </div>
    </>
  );
};

export default ProductsFilter;
