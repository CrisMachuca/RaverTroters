import React, { useEffect, useState } from "react";
import API from '../api';

function Account() {
    const [userData, setUserdata] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await API.get('/account', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUserData(response.data);
          } catch (error) {
            console.error('Error fetching account data', error);
          }
        };
    
        fetchUserData();
      }, []);

      return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Mi Cuenta</h1>
            {userData ? (
            <div>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
            </div>
            ) : (
            <p>Cargando datos de usuario...</p>
            )}
        </div>
      )
}

export default Account;