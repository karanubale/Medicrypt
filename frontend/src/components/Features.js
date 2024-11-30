import React from 'react';
import './Features.css';

import img1 from '../assets/Images/1.svg';
import img2 from '../assets/Images/2.svg';
import img3 from '../assets/Images/3.svg';
import img4 from '../assets/Images/4.svg';

export default function Features() {
    return (
        <section id="features">
            <div className="container">
                <h3>Why Prescription.ai?</h3>
                <div className="row">
                    <div className="feature-box">
                        <img src={img4} alt="AI Technology" />
                        <p>Prescription Generated using AI Technology.</p>
                    </div>
                    <div className="feature-box">
                        <img src={img1} alt="Medical History" />
                        <p>Patients' medical history on the go.</p>
                    </div>
                    <div className="feature-box">
                        <img src={img2} alt="Digital Prescription" />
                        <p>Copy of Digital Prescription with Patient.</p>
                    </div>
                    <div className="feature-box">
                        <img src={img3} alt="Verified Prescription" />
                        <p>Verified Prescription.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
