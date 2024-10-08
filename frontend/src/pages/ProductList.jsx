import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border p-4">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-4" />
            )}
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="mt-2">{product.description}</p>
            <p className="mt-2">Precio: ${product.price}</p>
            <Link to={`/products/${product.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
