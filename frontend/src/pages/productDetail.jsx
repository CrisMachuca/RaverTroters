import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/cartContext';
import ProductCard from '../components/ProductCard';
import Reviews from '../components/Reviews';
import AddReview from '../components/AddReview';

function ProductDetail() {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart(); // Usar el contexto del carrito

  // Obtener el detalle del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  // Obtener productos relacionados solo después de que el producto se haya cargado
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.category_id) {
        try {
          const response = await API.get(`/products?category_id=${product.category_id}`);
          setRelatedProducts(response.data.filter(p => p.id !== product.id)); // Excluir el producto actual
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div>
          <img src={product.image_url} alt={product.name} className="w-full h-auto object-cover" />
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl text-green-500 font-bold my-4">${product.price}</p>
          <p className="text-sm text-gray-500">Composición: {product.composition || 'No especificado'}</p>
          
          {/* Botón para agregar al carrito */}
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => addToCart(product)}
          >
            Añadir al carrito
          </button>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
        <Reviews productId={product.id} />
        <AddReview productId={product.id} />
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
