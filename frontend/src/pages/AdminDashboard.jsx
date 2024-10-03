import React, { useEffect, useState } from 'react';
import API from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);  // Para almacenar las categorías
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',  // Se usará el id de la categoría seleccionada
    is_featured: false,
  });
  const [newCategory, setNewCategory] = useState('');  // Estado para la nueva categoría
  const [stats, setStats] = useState([]); // Estado para estadísticas de productos
  const [isEditing, setIsEditing] = useState(false);  // Estado para mostrar el modal de edición
  const [productToEdit, setProductToEdit] = useState(null);  // El producto seleccionado para editar

  // Cargar productos y estadísticas al iniciar
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

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await API.get('/admin/product-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data); // Almacenar estadísticas
    } catch (error) {
      console.error('Error fetching product stats:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();  // Llamar a la función para obtener estadísticas
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
    } catch (error) {
      console.error('Error adding product:', error);
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

  // Manejar la edición de productos
  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsEditing(true);  // Mostrar el modal de edición
  };

  // Guardar cambios en un producto
  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    try {
      await API.put(`/admin/products/${productToEdit.id}`, productToEdit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Refrescar productos
      setIsEditing(false); // Cerrar el modal
    } catch (error) {
      console.error('Error updating product:', error);
    }
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

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Gráfico de estadísticas de ventas y visitas */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Estadísticas de Ventas y Visitas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" name="Ventas" />
            <Bar dataKey="views" fill="#8884d8" name="Visitas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
        <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2">
          Agregar Producto
        </button>
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

      {/* Lista de productos existentes */}
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
                onClick={() => handleEditProduct(product)}
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

      {/* Modal de edición */}
      {isEditing && productToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8">
            <h2 className="text-2xl mb-4">Editar Producto</h2>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={productToEdit.name}
              onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={productToEdit.description}
              onChange={(e) => setProductToEdit({ ...productToEdit, description: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={productToEdit.price}
              onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
            <button onClick={handleSaveChanges} className="bg-green-500 text-white px-4 py-2">
              Guardar Cambios
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 ml-2">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
