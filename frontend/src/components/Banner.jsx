import React from 'react';

function Banner({ banner }) {
    const bannerStyle = {
        backgroundColor: banner.background_color || '#ffffff',
        backgroundImage: banner.image_url ? `url(${banner.image_url})` : 'none',
        backgroundSize: 'cover',
        color: '#000',
        padding: '20px',
        textAlign: 'center',
        margin: '10px 0'
    };

    return (
        <div style={bannerStyle}>
            <h2>{banner.text}</h2>
            <p>{banner.offer_type}</p>
        </div>
    );
}

export default Banner;
