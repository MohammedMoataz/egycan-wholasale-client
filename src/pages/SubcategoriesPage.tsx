import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../api/categories';
import { getSubcategories } from '../api/categories';
import { getProducts } from '../api/products';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';
import { useCartStore } from '../store/cartStore';
import { toast } from 'react-hot-toast';
import { Product } from '../types';

const SubcategoriesPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { addItem } = useCartStore();
  
  const categoryIdNum = parseInt(categoryId || '0', 10);
  
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categoryIdNum],
    queryFn: () => getCategory(categoryIdNum),
    enabled: !!categoryIdNum,
  });
  
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['subcategories', categoryIdNum],
    queryFn: () => getSubcategories(categoryIdNum),
    enabled: !!categoryIdNum,
  });
  
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { categoryId: categoryIdNum }],
    queryFn: () => getProducts({ categoryId: categoryIdNum }),
    enabled: !!categoryIdNum,
  });
  
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
  
  if (categoryLoading || subcategoriesLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Category not found</h2>
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
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold">{category.name}</h1>
      </div>
      
      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/products?categoryId=${categoryId}&subcategoryId=${subcategory.id}`}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <h3 className="font-medium">{subcategory.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Products */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Products in {category.name}</h2>
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
            <p className="text-gray-500">No products found in this category</p>
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

export default SubcategoriesPage;