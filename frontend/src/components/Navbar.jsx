import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/cartContext';

function Navbar() {
  const { getCartQuantity, clearCart, fetchCart } = useCart();
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es administrador
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await API.get('/account', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAdmin(response.data.is_admin); // Comprobar si el usuario es administrador
          await fetchCart();
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username')
    clearCart();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
      {token ? (
            <>
              
              
              <span className="text-md text-white mr-4">Hola, {username}!</span>
              
            </>
          ) : <span></span>}
        <Link to="/" className="text-white text-2xl font-bold">RaverTroters</Link>
        <div>
          <Link to="/" className="text-white mr-4">Inicio</Link>
          <Link to="/products" className="text-white mr-4">Productos</Link>

          {token ? (
            <>
              
              <Link to="/cart" className="text-white mr-4">Carrito ({getCartQuantity()})</Link>
              <Link to="/account" className="text-white mr-4">Mi Cuenta</Link>
              
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-white mr-4">Admin Dashboard</Link>
              )}

              <button onClick={handleLogout} className="text-white bg-red-600 px-4 py-2 rounded">Cerrar Sesión</button>
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
