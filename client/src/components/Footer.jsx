import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../App.css'

const Footer = () => (
  <footer className="text-white pt-5 pb-3" style={{ backgroundColor: '#1f1617' }}>
    <div className="container">
      <div className="row text-center text-md-start">
        {/* About Us */}
        <div className="col-md-4 mb-4">
          <h5 className="text-danger fw-bold mb-3">About Us</h5>
          <p>
            Welcome to <strong>Foodie</strong>, where every dish is crafted with passion and served with care. We celebrate food, flavor, and community.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-md-4 mb-4">
          <h5 className="text-danger fw-bold mb-3">Quick Links</h5>
          <ul className="list-unstyled">
            {[
              { name: 'Home', path: '/' },
              { name: 'Menu', path: '/menu' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact Us', path: '/contact' },
            ].map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.path}
                  className="text-light text-decoration-none d-block py-1 link-hover"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-md-4 mb-4">
          <h5 className="text-danger fw-bold mb-3">Contact Us</h5>
          <p className="mb-1">123 Food Street, Arya Nagar, Mumbai, India</p>
          <p className="mb-1">
            Email:{' '}
            <a
              href="mailto:foodie1234@restaurant.com"
              className="text-light text-decoration-none"
            >
              foodie1234@restaurant.com
            </a>
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="text-center mt-4">
        <h5 className="mb-3 text-danger">Follow Us</h5>
        <div className="d-flex justify-content-center gap-3">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        </div>
      </div>

      <p className="text-center mt-4 mb-0 text-muted">&copy; 2025 Foodie. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
