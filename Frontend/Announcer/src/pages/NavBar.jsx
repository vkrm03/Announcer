import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../public/NavBar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className={`navbar ${menuOpen ? "open" : ""}`}>
      <div className="logo">
        <Link to="/"><img src="/assets/univ-logo.png" alt="Logo" className="logo-img" /></Link>
      </div>
      
      {menuOpen ? <button className="hamburger" onClick={toggleMenu}>
        X
      </button> : <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>}
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/events" className="nav-link">Events</Link>
        {!isLoggedIn ? (
          <Link to="/login" className="nav-link">Login</Link>
        ) : (
          <>
            <Link to="/dash" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
