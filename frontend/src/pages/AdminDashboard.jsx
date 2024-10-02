import React, { useEffect, useState } from 'react';
import API from '../api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    is_featured: false,
  });

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      await API.post('/admin/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await API.delete(`/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* Formulario para agregar un nuevo producto */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Agregar Producto</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleInputChange}
          className="border p-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleInputChange}
          className="border p-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleInputChange}
          className="border p-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={newProduct.category}
          onChange={handleInputChange}
          className="border p-2"
        />
        <label>
          <input
            type="checkbox"
            name="is_featured"
            checked={newProduct.is_featured}
            onChange={handleInputChange}
          />
          Producto destacado
        </label>
        <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2">
          Agregar Producto
        </button>
      </div>

      {/* Lista de productos */}
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border p-4 mb-4 flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <p>Categoría: {product.category}</p>
              <p>Destacado: {product.is_featured ? 'Sí' : 'No'}</p>
            </div>
            <div>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-4 py-2"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
