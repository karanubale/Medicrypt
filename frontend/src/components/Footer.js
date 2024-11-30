import React from 'react';
import { Link } from 'react-router-dom';
import "./footer.css";

const Footer = () => {
    return (
        <>
            {/* <hr /> */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-row">
                        <div className="footer-column">
                            <h2>MediCrypt</h2>
                        </div>
                        <div className="footer-column">
                            <h5>About Us</h5>
                            <p>
                            AI-Enabled Digital Prescription Generator for Enhanced Healthcare Efficiency.
                            </p>
                        </div>
                        <div className="footer-column">
                            <h5>Contact Us</h5>
                            <ul className="list-unstyled">
                                <li>Email: MediCrypt.ai@gmail.com</li>
                                <li>Phone: 9373915553</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h5>Follow Us</h5>
                            <ul className="footer-links">
                                <li className="footer-link-item">
                                    <Link to="#" aria-label="Facebook">
                                        <i className="fab fa-facebook"></i>
                                    </Link>
                                </li>
                                <li className="footer-link-item">
                                    <Link to="#" aria-label="Twitter">
                                        <i className="fab fa-twitter"></i>
                                    </Link>
                                </li>
                                <li className="footer-link-item">
                                    <Link to="#" aria-label="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </Link>
                                </li>
                                <li className="footer-link-item">
                                    <Link to="#" aria-label="LinkedIn">
                                        <i className="fab fa-linkedin"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <div className="footer-bottom">
                        <div className="footer-left">
                            <p>&copy; 2024 Your Website. All rights reserved.</p>
                        </div>
                        <div className="footer-right">
                            <ul className="footer-links">
                                <li className="footer-link-item">
                                    <Link to="#">Privacy Policy</Link>
                                </li>
                                <li className="footer-link-item">
                                    <Link to="#">Terms of Service</Link>
                                </li>
                                <li className="footer-link-item">
                                    <Link to="#">Sitemap</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
