import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const AdminHeader: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <button className="md:hidden mr-4">
        <Menu size={24} />
      </button>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="mr-2 text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;