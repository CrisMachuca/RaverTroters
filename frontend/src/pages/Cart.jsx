import React, { useEffect } from 'react';
import { useCart } from '../context/cartContext';

function Cart() {
  const { cart, addToCart, removeFromCart, decreaseQuantity, getTotal } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>
      {cart.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {cart.map(product => (
              <li key={product.product_id} className="border-b py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{product.product_name}</h2>
                  <p>${product.price} x {product.quantity}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className={`${
                      product.quantity === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500'
                    } text-white font-bold py-1 px-3 rounded-full mr-2`}
                    onClick={() => decreaseQuantity(product)}
                    disabled={product.quantity === 1} 
                  >
                    -
                  </button>
                  <button
                    className="bg-green-500 text-white font-bold py-1 px-3 rounded-full mr-2"
                    onClick={() => addToCart(product)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-500 text-white font-bold py-1 px-3 rounded-full"
                    onClick={() => removeFromCart(product)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Total: ${getTotal()}</h2>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
