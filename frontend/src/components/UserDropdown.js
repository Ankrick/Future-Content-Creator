import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import './UserDropdown.css';

const UserDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button className="user-dropdown-trigger" onClick={toggleDropdown}>
        <div className="user-info">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <span className="user-name">{t('welcomeBack')}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={handleProfile}>
            <User size={16} />
            <span>{t('profile')}</span>
          </div>
          
          <div className="dropdown-item" onClick={handleSettings}>
            <Settings size={16} />
            <span>{t('settings')}</span>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-item logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;