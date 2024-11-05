import React from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryCards() {
    const navigate = useNavigate();

    const handleNavigation = (category) => {
        navigate(`/products?category=${category}`);
    };

    return (
        <div className="flex justify-center gap-6 mt-10">
            {/*Card 1*/}
            <div
                className="w-1/3 bg-blue-500 text-white p-8 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer transition duration-200 transform hover:scale-105"
                onClick={() => handleNavigation('ropa')}
            >
                <h2 className="text-xl font-bold text-center">Ropa</h2>
            </div>
            {/* Card 2*/}
            <div
                className="w-1/3 bg-green-500 text-white p-8 rounded-lg shadow-md hover:bg-green-600 cursor-pointer transition duration-200 transform hover:scale-105"
                onClick={() => handleNavigation('zapatos')}
            >
                <h2 className="text-xl font-bold text-center">Zapatos</h2>
        
            </div>

            {/* Card 3*/}
            <div
                className="w-1/3 bg-purple-500 text-white p-8 rounded-lg shadow-md hover:bg-purple-600 cursor-pointer transition duration-200 transform hover:scale-105"
                onClick={() => handleNavigation('accesorios')}
            >
                <h2 className="text-xl font-bold text-center">Accesorios</h2>
        
            </div>
        </div>
    )
}

export default CategoryCards;