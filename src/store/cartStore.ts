import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      
      addItem: (product, quantity) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        let newItems;
        if (existingItem) {
          newItems = items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            product,
            quantity
          };
          newItems = [...items, newItem];
        }
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        set({ items: newItems, totalItems, totalPrice });
      },
      
      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter(item => item.product.id !== productId);
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        set({ items: newItems, totalItems, totalPrice });
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          return get().removeItem(productId);
        }
        
        const newItems = items.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        );
        
        const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        set({ items: newItems, totalItems, totalPrice });
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);