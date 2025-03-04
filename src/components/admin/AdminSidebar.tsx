import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Bookmark, 
  FileText, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: '/admin/products',
      name: 'Products',
      icon: <ShoppingBag size={20} />,
    },
    {
      path: '/admin/categories',
      name: 'Categories',
      icon: <Tag size={20} />,
    },
    {
      path: '/admin/brands',
      name: 'Brands',
      icon: <Bookmark size={20} />,
    },
    {
      path: '/admin/invoices',
      name: 'Invoices',
      icon: <FileText size={20} />,
    },
  ];
  
  return (
    <div className="bg-indigo-800 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-6">
        <Link to="/admin" className="text-2xl font-bold">Admin Panel</Link>
      </div>
      
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 hover:bg-indigo-700 ${
                  isActive(item.path) ? 'bg-indigo-700' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          
          <li className="mt-6">
            <button
              onClick={() => logout()}
              className="flex items-center px-6 py-3 w-full text-left hover:bg-indigo-700"
            >
              <span className="mr-3"><LogOut size={20} /></span>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;