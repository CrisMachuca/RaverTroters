import React, { useEffect, useState } from 'react';
import API from '../api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',  
    is_featured: false,
  });
  const [newCategory, setNewCategory] = useState('');  
  const [editingProduct, setEditingProduct] = useState(null);  // Para rastrear el producto que se está editando

  // Cargar productos y categorías al iniciar
  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await API.get('/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Agregar nuevo producto
  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      await API.post('/admin/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refrescar la lista de productos
      setNewProduct({ name: '', description: '', price: 0, category_id: '', is_featured: false }); // Limpiar el formulario
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Iniciar la edición de un producto
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      is_featured: product.is_featured,
    });
  };

  // Actualizar un producto
  const handleUpdateProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      await API.put(`/admin/products/${editingProduct.id}`, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refrescar la lista de productos
      setEditingProduct(null); // Salir del modo de edición
      setNewProduct({ name: '', description: '', price: 0, category_id: '', is_featured: false }); // Limpiar el formulario
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', description: '', price: 0, category_id: '', is_featured: false });
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await API.delete(`/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refrescar la lista de productos
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Agregar nueva categoría
  const handleAddCategory = async () => {
    const token = localStorage.getItem('token');
    try {
      await API.post('/admin/categories', { name: newCategory }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories(); // Refrescar la lista de categorías
      setNewCategory(''); // Limpiar el input de categoría
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Eliminar categoría existente
  const handleDeleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    try {
      await API.delete(`/admin/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories(); // Refrescar la lista de categorías
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Formulario para agregar o editar un producto */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
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

        {/* Desplegable para seleccionar la categoría */}
        <select
          name="category_id"
          value={newProduct.category_id}
          onChange={handleInputChange}
          className="border p-2"
        >
          <option value="">Seleccionar Categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        <label>
          <input
            type="checkbox"
            name="is_featured"
            checked={newProduct.is_featured}
            onChange={handleInputChange}
          />
          Producto destacado
        </label>

        {/* Botones para agregar o actualizar producto */}
        {editingProduct ? (
          <>
            <button onClick={handleUpdateProduct} className="bg-yellow-500 text-white px-4 py-2">
              Actualizar Producto
            </button>
            <button onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2">
              Cancelar
            </button>
          </>
        ) : (
          <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2">
            Agregar Producto
          </button>
        )}
      </div>

      {/* Gestión de categorías */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Gestionar Categorías</h2>
        <input
          type="text"
          placeholder="Nueva Categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white px-4 py-2">
          Agregar Categoría
        </button>

        <ul className="mt-4">
          {categories.map((category) => (
            <li key={category.id} className="border p-4 mb-4 flex justify-between">
              <span>{category.name}</span>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-500 text-white px-4 py-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
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
                onClick={() => handleEditClick(product)}
                className="bg-yellow-500 text-white px-4 py-2 mr-2"
              >
                Editar
              </button>
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
