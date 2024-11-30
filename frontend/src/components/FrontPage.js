import React from 'react';
import Main from './Main';
import './FrontPage.css'; // Importing CSS file
import Features from './Features';
import Teampage from './Teampage';
import ContactUs from './ContactUs';
// import HowItWorks from './HowItWorks';

const FrontPage = () => {
  
  return (
    <>
      <Main />
      <Features/>
      {/* <HowItWorks/> */}
      <div className="front-page-container">
        <h1>Services</h1>
        <div className="services-container">
          <div className="service-item">
            <h1>Audio to Prescription</h1>
            <button onClick={() => window.location.href = "/home"}>See</button>
          </div>
          <div className="service-item">
            <h1>Text to Prescription</h1>
            <button onClick={() => window.location.href = "/service2"}>See</button>
          </div>
        </div>

      </div>
      <Teampage/>
      <ContactUs/>
    </>
  );
};

export default FrontPage;
