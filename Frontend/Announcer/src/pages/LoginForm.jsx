import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api_url from '../../public/assets/api_url.js';
import '../../public/LoginForm.css';

const LoginForm = ({ setIsLoggedIn }) => {
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(api_url + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonText: 'Continue',
        }).then(() => navigate('/dash'));
      } else {
        Swal.fire({ title: 'Login Failed', text: data.msg, icon: 'error' });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong. Try again later.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(api_url + '/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword: oldPwd, newPassword: newPwd }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: 'Password Changed!',
          text: 'You can now log in with the new password.',
          icon: 'success',
        }).then(() => {
          setIsChangingPwd(false);
          setEmail('');
          setOldPwd('');
          setNewPwd('');
        });
      } else {
        Swal.fire({ title: 'Failed', text: data.msg, icon: 'error' });
      }
    } catch (error) {
      console.error('Change password error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-div">
      <div className="shape"></div>
      <div className="shape"></div>

      {loading ? (
        <div className="loader">Processing...</div>
      ) : !isChangingPwd ? (
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
          <p>
            Wanna change password?{' '}
            <span className="change-pwd" onClick={() => setIsChangingPwd(true)}>
              click here
            </span>
          </p>
          <button type="submit">Log In</button>
        </form>
      ) : (
        <form onSubmit={handleChangePassword}>
          <h3>Change Password</h3>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            required
          />
          <p>
            Back to{' '}
            <span className="change-pwd" onClick={() => setIsChangingPwd(false)}>
              Login
            </span>
          </p>
          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
