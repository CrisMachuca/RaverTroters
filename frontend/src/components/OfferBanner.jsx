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

  // Solo mostrar el texto de compra mínima si está definido y es mayor que 0
  const minPurchaseText = offer.min_purchase_amount && offer.min_purchase_amount > 0 
    ? ` por compras superiores a €${offer.min_purchase_amount}` 
    : '';

  return (
    <div className="bg-yellow-300 p-4 text-center text-black font-bold">
      {offer.description} - {offer.discount_percentage}% de descuento{minPurchaseText}
    </div>
  );
}

export default OfferBanner;