import React, { createContext, useReducer, useContext, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        const existingProduct = state.cart.find(item => item.id === action.payload.id);
        if (existingProduct) {
          const updatedCart = state.cart.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          );
          return { ...state, cart: updatedCart };
        } else {
          return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
        }
      case 'REMOVE_FROM_CART':
        const filteredCart = state.cart.filter(item => item.id !== action.payload.id);
        return { ...state, cart: filteredCart };
      case 'DECREASE_QUANTITY':
        const decreasedCart = state.cart.map(item => 
          item.id === action.payload.id && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
        );
        return { ...state, cart: decreasedCart.filter(item => item.quantity > 0) }; // Eliminar el producto si llega a 0
      default:
        return state;
    }
  };

const CartProvider = ({ children }) => {
    const initialState = {
      cart: JSON.parse(localStorage.getItem('cart')) || []  // Cargar desde localStorage
    };
    const [state, dispatch] = useReducer(cartReducer, initialState);
  
    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(state.cart));  // Guardar en localStorage
    }, [state.cart]);
  
    const addToCart = product => {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    };
  
    const removeFromCart = product => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: product });
    };

    const decreaseQuantity = product => {
        dispatch({ type: 'DECREASE_QUANTITY', payload: product });
      };

    const getCartQuantity = () => {
        return state.cart.reduce((acc, product) => acc + product.quantity, 0)
    }
  
    const getTotal = () => {
        return state.cart.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2);
      };
  
    return (
      <CartContext.Provider value={{ cart: state.cart, addToCart, removeFromCart, decreaseQuantity, getTotal, getCartQuantity }}>
        {children}
      </CartContext.Provider>
    );
  };

export const useCart = () => useContext(CartContext);
export default CartProvider;