import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Trash, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { createInvoice } from '../api/invoices';

const CartPage: React.FC = () => {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const createInvoiceMutation = useMutation({
    mutationFn: () => {
      const cartItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      return createInvoice(cartItems);
    },
    onSuccess: () => {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    },
  });
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    createInvoiceMutation.mutate();
  };
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">Product</th>
                    <th className="text-center pb-4">Quantity</th>
                    <th className="text-right pb-4">Price</th>
                    <th className="text-right pb-4">Total</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                            {item.product.images && item.product.images[0] ? (
                              <img
                                src={item.product.images[0].imageUrl}
                                alt={item.product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No image</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">{item.product.brand?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            disabled={item.quantity >= item.product.inStock}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        ${item.product.price.toFixed(2)}
                      </td>
                      <td className="py-4 text-right font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={createInvoiceMutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 mt-6 disabled:opacity-70"
            >
              {createInvoiceMutation.isPending ? 'Processing...' : 'Checkout'}
            </button>
            
            <div className="mt-4">
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;