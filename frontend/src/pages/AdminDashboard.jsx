import React, { useEffect, useState } from 'react';
import API from '../api';
import OfferForm from '../components/OfferForm';
import OfferList from '../components/OfferList';
import BannerList from '../components/BannerList';
import BannerForm from '../components/BannerForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    is_featured: false,
    image: null,
  });
  const [newCategory, setNewCategory] = useState('');
  const [stats, setStats] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [banners, setBanners] = useState([]);

    const fetchBanners = async () => {
        try {
            const response = await API.get('/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

  // Cargar productos, categorías y estadísticas al iniciar
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
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await API.get('/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: Token may have expired or is invalid.');
      } else {
        console.error('Error fetching categories:', error);
      }
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await API.get('/admin/product-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: Token may have expired or is invalid.');
      } else {
        console.error('Error fetching product stats:', error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchStats();
    fetchBanners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file); // Agrego este log para verificar que se selecciona un archivo
    }
    setNewProduct({
      ...newProduct,
      image: file,
    });
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category_id', newProduct.category_id ? newProduct.category_id : null); // Si no hay categoría, enviar null
    formData.append('is_featured', newProduct.is_featured ? 'true' : 'false');
    if (newProduct.image) {
      formData.append('image', newProduct.image); // Añadir la imagen solo si existe
    }

    try {
      await API.post('/admin/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      setNewProduct({ name: '', description: '', price: 0, category_id: '', is_featured: false, image: null });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsEditing(true);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      is_featured: product.is_featured,
      image: product.image_url,  // Asignar la URL de la imagen actual
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
  
    formData.append('name', productToEdit.name);
    formData.append('description', productToEdit.description);
    formData.append('price', productToEdit.price);
    formData.append('category_id', productToEdit.category_id || '');
    formData.append('is_featured', productToEdit.is_featured ? 'true' : 'false');
  
    // Solo adjunta la imagen si es una nueva
    if (productToEdit.image && typeof productToEdit.image !== 'string') {
      console.log("Attaching new image:", productToEdit.image); // Verifico que se adjunta correctamente
      formData.append('image', productToEdit.image); 
  }
  
    // Imprimir todos los valores de FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      await API.put(`/admin/products/${productToEdit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      setIsEditing(false);
      setProductToEdit(null);
    } catch (error) {
      console.error('Error updating product:', error);
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
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Gráfico de estadísticas */}
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
      {/* Banners */}
      <BannerForm />
      <BannerList />
      {/* ofertas */}
      <OfferForm />
      <OfferList />

      {/* Formulario para agregar un nuevo producto */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Agregar Producto</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        />

        <select
          name="category_id"
          value={newProduct.category_id}
          onChange={handleInputChange}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Seleccionar Categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 mb-2 w-full"
        />

        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="is_featured"
            checked={newProduct.is_featured}
            onChange={handleInputChange}
            className="mr-2"
          />
          Producto destacado
        </label>
        <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2">
          Agregar Producto
        </button>
      </div>

      {/* Lista de productos existentes */}
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border p-4 mb-4 flex justify-between items-center">
            <div className="flex items-center">
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover mr-4" />
              )}
              <div>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <p>Categoría: {product.category}</p>
                <p>Destacado: {product.is_featured ? 'Sí' : 'No'}</p>
              </div>
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
          <div className="bg-white p-8 rounded shadow-lg w-96">
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
            ></textarea>
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={productToEdit.price}
              onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
              className="border p-2 mb-4 w-full"
            />

            <select
              name="category_id"
              value={productToEdit.category_id}
              onChange={(e) => setProductToEdit({ ...productToEdit, category_id: e.target.value })}
              className="border p-2 mb-4 w-full"
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
  type="file"
  name="image"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file for editing:", file); // Verificar si se selecciona un archivo
    }
    setProductToEdit({ ...productToEdit, image: file });
  }}
  className="border p-2 mb-4 w-full"
/>


            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name="is_featured"
                checked={productToEdit.is_featured}
                onChange={(e) => setProductToEdit({ ...productToEdit, is_featured: e.target.checked })}
                className="mr-2"
              />
              Producto destacado
            </label>

            <div className="flex justify-end">
              <button onClick={handleSaveChanges} className="bg-green-500 text-white px-4 py-2 mr-2">
                Guardar Cambios
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
