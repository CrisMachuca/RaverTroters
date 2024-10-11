import React, { useState, useEffect } from 'react';
import API from '../api';
import ProductCard from '../components/ProductCard';
import FeaturedProducts from '../components/FeaturedProducts';
import styles from '../styles/Home.module.css';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await API.get('/featured-products');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <div className="text-center my-12">
          <h1 className="text-white text-5xl font-bold">¡Bienvenido a RaverTroter!</h1>
          <p className="text-white text-xl mt-4">Descubre la mejor ropa y accesorios para festivales de música electrónica</p>
          <a href="/products" className="mt-8 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Ver Productos</a>
        </div>
      </section>
      <FeaturedProducts />
      <section className="bg-gray-200 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h2>
        <div className="flex justify-center">
            <div className="max-w-md">
                <blockquote className="text-lg italic text-center">
                "RaverTroter tiene los mejores productos para festivales, ¡me encantan sus camisetas y accesorios!"
                </blockquote>
                <p className="text-center mt-4">- Jane Doe, Cliente Satisfecho</p>
            </div>
        </div>
      </section>
      <section className="bg-blue-600 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">¡Suscríbete a nuestro boletín!</h2>
        <p className="mb-6">Recibe las últimas novedades y descuentos exclusivos</p>
        <form className="flex justify-center">
            <input
            type="email"
            placeholder="Tu correo electrónico"
            className="p-2 rounded-l-lg focus:outline-none"
            />
            <button className="bg-blue-800 p-2 rounded-r-lg hover:bg-blue-700">
            Suscribirme
            </button>
        </form>
      </section>
    </div>
  );
}

export default Home;



