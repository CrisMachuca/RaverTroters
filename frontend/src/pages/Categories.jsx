import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';

function Categories() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Categorías</h1>
      {/* Aquí podrías listar las categorías */}
      <FeaturedProducts />  {/* Reutilizas el componente FeaturedProducts */}
    </div>
  );
}

export default Categories;
