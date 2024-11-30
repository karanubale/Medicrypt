import React, { useEffect, useState } from 'react';
// import Main from './Main.js';
// import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import AudioRecorder from './AudioRecorder.js';

const Head = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('auth');
        if (!token) {
            // alert('login pls')
            navigate('/login'); // Redirect to login if no token
       
        } else {
            setIsAuthenticated(true); // Set as authenticated if token exists
        }
    }, [navigate]);

    return (    
        <>
            {isAuthenticated && (
                <>
                {/* <Main /> */}
                <AudioRecorder />
                </>
            )}
        </>
    );
};

export default Head;