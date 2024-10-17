import React, { useState, useEffect } from 'react';
import API from '../api';
import styles from '../styles/SearchBar.module.css'

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Hacer una solicitud al backend para obtener sugerencias cuando el usuario escribe
  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        try {
          const response = await API.get(`/product-suggestions?search=${searchTerm}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching product suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);  // Limpiar las sugerencias cuando no haya texto
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSuggestions([]); // Limpiar las sugerencias después de buscar
  };

  // Rellenar el campo de búsqueda cuando se selecciona una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]); // Limpiar las sugerencias después de seleccionar
  };

    return (
        <div className="relative mb-6">
            <form onSubmit={handleSearch} className={`${styles.searchForm}flex items-center justify-center mb-4`}>
                <input 
                    type="text"
                    placeholder='Buscar productos'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${styles.searchBar} w-full md:w-1/2 p-2 rounded-lg border border-gray-300 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500` }
                    
                />
                <button type='submit' className={styles.searchButton}>
                    Buscar
                </button>
            </form>
             {/* Mostrar sugerencias de productos */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded shadow-lg max-h-48 overflow-y-auto z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
        </div>
    )
}

export default SearchBar;