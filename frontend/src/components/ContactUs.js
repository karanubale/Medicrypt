import React, { useState } from 'react';
import './ContactUs.css';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

import '@fortawesome/fontawesome-free/css/all.min.css';

export default function ContactUs() {
    const [email, setEmail] = useState('');

    const sendEmail = (event) => {
        event.preventDefault();

        const serviceID = process.env.REACT_APP_EMAIL; // Your EmailJS Service ID
        const templateID = process.env.REACT_APP_TEMPLATE; // Your EmailJS Template ID
        const userID = process.env.REACT_APP_SECRET_KEY; // Your EmailJS Public Key
        // console.log(serviceID, templateID, userID)
        console.log('Service ID:', process.env.REACT_APP_EMAIL);
        console.log('Template ID:', process.env.REACT_APP_TEMPLATE);
        console.log('User ID:', process.env.REACT_APP_SECRET_KEY);

        emailjs
            .sendForm(serviceID, templateID, event.target, userID)
            .then(
                () => {
                    alert('Email sent successfully!');
                    event.target.reset();
                    setEmail(''); // Clear the email field after sending
                },
                (error) => {
                    console.error('Failed to send email:', error.text);
                    alert('An error occurred. Please try again.');
                }
            );
    };

    return (
        <div id="contactus">
            <h1>Contact Us!</h1>
            <div className="form-container">
                <form className="contact-form" onSubmit={sendEmail}>
                    <input
                        type="email"
                        name="user_email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Work Email Address"
                        required
                        spellCheck="false"
                    />

                    <input
                        type="text"
                        name="subject"
                        className="form-input"
                        placeholder="What's this about?"
                        required
                        spellCheck="false"
                    />
                    <textarea
                        name="message"
                        className="form-textarea"
                        placeholder="Go ahead! We are listening .."
                        rows="5"
                        spellCheck="false"
                        required
                    ></textarea>
                    <button className="form-button" type="submit">
                        Submit
                    </button>
                </form>
            </div>

            <div className="social-icons">
                <Link to="https://www.linkedin.com/in/karan-ubale/" className="hover-fx"><i className="fab fa-linkedin"></i></Link>
                <Link to="https://www.instagram.com/" className="hover-fx"><i className="fab fa-instagram"></i></Link>
                <Link to="https://github.com/karanubale" className="hover-fx"><i className="fab fa-github"></i></Link>
                <Link to="https://www.facebook.com/" className="hover-fx"><i className="fab fa-facebook"></i></Link>
            </div>

            <div className="contact-info">
                <h3>Wanna Connect by Mail?</h3>
                <h4>Email: medicrypt.ai@gmail.com</h4>
            </div>
        </div>
    );
}
