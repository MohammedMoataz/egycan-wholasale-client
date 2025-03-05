import React, { useState } from "react";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { Product } from "../../types";

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : null
  );

  if (!isOpen) return null;

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg h-80 mb-4 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className={`h-16 w-16 rounded-md cursor-pointer border-2 ${
                      selectedImage === image.imageUrl
                        ? "border-indigo-600"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image.imageUrl)}
                  >
                    <img
                      src={image.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-indigo-600 mr-4">
                ${product.price.toFixed(2)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  product.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? `In Stock` : "Out of Stock"}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Brand:</span>{" "}
                {product.brand?.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Category:</span>{" "}
                {product.category?.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Subcategory:</span>{" "}
                {product.subcategory?.name}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {product.inStock && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="mr-4">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      disabled={product.inStock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
