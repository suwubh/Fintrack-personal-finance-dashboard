import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { success, message, jwtToken, name } = res.data;

      if (success) {
        // Save token & user info
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);

        // Mark as authenticated
        setIsAuthenticated(true);

        // Optional animation
        document.querySelector('.login-container').classList.add('success-animation');

        // Redirect after short delay
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        setErrorMessage(message || 'Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('Server error, please try again later');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required
        />

        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
