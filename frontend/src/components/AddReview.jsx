import React, { useState } from 'react';
import API from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function AddReview({ productId }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0); // Para manejar el hover sobre las estrellas
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await API.post(`/products/${productId}/reviews`, {
                rating,
                comment,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Reseña añadida con éxito');
        } catch (error) {
            console.error('Error adding review:', error);
            alert('No se pudo añadir la reseña');
        }
    };

    // Función para renderizar estrellas según la calificación
    const renderStars = () => {
        const totalStars = 5;
        return (
            <div className="flex space-x-2 mb-4">
                {[...Array(totalStars)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <FontAwesomeIcon
                            key={index}
                            icon={faStar}
                            className={`cursor-pointer text-2xl ${
                                starValue <= (hoverRating || rating) ? "text-yellow-500" : "text-gray-300"
                            }`}
                            onClick={() => setRating(starValue)} // Asignar calificación al hacer clic
                            onMouseEnter={() => setHoverRating(starValue)} // Mostrar las estrellas al pasar el mouse
                            onMouseLeave={() => setHoverRating(0)} // Restablecer la vista de hover
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Añadir una reseña</h2>

            {/* Selección de calificación con estrellas */}
            <label className="block mb-2 font-semibold">Calificación:</label>
            {renderStars()}

            {/* Área de texto para la reseña */}
            <label className="block mb-4">
                <textarea
                    placeholder="Escribe tu reseña"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="block w-full h-32 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>

            {/* Botón de envío */}
            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
                Enviar reseña
            </button>
        </form>
    );
}

export default AddReview;
