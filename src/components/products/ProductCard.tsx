import React, { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: (quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    setQuantity(newQuantity);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showQuantity) {
      onAddToCart(quantity);
      setShowQuantity(false);
      setQuantity(quantity + 1);
    } else {
      setShowQuantity(true);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 bg-gray-200">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0].imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {product.brand?.name}
          {product.category && ` • ${product.category.name}`}
        </p>

        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <span
            className={`text-sm ${
              product.inStock ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.inStock ? `in stock` : "Out of Stock"}
          </span>
        </div>

        {product.inStock && (
          <div onClick={(e) => e.stopPropagation()} className="mt-3">
            {showQuantity ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center border rounded-l-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-r-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
              >
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
