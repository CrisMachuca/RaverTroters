import React, { useState } from 'react';
import API from '../api';

function OfferForm({ fetchOffers }) {
    const [description, setDescription] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
    const [offerType, setOfferType] = useState('');
    const [applicableToProductId, setApplicableToProductId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('admin/offers', {
                description: description,
                discount_percentage: discountPercentage,
                min_purchase_amount: minPurchaseAmount || null,
                offer_type: offerType,
                applicable_to_product_id: applicableToProductId || null,
                start_date: startDate,
                end_date: endDate
            });
            alert('Offer added successfully');
            fetchOffers();
        } catch (error) {
            console.error('Error adding offer', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Add New Offer</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="Discount Percentage"
        value={discountPercentage}
        onChange={(e) => setDiscountPercentage(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="Min Purchase Amount (optional)"
        value={minPurchaseAmount}
        onChange={(e) => setMinPurchaseAmount(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="text"
        placeholder="Offer Type (e.g. total_discount, second_unit_discount)"
        value={offerType}
        onChange={(e) => setOfferType(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="number"
        placeholder="Applicable Product ID (optional)"
        value={applicableToProductId}
        onChange={(e) => setApplicableToProductId(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="datetime-local"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="datetime-local"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Offer</button>
    </form>
    )
}

export default OfferForm;