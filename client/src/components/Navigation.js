import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="nav">
      <div className="nav-container">
        <div>
          <h2>CRM - Психологический центр</h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/')}>Главная</Link></li>
          <li><Link to="/clients" className={isActive('/clients')}>Клиенты</Link></li>
          <li><Link to="/psychologists" className={isActive('/psychologists')}>Психологи</Link></li>
          <li><Link to="/appointments" className={isActive('/appointments')}>Записи</Link></li>
          <li><Link to="/sessions" className={isActive('/sessions')}>Сеансы</Link></li>
          <li><Link to="/payments" className={isActive('/payments')}>Платежи</Link></li>
          {user && (
            <li>
              <span style={{ marginRight: '10px' }}>{user.full_name}</span>
              <button onClick={logout} className="btn btn-secondary">Выход</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
