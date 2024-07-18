import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        // Redirect to the login page
        navigate('/login');
    }, [navigate]);

    return (
        <div>
            <h1>asd</h1>
        </div>
    );
}

export default Topbar;