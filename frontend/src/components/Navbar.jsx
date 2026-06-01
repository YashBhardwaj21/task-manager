import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--bg-color)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Task Manager</h2>
        
        {user && (
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/" style={{ fontWeight: 500 }}>Dashboard</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ fontWeight: 500 }}>Admin</Link>
            )}
            <a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>API Docs</a>
          </div>
        )}
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
          <span className={`badge ${user.role === 'admin' ? 'badge-high' : 'badge-low'}`}>
            {user.role.toUpperCase()}
          </span>
          <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border-color)' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
