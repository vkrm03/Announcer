import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api_url from '../../public/assets/api_url.js';
import '../../public/LoginForm.css';

const LoginForm = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(api_url + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true); // Updates App state
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonText: 'Continue',
        }).then(() => {
          navigate('/dash'); // Redirect to dashboard
        });
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: data.msg,
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  return (
    <div className="login-div">
      <div className="shape"></div>
      <div className="shape"></div>
      <form onSubmit={handleLogin}>
        <h3>Login Here</h3>
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
