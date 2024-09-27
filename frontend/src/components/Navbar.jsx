import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext'
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const { getCartQuantity } = useCart(); // Usar la nueva función para obtener la cantidad total de productos en el carrito

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">RaverTroter</Link>
        <div>
          <Link to="/" className="text-white mr-4">Inicio</Link>
          <Link to="/products" className="text-white mr-4">Productos</Link>
          <Link to="/cart" className="text-white">
            Carrito ({getCartQuantity()}) {/* Mostrar la cantidad total */}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
