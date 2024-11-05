import React, { useState, useEffect } from 'react';
import API from '../api';
import ProductCard from '../components/ProductCard';
import FeaturedProducts from '../components/FeaturedProducts';
import OfferBanner from '../components/OfferBanner';
import CategoryCards from '../components/CategoryCards';
import styles from '../styles/Home.module.css';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topBanner, setTopBanner] = useState(null);
  const [asideBanner, setAsideBanner] = useState(null);
  const [bottomBanner, setBottomBanner] = useState(null);

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

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get('/banners');
        const banners = response.data;

        // Filtrar banners por posición
        setTopBanner(banners.find(banner => banner.position === 'top'));
        setAsideBanner(banners.find(banner => banner.position === 'aside'));
        setBottomBanner(banners.find(banner => banner.position === 'bottom'));
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        <div className="text-center my-12">
          <h1 className="text-white text-5xl font-bold">¡Bienvenido a RaverTroter!</h1>
          <p className="text-white text-xl mt-4">Descubre la mejor ropa y accesorios para festivales de música electrónica</p>
          <a href="/products" className="mt-8 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600">Ver Productos</a>
        </div>
      </section>

      <OfferBanner />

      {/* Banner superior */}
      {topBanner && (
        <div 
          className="p-4 text-center text-white font-bold rounded-lg shadow-lg transition-transform duration-500 transform hover:scale-105 mb-8"
          style={{ backgroundColor: topBanner.background_color }}
        >
          <img src={topBanner.image_url} alt="Top Banner" className="w-full h-48 object-cover rounded-lg mb-4" />
          <p className="text-2xl">{topBanner.text}</p>
        </div>
      )}

      {/* Componente de cards de categoría */}
      <CategoryCards />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Columna principal (productos) */}
        <div className="lg:col-span-3">
          <FeaturedProducts />
        </div>

        {/* Columna lateral (aside) */}
        {asideBanner && (
          <div className="lg:col-span-1 p-4">
            <div 
              className="p-4 text-center text-white font-bold rounded-lg shadow-lg transition-transform duration-500 transform hover:scale-105"
              style={{ backgroundColor: asideBanner.background_color }}
            >
              <img src={asideBanner.image_url} alt="Aside Banner" className="w-full h-48 object-cover rounded-lg mb-4" />
              <p className="text-xl">{asideBanner.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Banner inferior */}
      {bottomBanner && (
        <div 
          className="p-4 text-center text-white font-bold rounded-lg shadow-lg transition-transform duration-500 transform hover:scale-105 mt-8"
          style={{ backgroundColor: bottomBanner.background_color }}
        >
          <img src={bottomBanner.image_url} alt="Bottom Banner" className="w-full h-48 object-cover rounded-lg mb-4" />
          <p className="text-2xl">{bottomBanner.text}</p>
        </div>
      )}

      <section className="bg-gray-200 py-12 mt-12">
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

      <section className="bg-blue-600 text-white py-12 text-center mt-8">
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
