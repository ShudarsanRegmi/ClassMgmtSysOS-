import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaUserCircle, 
  FaSignInAlt, 
  FaUserPlus, 
  FaTachometerAlt, 
  FaBell, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaCog
} from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
    ${isActive(path) 
      ? 'bg-white text-blue-600 shadow-sm' 
      : 'text-white hover:bg-white/10'
    }
  `;

  const mobileNavLinkClass = (path) => `
    flex items-center gap-2 px-4 py-3 transition-all duration-200 text-gray-700
    ${isActive(path) 
      ? 'bg-blue-50 text-blue-600' 
      : 'hover:bg-gray-50'
    }
  `;

  const renderNavLinks = (isMobile = false) => {
    const baseClass = isMobile ? mobileNavLinkClass : navLinkClass;

    if (!currentUser) {
      return (
        <>
          <Link to="/login" className={baseClass('/login')} onClick={() => setIsOpen(false)}>
            <FaSignInAlt className="h-4 w-4" />
            <span>Login</span>
          </Link>
          <Link to="/register" className={baseClass('/register')} onClick={() => setIsOpen(false)}>
            <FaUserPlus className="h-4 w-4" />
            <span>Register</span>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link to="/dashboard" className={baseClass('/dashboard')} onClick={() => setIsOpen(false)}>
          <FaTachometerAlt className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link to="/notices" className={baseClass('/notices')} onClick={() => setIsOpen(false)}>
          <FaBell className="h-4 w-4" />
          <span>Notices</span>
        </Link>
      </>
    );
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <FaHome className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-wide">
              ClassRoom
              <span className="text-blue-200">Management</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-2">
              {renderNavLinks()}
            </nav>

            {/* User Profile Dropdown - Desktop */}
            {currentUser && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {userProfile?.photoUrl ? (
                      <img 
                        src={userProfile.photoUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 text-white/80" />
                    )}
                    <span className="font-medium text-sm">
                      {userProfile?.name || currentUser.email}
                    </span>
                    <FaChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-700 border border-gray-100">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUserCircle className="h-4 w-4 text-gray-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaCog className="h-4 w-4 text-gray-400" />
                      <span>Settings</span>
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      to="/logout"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaSignOutAlt className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10">
            <nav className="bg-white rounded-b-xl shadow-xl py-2">
              {renderNavLinks(true)}
              {currentUser && (
                <>
                  {/* User Profile Info - Mobile */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      {userProfile?.photoUrl ? (
                        <img 
                          src={userProfile.photoUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full border-2 border-gray-200"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-700">
                        {userProfile?.name || currentUser.email}
                      </span>
                    </div>
                  </div>
                  {/* Profile Actions - Mobile */}
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUserCircle className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/admin/settings" 
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaCog className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <Link 
                    to="/logout" 
                    className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar; 