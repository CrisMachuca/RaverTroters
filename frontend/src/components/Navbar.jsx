import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const { getCartQuantity, clearCart, fetchCart } = useCart(); // Importar fetchCart
  const token = localStorage.getItem('token'); // Verificar si el token está en localStorage
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token de localStorage
    clearCart(); // Limpiar el carrito al cerrar sesión
    navigate('/'); // Redirigir al Home o a la página de login
  };

  useEffect(() => {
    if (token) {
      fetchCart(); // Cargar el carrito cuando el usuario esté autenticado
    }
  }, [token]); // Ejecutar cuando cambie el token

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">RaverTroter</Link>
        <div>
          <Link to="/" className="text-white mr-4">Inicio</Link>
          <Link to="/products" className="text-white mr-4">Productos</Link>

          {token ? (
            <>
              <Link to="/cart" className="text-white mr-4">
                Carrito ({getCartQuantity()})
              </Link>
              <Link to="/account" className="text-white mr-4">Mi Cuenta</Link>
              {/* Botón de Cerrar Sesión */}
              <button onClick={handleLogout} className="text-white bg-red-600 px-4 py-2 rounded">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">Login</Link>
              <Link to="/register" className="text-white">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
