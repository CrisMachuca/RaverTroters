import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Navbar from './components/Navbar';
import CartProvider from './context/cartContext';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './pages/productDetail';
import Banner from './components/Banner';
import Wishlist from './pages/Wishlist';
import { WishlistProvider } from './context/wishlistContext'



function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    
      <Router>
        <CartProvider>
          <WishlistProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
                <Route path="/account" element={isAuthenticated ? <Account /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/banner" element={<Banner />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
            </WishlistProvider>
        </CartProvider>
      </Router>
    
  );
}

export default App;
