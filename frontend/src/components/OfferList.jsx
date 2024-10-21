import React, { useEffect, useState } from 'react';
import API from '../api';

function OfferList() {
    const [offers, setOffers] = useState([]);
    const [editingOffer, setEditingOffer] = useState(null); // Estado para manejar la oferta en edición
    const [formValues, setFormValues] = useState({
        description: '',
        discount_percentage: 0,
        min_purchase_amount: '',
        offer_type: '',
        start_date: '',
        end_date: '',
    });

    const fetchOffers = async () => {
        try {
            const response = await API.get('/admin/offers');
            setOffers(response.data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const deleteOffer = async (id) => {
        try {
            await API.delete(`/admin/offers/${id}`);
            fetchOffers();
        } catch (error) {
            console.log('Error deleting offer:', error);
        }
    };

    const handleEditClick = (offer) => {
        setEditingOffer(offer.id);
        setFormValues({
            description: offer.description,
            discount_percentage: offer.discount_percentage,
            min_purchase_amount: offer.min_purchase_amount,
            offer_type: offer.offer_type,
            start_date: offer.start_date,
            end_date: offer.end_date,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/admin/offers/${editingOffer}`, formValues);
            setEditingOffer(null); // Salir del modo de edición
            fetchOffers();
        } catch (error) {
            console.log('Error updating offer:', error);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <div className="bg-white p-4 shadow-md rounded mt-8">
          <h2 className="text-xl font-bold mb-4">Active Offers</h2>
          <ul>
            {offers.map(offer => (
              <li key={offer.id} className="flex justify-between items-center mb-2">
                <div>
                  <strong>{offer.description}</strong> - {offer.discount_percentage}% off
                </div>
                <div>
                  <button
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                    onClick={() => handleEditClick(offer)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => deleteOffer(offer.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Si hay una oferta en edición, mostrar el formulario */}
          {editingOffer && (
            <form onSubmit={handleEditSubmit} className="bg-gray-100 p-4 mt-4 rounded">
              <h3 className="text-lg font-bold">Edit Offer</h3>
              <input
                type="text"
                placeholder="Description"
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
              <input
                type="number"
                placeholder="Discount Percentage"
                value={formValues.discount_percentage}
                onChange={(e) => setFormValues({ ...formValues, discount_percentage: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
              <input
                type="number"
                placeholder="Min Purchase Amount (optional)"
                value={formValues.min_purchase_amount}
                onChange={(e) => setFormValues({ ...formValues, min_purchase_amount: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
              <input
                type="text"
                placeholder="Offer Type (e.g. total_discount, second_unit_discount)"
                value={formValues.offer_type}
                onChange={(e) => setFormValues({ ...formValues, offer_type: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
              <input
                type="datetime-local"
                placeholder="Start Date"
                value={formValues.start_date}
                onChange={(e) => setFormValues({ ...formValues, start_date: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
              <input
                type="datetime-local"
                placeholder="End Date"
                value={formValues.end_date}
                onChange={(e) => setFormValues({ ...formValues, end_date: e.target.value })}
                className="border p-2 mb-4 w-full"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save Changes</button>
            </form>
          )}
        </div>
    );
}

export default OfferList;
