import React from 'react';
import { useCart } from '../context/cartContext'
import styles from '../styles/ProductCard.module.css';


function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className={`${styles.card} bg-white rounded-lg shadow-md p-4`}>
      <img src={product.imageUrl} alt={product.name} className={`${styles.image} w-full h-48 object-cover`} />
      <h2 className="text-xl font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-500 font-bold">${product.price}</p>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mt-4"
        onClick={() => addToCart(product)}
      >
        Añadir al carrito
      </button>
    </div>
  );
}

export default ProductCard;