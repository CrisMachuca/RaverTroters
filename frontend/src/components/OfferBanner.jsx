import React, { useEffect, useState } from 'react';
import API from '../api';

function OfferBanner() {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchActiveOffer = async () => {
      try {
        const response = await API.get('/offers'); // Asume que esta ruta devuelve las ofertas activas
        if (response.data.length > 0) {
          setOffer(response.data[0]); // Solo mostramos la primera oferta activa
        }
      } catch (error) {
        console.error('Error fetching active offer:', error);
      }
    };

    fetchActiveOffer();
  }, []);

  if (!offer) {
    return null;
  }

  return (
    <div className="bg-yellow-300 p-4 text-center text-black font-bold">
      {offer.description} - {offer.discount_percentage}% de descuento por compras superiores a ${offer.min_purchase_amount}
    </div>
  );
}

export default OfferBanner;