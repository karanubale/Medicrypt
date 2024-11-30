// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import Head from './components/Head';
import FrontPage from './components/FrontPage';
import TextInput from './components/TextInput';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
      <Route path="/" element={<FrontPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Head />} />
        <Route path="/service2" element={<TextInput/>} />
        {/* <Head/> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
