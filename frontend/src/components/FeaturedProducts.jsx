import React, { useState, useEffect } from 'react';
import API from '../api';
import ProductCard from './ProductCard';
import styles from '../styles/FeaturedProducts.module.css';

function FeaturedProducts({ category }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const url = category ? `/featured-products?category=${category}` : '/featured-products';
        const response = await API.get(url);
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products', error);
      }
    };

    fetchFeaturedProducts();
  }, [category]);

  return (
    <section className={styles.featuredSection}>
      <h2 className="text-3xl font-bold text-center my-8">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
