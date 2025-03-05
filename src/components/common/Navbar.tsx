import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            ShopApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600">
              Products
            </Link>
            
            {/* Search Icon (Desktop) */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              <Search size={20} />
            </button>
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-indigo-600">
                  <User size={20} className="mr-1" />
                  <span>{user?.name}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50"
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                Login
              </Link>
            )}
            
            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700"
            >
              <Search size={20} />
            </button>
            
            <Link to="/cart" className="relative text-gray-700">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-indigo-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="text-gray-700 hover:text-indigo-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-indigo-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;