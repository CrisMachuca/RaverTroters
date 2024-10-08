import React from 'react';
import { useCart } from '../context/cartContext';
import styles from '../styles/ProductCard.module.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  // Asegurarse de que el producto tiene los datos mínimos necesarios
  if (!product || !product.name || !product.price) {
    return <div>Error: Producto no válido</div>;
  }

  return (
    <div className={`${styles.card} bg-white rounded-lg shadow-md p-4`}>
      {/* Verificamos si el producto tiene una imagen, si no, mostramos una imagen por defecto */}
      <img 
        src={product.image_url ? product.image_url : '/path-to-placeholder-image.png'} 
        alt={product.name || 'Producto'} 
        className={`${styles.image} w-full h-48 object-cover`} 
      />
      <h2 className="text-xl font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">{product.description || 'Sin descripción disponible'}</p>
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
