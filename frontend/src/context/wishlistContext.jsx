import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import API from '../api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    

    // Cargar la lista de deseos del backend
    const fetchWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await API.get('/wishlist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
             // Obtener detalles completos de cada producto en la lista de deseos
             const detailedWishlist = await Promise.all(response.data.map(async (item) => {
                const productResponse = await API.get(`/products/${item.product_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return productResponse.data;
            }));
            setWishlist(detailedWishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    // Reiniciar la lista de deseos (vaciarla) al cerrar sesión
    const resetWishlist = () => setWishlist([]);

    useEffect(() => {
        fetchWishlist();
    }, [])

    const addToWishlist = async (product) => {
        const token = localStorage.getItem('token');
        try {
            await API.post('/wishlist', {product_id: product.id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlist((prev) => [...prev, product]);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
        
    };

    const removeFromWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await API.delete(`/wishlist/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWishlist((prev) => prev.filter((item) => item.id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
       
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.id === productId);
    };

    const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, setWishlist, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount, fetchWishlist, resetWishlist}}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext)
