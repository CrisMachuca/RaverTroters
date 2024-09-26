import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  return (
    <nav className={`${styles.navbar} bg-gray-800 p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">RaverTroter</Link>
        <div>
          <Link to="/" className="text-white mr-4">Inicio</Link>
          <Link to="/products" className="text-white">Productos</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
