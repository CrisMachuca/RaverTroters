import React, { createContext, useReducer, useContext, useEffect } from "react";
import API from '../api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload }; // Setear el carrito con los productos desde el backend

    case 'ADD_TO_CART':
      const existingProduct = state.cart.find(item => item.product_id === action.payload.product_id);
      if (existingProduct) {
        const updatedCart = state.cart.map(item =>
          item.product_id === action.payload.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { ...state, cart: updatedCart };
      } else {
        return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
      }

    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter(item => item.product_id !== action.payload.product_id);
      return { ...state, cart: filteredCart };

    case 'DECREASE_QUANTITY':
      const decreasedCart = state.cart.map(item =>
        item.product_id === action.payload.product_id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return { ...state, cart: decreasedCart };

    case 'CLEAR_CART':
      return { ...state, cart: [] }; // Vaciar el carrito

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  const fetchCart = async () => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const response = await API.get('/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cartData = Array.isArray(response.data) ? response.data : [];
        dispatch({ type: 'SET_CART', payload: cartData });
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      await API.post('/cart', { product_id: product.product_id }, {
        headers: {
          Authorization: `Bearer ${token}`,  
          'Content-Type': 'application/json', 
        },
      });
      dispatch({ type: 'ADD_TO_CART', payload: product });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const removeFromCart = async (product) => {
    const token = localStorage.getItem('token');
    try {
      await API.delete(`/cart/${product.product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'REMOVE_FROM_CART', payload: product });
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const decreaseQuantity = async (product) => {
    const token = localStorage.getItem('token');
    if (product.quantity > 1) {
      try {
        await API.put('/cart', { product_id: product.product_id, quantity: product.quantity - 1 }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: 'DECREASE_QUANTITY', payload: product });
      } catch (error) {
        console.error('Error decreasing product quantity:', error);
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartQuantity = () => {
    if (!Array.isArray(state.cart)) {
      return 0;  
    }
    return state.cart.reduce((acc, product) => acc + product.quantity, 0);
  };

  const getTotal = () => {  
    if (!Array.isArray(state.cart)) {
      return '0.00';  
    }
    return state.cart.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cart: state.cart, addToCart, removeFromCart, decreaseQuantity, clearCart, getCartQuantity, getTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;

