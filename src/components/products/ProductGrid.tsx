import React from "react";
import { Row, Col } from "antd";
import { Product } from "../../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
  onAddToCart,
}) => {
  return (
    <Row gutter={[16, 24]}>
      {products.map((product) => (
        <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
          <ProductCard
            product={product}
            onClick={() => onProductClick(product)}
            onAddToCart={(quantity) => onAddToCart(product, quantity)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
