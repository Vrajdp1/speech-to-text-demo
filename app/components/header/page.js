import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/app/utils/auth-context';
import './style.css';

const Header = () => {
  const { user, firebaseSignOut } = useUserAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      console.log('User signed out successfully');
      // Optionally, redirect the user or perform additional actions upon sign-out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };
  // Update currentPath when the URL changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Function to handle navigation
  const navigate = (path) => (event) => {
    event.preventDefault();
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <header>
      <span className="logo">
        <a href="/">EchoDeals</a>
      </span>

      <nav id="mainNav">
        <ul>
          <li><a href="/hotdeals" onClick={navigate('/hotdeals')}>HotDeals</a></li>
          <li><a href="/budgeting" onClick={navigate('/budgeting')}>Smart Budgeting</a></li>
          <li><a href="/shop" onClick={navigate('/shop')}>Shop with Friend</a></li>
        </ul>
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div>
            <a href="/components/myaccount/"  className="login-btn">My Account</a>
            <a href="#" onClick={handleSignOut} className="signup-btn">Logout</a>
          </div>

  ) : (
          <>
            <a href="./components/login/"  className="login-btn">Login</a>
            <a href="./components/signup"  className="signup-btn">Sign Up</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
