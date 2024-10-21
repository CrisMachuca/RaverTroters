import React, { useState } from "react";
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/login', {
                username,
                password,
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('username',username);
            console.log("Token stored:", localStorage.getItem('token'));
            alert('Logged in successfully!');
            navigate('/');
        } catch (error) {
            console.log('Error loggin in', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-4 w-full"
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-4 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
    </div>
    );
}

export default Login;
