import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { getProducts } from "../api/products";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Hero Carousel Data (will be replaced by actual products)
const heroCarouselItems = [
  {
    title: "Shop the Latest Products",
    description:
      "Discover amazing products at unbeatable prices. Shop now and enjoy fast shipping!",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    backgroundColor: "bg-teal-700",
  },
  {
    title: "Summer Sale Extravaganza",
    description: "Massive discounts on top brands. Limited time offer!",
    image:
      "https://images.unsplash.com/photo-1553531889-56cc480ac5cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundColor: "bg-emerald-700",
  },
  {
    title: "New Season, New Styles",
    description: "Explore our latest collection and refresh your wardrobe!",
    image:
      "https://images.unsplash.com/photo-1713646778050-2213b4140e6b?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundColor: "bg-cyan-700",
  },
];

const HomePage: React.FC = () => {
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

  const categories = categoriesResponse?.data;
  const products = featuredProducts?.data;

  // Custom arrow components for Slider
  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute z-10 top-1/2 left-4 -translate-y-1/2 bg-white/50 hover:bg-white/75 rounded-full p-2"
      >
        <ChevronLeft className="text-gray-800" />
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute z-10 top-1/2 right-4 -translate-y-1/2 bg-white/50 hover:bg-white/75 rounded-full p-2"
      >
        <ChevronRight className="text-gray-800" />
      </button>
    );
  };

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    dotsClass: "slick-dots custom-dot-class",
    customPaging: () => (
      <div className="h-2 w-2 bg-white/50 rounded-full mx-1 group-hover:bg-white/75"></div>
    ),
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Carousel Section */}
      <section className="mb-12">
        <Slider {...carouselSettings}>
          {heroCarouselItems.map((item, index) => (
            <div key={index} className="relative h-[600px] w-full">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-60"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
                <div className="text-white max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {item.title}
                  </h1>
                  <p className="text-lg mb-6 text-gray-200">
                    {item.description}
                  </p>
                  <Link
                    to="/products"
                    className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-gray-100 transition"
                  >
                    Shop Now
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Categories Section */}
      <section className="mb-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Shop by Category</h2>
          <Link
            to="/products"
            className="text-blue-100 hover:text-blue-800 flex items-center"
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-2"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <img
                  src={`https://source.unsplash.com/random/300x200/?${category.name.toLowerCase()}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-blue-50">
                <h3 className="font-semibold text-lg text-blue-800">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              to={`/products?id=${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-2"
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
              <div className="p-4 bg-blue-50">
                <h3 className="font-semibold text-lg mb-1 text-blue-900">
                  {product.name}
                </h3>
                <p className="text-blue-600 text-sm mb-2">
                  {product.brand?.name}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-blue-600">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
