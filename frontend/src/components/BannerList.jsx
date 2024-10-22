import React, { useState, useEffect } from 'react';
import API from '../api';

function BannerList() {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await API.get('/banners');
        setBanners(response.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  const deleteBanner = async (id) => {
    try {
      await API.delete(`/admin/banners/${id}`);
      setBanners(banners.filter(banner => banner.id !== id));
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setEditMode(true);
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('text', selectedBanner.text);
    formData.append('background_color', selectedBanner.background_color);
    formData.append('position', selectedBanner.position);
    formData.append('type_of_offer', selectedBanner.type_of_offer);

    if (selectedBanner.offer_id) {
      formData.append('offer_id', selectedBanner.offer_id);
    }

    // Si se selecciona una nueva imagen, añadirla al FormData
    if (selectedBanner.image) {
      formData.append('image', selectedBanner.image);
    }

    try {
      await API.put(`/admin/banners/${selectedBanner.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditMode(false);
      const response = await API.get('/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBanner({
      ...selectedBanner,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedBanner({
      ...selectedBanner,
      image: file,
    });
  };

  return (
    <div className="bg-white p-4 shadow-md rounded mt-8">
      <h2 className="text-xl font-bold mb-4">Banners</h2>

      {editMode ? (
        <form onSubmit={handleUpdateBanner} className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-bold mb-4">Editar Banner</h3>
          <input
            type="text"
            name="text"
            placeholder="Texto del banner"
            value={selectedBanner?.text || ''}
            onChange={handleInputChange}
            className="border p-2 mb-4 w-full"
          />
          <input
            type="color"
            name="background_color"
            value={selectedBanner?.background_color || '#ffffff'}
            onChange={handleInputChange}
            className="border p-2 mb-4 w-full"
          />
          <select
            name="position"
            value={selectedBanner?.position || ''}
            onChange={handleInputChange}
            className="border p-2 mb-4 w-full"
          >
            <option value="top">Top</option>
            <option value="aside">Aside</option>
            <option value="bottom">Bottom</option>
          </select>

          {/* Campo para seleccionar una nueva imagen */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 mb-4 w-full"
          />

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Guardar Cambios
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white p-2 rounded ml-4"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <ul>
          {banners.map((banner) => (
            <li key={banner.id} className="flex justify-between items-center mb-2">
              <div>
                <strong>{banner.text}</strong> - {banner.position}
              </div>
              <div>
                <button
                  onClick={() => handleEditBanner(banner)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BannerList;
