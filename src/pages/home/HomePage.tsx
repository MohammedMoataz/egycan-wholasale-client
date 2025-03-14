import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import { Typography, Spin } from "antd";

// Import the component files we'll create
import HeroCarousel from "./HeroCarousel";
import CategorySection from "./CategorySection";
import ProductSection from "./ProductSection";

const { Title } = Typography;

const HomePage = () => {
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(1, 10),
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 10,
        maxPrice: 1000,
      }),
  });

  const categories = categoriesResponse?.data || [];
  const products = featuredProducts?.data || [];

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Categories Section */}
      <CategorySection categories={categories} />

      {/* Featured Products Section */}
      <ProductSection products={products} />
    </div>
  );
};

export default HomePage;
