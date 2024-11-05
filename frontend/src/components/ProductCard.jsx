import React from 'react';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/ProductCard.module.css';



function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Asegurarse de que el producto tiene los datos mínimos necesarios
  if (!product || !product.name || !product.price) {
    return <div>Error: Producto no válido</div>;
  }

  // Función wishlist
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  return (
    <div className={`${styles.card} bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105`}>
      {/* Verificamos si el producto tiene una imagen, si no, mostramos una imagen por defecto */}
      <img 
        src={product.image_url ? product.image_url : '/path-to-placeholder-image.png'} 
        alt={product.name || 'Producto'} 
        className={`${styles.image} w-full h-48 object-cover rounded-md`} 
      />
      <h2 className="text-xl font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">{product.description || 'Sin descripción disponible'}</p>
      <p className="text-green-500 font-bold mt-2">${product.price}</p>
      
      <div className="flex justify-between items-center mt-4 space-x-2">
        {/* Botón Ver Detalles */}
        <Link 
          to={`/products/${product.id}`} 
          className="flex-1 bg-blue-500 text-white font-bold py-2 px-2 rounded-full mt-4 text-center transition-colors hover:bg-blue-600"
        >
          +Info
        </Link>
        
        {/* Botón Añadir al carrito */}
        <button
          className="flex-1 bg-green-500 text-white font-bold py-2 px-2 rounded-full mt-4 transition-colors hover:bg-green-600"
          onClick={() => addToCart(product)}
        >
          <FontAwesomeIcon icon={faCartShopping} className="w-5 h-5 mr-2" /> {/* Icono del carrito */}
        </button>
        {/* Botón de la lista de deseos con icono FontAwesome */}
        <button onClick={handleWishlistToggle} className="mt-4">
          <FontAwesomeIcon
            icon={inWishlist ? solidHeart : regularHeart}
            className={`w-6 h-6 transition-colors duration-200 ${
              inWishlist ? 'text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
