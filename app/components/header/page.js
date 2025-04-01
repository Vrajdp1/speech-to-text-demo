'use client';
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/app/utils/auth-context';
import './style.css';
import Link from 'next/link';


const Header = () => {
  const { user, firebaseSignOut } = useUserAuth();

  const [currentPath, setCurrentPath] = useState("");

  // Set the current path safely after component mounts (on client only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);

      const handlePopState = () => {
        setCurrentPath(window.location.pathname);
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const navigate = (path) => (event) => {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  return (
    <header>
      <span className="logo">
        <a href="/">EchoDeals</a>
      </span>

      <nav id="mainNav">
        <ul>
          <li><a href="/hotdeals">HotDeals</a></li>
          <li>
  <Link href="/budgeting">Smart Budgeting</Link>
</li>

          <li><a href="/shop" onClick={navigate('/shop')}>Shop with Friend</a></li>
        </ul>
      </nav>

      <div className="auth-buttons">
        {user ? (
          <div>
            <a href="/components/myaccount/" className="login-btn">My Account</a>
            <a href="#" onClick={handleSignOut} className="signup-btn">Logout</a>
          </div>
        ) : (
          <>
            <a href="/components/login/" className="login-btn">Login</a>
            <a href="/components/signup" className="signup-btn">Sign Up</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
