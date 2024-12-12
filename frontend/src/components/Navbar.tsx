import React, {useEffect} from 'react';
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count')!.textContent = cartCount.toString();
        };

        updateCartCount();

        window.addEventListener('storage', (event) => {
            if (event.key === 'cart') {
                updateCartCount();
            }
        });
    }, []);

    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <h1>EGGTech</h1>
                </div>
                <nav>
                    <a href="home.html">Home</a>
                    <a href="/events.html">Events</a>
                    <a href="sale.html">Sale</a>
                    <a href="contact-us.html">Contact Us</a> 
                    <a href="cart.html" className="cart">
                        <i className="fas fa-shopping-cart"></i>
                        <span id="cart-count" className="cart-count">0</span>
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
