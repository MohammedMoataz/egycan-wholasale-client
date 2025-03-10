import React from "react";
import { Empty, Spin, Button, Pagination, List } from "antd";
import { Product } from "../../types";
import ProductCard from "./ProductCard";

interface ProductsListProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onProductClick: (product: Product) => void;
  onClearFilters: () => void;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  isLoading,
  onProductClick,
  onClearFilters,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="w-full md:w-3/4 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full md:w-3/4">
        <Empty
          description="No products found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        dataSource={products}
        renderItem={(product) => (
          <List.Item>
            {/* <LazyLoad
              height={300}
              once
              placeholder={
                <div className="h-64 bg-gray-100 flex items-center justify-center">
                  <Spin />
                </div>
              }
            > */}
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
            />
            {/* </LazyLoad> */}
          </List.Item>
        )}
      />

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={onPageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} products`}
        />
      </div>
    </div>
  );
};

export default ProductsList;
