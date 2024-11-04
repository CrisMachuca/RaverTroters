import React, { useEffect, useState } from 'react'
import API from '../api';
import { useWishlist } from '../context/wishlistContext';
import ProductCard from '../components/ProductCard';
import styles from '../styles/Wishlist.module.css'

function Wishlist() {
    const { wishlist } =useWishlist();

    return (
        <div>
        <h2>Mi Lista de Deseos</h2>
        {wishlist.length > 0 ? (
          <div>
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No hay productos en la lista de deseos.</p>
        )}
      </div>
    );
}

export default Wishlist;