import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Filter, X } from "lucide-react";
import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { getSubcategories } from "../api/categories";
import { getBrands } from "../api/brands";
import { useCartStore } from "../store/cartStore";
import ProductCard from "../components/products/ProductCard";
import ProductModal from "../components/products/ProductModal";
import { Product, ProductFilters } from "../types";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();

  // Get filters from URL
  const filters: ProductFilters = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
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

  // Fetch categories, subcategories, and brands for filters
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(1, 10),
  });
  const categories = categoriesResponse?.data;

  const { data: subcategoriesResponse } = useQuery({
    queryKey: ["subcategories", filters.categoryId],
    queryFn: () => getSubcategories(filters.categoryId!),
    enabled: !!filters.categoryId,
  });
  const subcategories = subcategoriesResponse?.data;

  const { data: brandsResponse } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(1, 10),
  });
  const brands = brandsResponse?.data;

  // Open modal if product ID is in URL
  useEffect(() => {
    if (productId && products) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    }
  }, [productId, products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Update URL with product ID
    if (product.id !== undefined) {
      searchParams.set("id", product.id.toString());
    }
    setSearchParams(searchParams);
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
    toast.success(`${product.name} added to cart!`);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    searchParams.delete("id"); // Reset product ID when changing filters
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Mobile Filter Toggle */}
        <div className="w-full md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg"
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filters Sidebar */}
        <div
          className={`w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            {Object.values(filters).some((v) => v !== undefined) && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) =>
                handleFilterChange("categoryId", e.target.value || null)
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) &&
                categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          {filters.categoryId && subcategories && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                value={filters.subcategoryId || ""}
                onChange={(e) =>
                  handleFilterChange("subcategoryId", e.target.value || null)
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Subcategories</option>
                {Array.isArray(subcategories) &&
                  subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Brand Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              value={filters.brandId || ""}
              onChange={(e) =>
                handleFilterChange("brandId", e.target.value || null)
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Brands</option>
              {Array.isArray(brands) &&
                brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange("minPrice", e.target.value || null)
                }
                className="w-1/2 p-2 border rounded-md"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange("maxPrice", e.target.value || null)
                }
                className="w-1/2 p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(products) &&
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                    onAddToCart={(quantity) =>
                      handleAddToCart(product, quantity)
                    }
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No products found</p>
              <button
                onClick={clearFilters}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
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

export default ProductsPage;
