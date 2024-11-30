import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import './ToastStyles.css'; // Import custom Toast styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotpassword, setforgotpassword] = useState('');

  const notify = () =>
    toast.error('Password Does not Match!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const suc = () =>
    toast.success('Login Successfully!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== forgotpassword) {
        notify();
        return;
      }
      const res = await axios.post('http://localhost:8080/api/v1/auth/login', { email, password });
      if (!res.data.success) {
        alert('Invalid credentials');
      } else {
        localStorage.setItem('auth', JSON.stringify(res.data.user));
        suc();
        setTimeout(() => {
          navigate('/'); // Navigate after a slight delay to ensure toast is visible
        }, 2000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed!');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          name="forgotpassword"
          placeholder="Confirm Password"
          value={forgotpassword}
          onChange={(e) => setforgotpassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <ToastContainer 
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </div>
  );
};

export default Login;
