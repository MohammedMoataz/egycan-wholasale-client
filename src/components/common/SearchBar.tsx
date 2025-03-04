import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchProducts } from '../../api/products';
import { Product } from '../../types';

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const data = await searchProducts(query);
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleProductClick = (productId: number) => {
    navigate(`/products?id=${productId}`);
    setShowResults(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      onClose();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No products found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;