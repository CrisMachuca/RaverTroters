import React from 'react';
import { useCart } from '../context/cartContext';

function Cart() {
  const { cart, addToCart, removeFromCart, decreaseQuantity, getTotal } = useCart();

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>
      {cart.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {cart.map(product => (
              <li key={product.id} className="border-b py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p>${product.price} x {product.quantity}</p>
                </div>
                <div className="flex items-center">
                  {/* Botón para disminuir la cantidad */}
                  <button
                    className={`${
                      product.quantity === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500'
                    } text-white font-bold py-1 px-3 rounded-full mr-2`}
                    onClick={() => decreaseQuantity(product)}
                    disabled={product.quantity === 1} // Deshabilitar si solo hay 1 unidad
                  >
                    -
                  </button>
                  {/* Botón para aumentar la cantidad */}
                  <button
                    className="bg-green-500 text-white font-bold py-1 px-3 rounded-full mr-2"
                    onClick={() => addToCart(product)} // Aumentar la cantidad
                  >
                    +
                  </button>
                  {/* Botón para eliminar el producto */}
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
