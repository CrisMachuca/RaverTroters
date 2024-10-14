import React, { useEffect, useState } from "react";
import API from "../api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Reviews({ productId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await API.get(`/products/${productId}/reviews`);
                console.log(response.data);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [productId]);

    // Función para renderizar estrellas según la calificación
    const renderStars = (rating) => {
        const totalStars = 5;
        return (
            <>
                {[...Array(totalStars)].map((star, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className={index < rating ? "text-yellow-500" : "text-gray-300"}
                    />
                ))}
            </>
        );
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
            {reviews.length === 0 ? (
                <p>Aún no hay reseñas para este producto.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-4 bg-white shadow-lg rounded-lg">
                            <div className="flex items-center mb-2">
                                {/* Estrellas de la reseña */}
                                {renderStars(review.rating)}
                            </div>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-500">
    Publicado por: {review.user} el {new Date(review.created_at).toLocaleDateString()}
</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Reviews;
