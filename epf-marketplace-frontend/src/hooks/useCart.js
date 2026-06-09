import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart doit être utilisé à l’intérieur de CartProvider.');
  }

  return context;
}
