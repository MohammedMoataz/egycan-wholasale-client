import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBrand } from "../api/brands";
import { getProducts } from "../api/products";
import { ArrowLeft } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import ProductModal from "../components/products/ProductModal";
import { useCartStore } from "../store/cartStore";
import { toast } from "react-hot-toast";
import { Product } from "../types";

const BrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { addItem } = useCartStore();

  const brandIdNum = parseInt(brandId || "0", 10);

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand", brandIdNum],
    queryFn: () => getBrand(brandIdNum),
    enabled: !!brandIdNum,
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ["products", { brandId: brandIdNum }],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 10,
        brandId: brandIdNum,
      }),
    enabled: !!brandIdNum,
  });

  const products = productsResponse?.data;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (brandLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Brand not found
        </h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <p className="text-gray-600 mt-2">
          Browse all products from {brand.name}
        </p>
      </div>

      {/* Products */}
      <div>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
                onAddToCart={(quantity) => handleAddToCart(product, quantity)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products found for this brand</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={(quantity) => handleAddToCart(selectedProduct, quantity)}
        />
      )}
    </div>
  );
};

export default BrandPage;
