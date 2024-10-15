import React, { useState, useEffect } from 'react';
import API from '../api';

function ProductFilters({ onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [onlyFeatured, setOnlyFeatured] = useState(false);

    // Obtener las categorías desde la API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/admin/categories');
                setCategories(response.data);
            } catch (error) {
                console.log('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Función para manejar los cambios en los filtros
    const handleFilterChange = () => {
        const minPrice = priceRange.min !== '' ? parseFloat(priceRange.min) : 0; // Asegúrate de que 0 se maneje
        const maxPrice = priceRange.max !== '' ? parseFloat(priceRange.max) : 10000;
    
        if (minPrice > maxPrice) {
            alert("El valor mínimo no puede ser mayor que el máximo.");
            return;
        }
    
        onFilterChange({
            category: selectedCategory,
            priceRange: {
                min: minPrice,
                max: maxPrice,
            },
            onlyFeatured,
        });
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md mb-6">
        <h3 className="text-lg font-bold mb-4">Filtrar productos</h3>
  
        {/* Filtrar por categoría */}
        <div className="mb-4">
          <label className="block text-gray-700">Categoría</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
  
        {/* Filtrar por rango de precios */}
        <div className="mb-4">
          <label className="block text-gray-700">Rango de precios</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Mínimo"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Máximo"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>
        </div>
  
        {/* Filtrar solo productos destacados */}
        <div className="mb-4">
          <label className="block text-gray-700">
            <input
              type="checkbox"
              className="mr-2"
              checked={onlyFeatured}
              onChange={() => setOnlyFeatured(!onlyFeatured)}
            />
            Solo productos destacados
          </label>
        </div>
  
        {/* Botón para aplicar filtros */}
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={handleFilterChange}
        >
          Aplicar filtros
        </button>
      </div>
    );
    
}

export default ProductFilters;