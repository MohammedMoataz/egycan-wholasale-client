import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag, Bookmark, FileText, TrendingUp, Users } from 'lucide-react';
import { getProducts } from '../../api/products';
import { getCategories } from '../../api/categories';
import { getBrands } from '../../api/brands';
import { getInvoices } from '../../api/invoices';

const AdminDashboardPage: React.FC = () => {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
  
  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });
  
  // Calculate total sales
  const totalSales = invoices?.reduce((sum, invoice) => sum + invoice.totalPrice, 0) || 0;
  
  // Get recent invoices
  const recentInvoices = invoices?.slice(0, 5) || [];
  
  const statCards = [
    {
      title: 'Total Sales',
      value: `$${totalSales.toFixed(2)}`,
      icon: <TrendingUp size={24} className="text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Products',
      value: products?.length || 0,
      icon: <ShoppingBag size={24} className="text-blue-500" />,
      color: 'bg-blue-100',
      link: '/admin/products',
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: <Tag size={24} className="text-purple-500" />,
      color: 'bg-purple-100',
      link: '/admin/categories',
    },
    {
      title: 'Brands',
      value: brands?.length || 0,
      icon: <Bookmark size={24} className="text-yellow-500" />,
      color: 'bg-yellow-100',
      link: '/admin/brands',
    },
    {
      title: 'Invoices',
      value: invoices?.length || 0,
      icon: <FileText size={24} className="text-red-500" />,
      color: 'bg-red-100',
      link: '/admin/invoices',
    },
    {
      title: 'Customers',
      value: invoices?.reduce((acc, curr) => {
        if (!acc.includes(curr.userId)) {
          acc.push(curr.userId);
        }
        return acc;
      }, [] as number[]).length || 0,
      icon: <Users size={24} className="text-indigo-500" />,
      color: 'bg-indigo-100',
    },
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.color} rounded-lg shadow-md p-6`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-600 text-sm font-medium">{card.title}</h2>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className="p-3 rounded-full bg-white">{card.icon}</div>
            </div>
            {card.link && (
              <Link
                to={card.link}
                className="text-sm text-gray-600 hover:text-gray-800 mt-4 inline-block"
              >
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>
      
      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
        
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3">ID</th>
                  <th className="text-left pb-3">Customer</th>
                  <th className="text-left pb-3">Date</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-right pb-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="py-3">#{invoice.id}</td>
                    <td className="py-3">{invoice.user?.name || 'Unknown'}</td>
                    <td className="py-3">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invoice.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">
                      ${invoice.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No invoices found</p>
        )}
        
        {recentInvoices.length > 0 && (
          <div className="mt-4 text-right">
            <Link
              to="/admin/invoices"
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              View All Invoices →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;