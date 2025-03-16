import React from 'react';
import './style.css';

const Header = () => {
    return (
        <header>
            <span className="logo"><a href="/">SharpDeals</a></span>

            <nav>
                <ul>
                    <li><a href="#hotdeals">HotDeals</a></li>
                    <li><a href="#budgeting">Smart Budgeting</a></li>
                    <li><a href="#shop">Shop with Friend</a></li>
                </ul>
            </nav>

            <div className="auth-buttons">
                <a href="./components/login" className="login-btn">Login</a>
                <a href="./components/signup" className="signup-btn">Sign Up</a>
            </div>
        </header>
    );
};

export default Header;
