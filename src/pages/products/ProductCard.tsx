import React from "react";
import { Card, Typography, Carousel } from "antd";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const { Title, Text } = Typography;

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  // Card cover (images carousel or placeholder)
  const cardCover =
    product.images && product.images.length > 0 ? (
      <div className="h-48 overflow-hidden">
        {/* <LazyLoad
          height={192}
          once
          placeholder={
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <Text type="secondary">Loading...</Text>
            </div>
          }
        > */}
        <Carousel autoplay>
          {product.images.map((image) => (
            <div key={image.id}>
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={image.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </Carousel>
        {/* </LazyLoad> */}
      </div>
    ) : (
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <Text type="secondary">No image</Text>
      </div>
    );

  return (
    <Card
      hoverable
      cover={cardCover}
      className="h-full flex flex-col"
      onClick={onClick}
    >
      <Title level={5} className="mb-1 line-clamp-2" title={product.name}>
        {product.name}
      </Title>

      <div className="text-xs text-gray-500 mb-2">
        {product.category?.name}
        {product.subcategory && ` > ${product.subcategory.name}`}
      </div>

      <div className="text-xs text-gray-500 mb-2">{product.brand?.name}</div>
    </Card>
  );
};

export default ProductCard;
