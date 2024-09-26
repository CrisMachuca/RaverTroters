import React from 'react';
import styles from '../styles/ProductCard.module.css';
import { motion } from 'framer-motion'

function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-lg"
    >
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-500 font-bold">${product.price}</p>
    </motion.div>
  );
}

export default ProductCard;