import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async (filters = {}, searchTerm = '') => {
    let query = '/products?';

    if (searchTerm) {
      query += `search=${searchTerm}&`;
    }

    if (filters.category) {
        query += `category_id=${filters.category}&`;
    }
    if (filters.priceRange && filters.priceRange.min !== undefined && filters.priceRange.max !== undefined) {
        query += `min_price=${filters.priceRange.min}&max_price=${filters.priceRange.max}&`;
    }
    if (filters.onlyFeatured) {
        query += 'is_featured=true&';
    }

    // Verificar la URL generada
    console.log("Consultando productos con la URL:", query);

    try {
        const response = await API.get(query);
        setProducts(response.data);
        console.log('Productos recibidos:', response.data); // Verificar la data recibida
        console.log('Estado de products:', products); // Verificar si el estado se está actualizando
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};
  // Llamar a la API cuando se cargue la página
  useEffect(() => {
    fetchProducts({});
  }, []);

  // Función que maneja los cambios en los filtros
  const handleFilterChange = (filters) => {
    fetchProducts(filters);
  };

  // Función que maneja la búsqueda
  const handleSearch = (searchTerm) => {
    fetchProducts({}, searchTerm)
  }

  return (
    <div className="container mx-auto mt-8">
      {/* Barra de búsqueda */}
      <SearchBar onSearch={handleSearch} />
      {/* Filtros de productos */}
      <ProductFilters onFilterChange={handleFilterChange} />

      {/* Mostrar lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p>No se encontraron productos</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
