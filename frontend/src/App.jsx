import { useEffect,useState } from 'react'
import API from './api'
import './App.css'

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500">Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id} className="text-gray-900">{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
