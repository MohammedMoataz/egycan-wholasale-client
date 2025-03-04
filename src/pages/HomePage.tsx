import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';
import { getProducts } from '../api/products';
import { Category, Product } from '../types';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getProducts({ maxPrice: 1000 })
  });
  
  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white rounded-lg overflow-hidden mb-12">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop the Latest Products
            </h1>
            <p className="text-lg mb-6">
              Discover amazing products at unbeatable prices. Shop now and enjoy fast shipping!
            </p>
            <Link
              to="/products"
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-gray-100 transition"
            >
              Shop Now
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Shopping"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <img
                  src={`https://source.unsplash.com/random/300x200/?${category.name.toLowerCase()}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts?.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              to={`/products?id=${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
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
                <p className="text-gray-600 text-sm mb-2">{product.brand?.name}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">
                    {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
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