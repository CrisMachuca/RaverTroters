import React, { useState } from 'react';
import API from '../api';

function BannerForm({ fetchBanners }) {
    const [typeOfOffer, setTypeOfOffer] = useState('');
    const [text, setText] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [position, setPosition] = useState('top');
    const [offerId, setOfferId] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('type_of_offer', typeOfOffer);
        formData.append('text', text);
        formData.append('background_color', backgroundColor || '#ffffff');
        formData.append('position', position);
        // Si no hay un offer_id, pasar null en lugar de una cadena vacía
        if (offerId) {
            formData.append('offer_id', offerId);
        } else {
            formData.append('offer_id', null);  // Aquí aseguramos que null sea enviado, no 'null'
        }
        if (image) {
            formData.append('image', image);
        }

        try {
            await API.post('/admin/banners', formData);
            alert('Banner created successfully');
            fetchBanners();
        } catch (error) {
            console.error('Error creating banner', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded">
            <h2 className="text-xl font-bold mb-4">Add New Banner</h2>

            <select value={typeOfOffer} onChange={(e) => setTypeOfOffer(e.target.value)} className="border p-2 mb-4 w-full">
                <option value="">Select Offer Type</option>
                <option value="min_purchase_discount">Min Purchase Discount</option>
                <option value="multiple_product_discount">Multiple Product Discount</option>
                <option value="general_discount">General Discount</option>
            </select>

            <input
                type="text"
                placeholder="Banner Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border p-2 mb-4 w-full"
            />

            <input
                type="color"
                placeholder="Background Color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="border p-2 mb-4 w-full"
            />

            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="border p-2 mb-4 w-full"
            />

            <select value={position} onChange={(e) => setPosition(e.target.value)} className="border p-2 mb-4 w-full">
                <option value="top">Top</option>
                <option value="aside">Aside</option>
                <option value="bottom">Bottom</option>
            </select>
            <input
                type="number"
                placeholder="Offer ID (optional)"
                value={offerId}
                onChange={(e) => setOfferId(e.target.value)}  // If no ID, send null
                className="border p-2 mb-4 w-full"
            />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Banner</button>
        </form>
    );
}

export default BannerForm;
