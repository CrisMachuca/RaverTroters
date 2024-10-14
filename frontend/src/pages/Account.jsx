import React, { useEffect, useState } from "react";
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Account() {
    const [userData, setUserdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const response = await API.get('/account', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setUserdata(response.data);
            } catch (error) {
              console.error('Error fetching account data', error);
            } finally {
              setLoading(false);
            } 
          } else {
            console.log('Notoken found');
            setLoading(false);
            navigate('/login');
          }
        };
    
        fetchUserData();
      }, [navigate]);

      return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Mi Cuenta</h1>
            {loading ? (
                <p>Cargando datos de usuario...</p>
            ) : userData ? (
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                </div>
            ) : (
                <p>No se pudieron cargar los datos del usuario.</p>
            )}
        </div>
      )
}

export default Account;