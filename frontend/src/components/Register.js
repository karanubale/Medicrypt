import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './auth.css';
import './ToastStyles.css';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    hospital: '',
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert role to a Number explicitly
      const res = await axios.post("http://localhost:8080/api/v1/auth/register/", { 
        ...formData, 
        role: Number(formData.role) // Ensure `role` is a Number
      });

      // Assuming res.data contains the response with success, message, and user
      if (res.data.success) {
        localStorage.setItem('auth', JSON.stringify(res.data.user));
        toast.success(res.data.message || "Registration successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // After successful registration, navigate to the Head component
        setTimeout(() => navigate('/'), 2000); // Redirect to 'Head' component with delay
      } else {
        toast.error(res.data.message || "Registration failed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed due to a server error!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'password', 'phone', 'hospital'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Register</button>
      </form>
      <ToastContainer 
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
       {/* Add ToastContainer to render notifications */}
    </div>
  );
};

export default Register;
