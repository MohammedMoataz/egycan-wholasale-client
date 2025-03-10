import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { notification, Layout } from "antd";
import { getProducts } from "../../api/products";
import { useCartStore } from "../../store/cartStore";
import { Product, ProductFilters } from "../../types";
import ProductsFilter from "./ProductsFilter";
import ProductsList from "./ProductsList";
import ProductDetailModal from "./ProductDetailModal";

const { Content } = Layout;

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  // Mock auth state (replace with your auth logic)
  const isAuthenticated = true; // Replace with your actual auth check

  // Get filters from URL
  const filters: ProductFilters = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12, // Increased default limit
    categoryId: searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : undefined,
    subcategoryId: searchParams.get("subcategoryId")
      ? Number(searchParams.get("subcategoryId"))
      : undefined,
    brandId: searchParams.get("brandId")
      ? Number(searchParams.get("brandId"))
      : undefined,
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  };

  // Check if a specific product ID is requested
  const productId = searchParams.get("id")
    ? Number(searchParams.get("id"))
    : undefined;

  // Fetch products
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });
  const products = productsResponse?.data;
  const meta = productsResponse?.meta;

  // Open modal if product ID is in URL
  useEffect(() => {
    if (productId && products) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        if (isAuthenticated) {
          setSelectedProduct(product);
          setIsModalOpen(true);
        } else {
          notification.info({
            message: "Authentication Required",
            description: "Please login to view product details",
            placement: "topRight",
          });
          navigate("/login");
        }
      }
    }
  }, [productId, products, isAuthenticated, navigate]);

  const handleProductClick = (product: Product) => {
    if (isAuthenticated) {
      setSelectedProduct(product);
      setIsModalOpen(true);
      // Update URL with product ID
      if (product.id !== undefined) {
        searchParams.set("id", product.id.toString());
      }
      setSearchParams(searchParams);
    } else {
      notification.info({
        message: "Authentication Required",
        description: "Please login to view product details",
        placement: "topRight",
      });
      navigate("/login");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // Remove product ID from URL
    searchParams.delete("id");
    setSearchParams(searchParams);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);
    notification.success({
      message: "Added to Cart",
      description: `${product.name} added to cart!`,
      placement: "topRight",
    });
  };

  const handleFilterChange = (key: string, value: string | null) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    // Reset to page 1 when filters change
    searchParams.set("page", "1");
    searchParams.delete("id"); // Reset product ID when changing filters
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    // Keep the page size (limit) when clearing filters
    const limit = searchParams.get("limit") || "12";
    setSearchParams({ limit });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    searchParams.set("page", page.toString());
    searchParams.set("limit", pageSize.toString());
    setSearchParams(searchParams);
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Component */}
          <ProductsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          {/* Products List Component */}
          <ProductsList
            products={products}
            isLoading={productsLoading}
            onProductClick={handleProductClick}
            onClearFilters={clearFilters}
            totalItems={meta?.totalNoOfData || 0}
            currentPage={filters.page || 1}
            pageSize={filters.limit || 12}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddToCart={(quantity) => {
              if (selectedProduct) {
                handleAddToCart(selectedProduct, quantity);
              }
            }}
            isAuthenticated={isAuthenticated}
          />
        )}
      </Content>
    </Layout>
  );
};

export default ProductsPage;
