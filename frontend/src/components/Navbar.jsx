import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Store Rating App</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            {user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="navbar-item">Admin Dashboard</Link>
                <Link to="/admin/users" className="navbar-item">Users</Link>
                <Link to="/admin/stores/new" className="navbar-item">Stores Form</Link>
              </>
            )}
            {user.role === 'store-owner' && (
              <Link to="/store-owner/dashboard" className="navbar-item">My Store</Link>
            )}
            <Link to="/stores" className="navbar-item">Stores</Link>
            <Link to="/change-password" className="navbar-item">Change Password</Link>
            <button onClick={handleLogout} className="navbar-item">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;