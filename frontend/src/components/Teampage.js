import React from 'react';
import './Teampage.css';
// import a from "../assets/Images/anonymous.png";
import karan from "../assets/Images/karan.jpg";
import akash from "../assets/Images/akash.jpg";
import shreya from "../assets/Images/shreya.jpg";

export default function Teampage() {
    return (
        <div id="teampage">
            <div className="container">
                <h3 className="team-title">Team</h3>
                <div className="card-deck">
                    {[

                       
                        {
                            name: "Karan Ubale",
                            info: "Computer Engineering ",
                            linkedin: "https://www.linkedin.com/in/karan-ubale/",
                            github: "https://github.com/karanubale",
                        },
                        {
                            name: "Akash Nimbalkar",
                            info: "Computer Engineering",
                            linkedin: "https://www.linkedin.com/in/akash-nimbalkar-711691231/",
                            github: "https://github.com/Akash-Nimbalkar",
                        },
                        {
                            name: "Shreya Patil",
                            info: "Computer Engineering",
                            linkedin: "https://www.linkedin.com/in/shreya-patil-20244a225/",
                            github: "https://www.linkedin.com/in/shreya-patil-20244a225/",
                        },
                    ].map((person, index) => (
                        <div className="card single-person" key={index}>
                            <div className="image-container">
                                <img
                                    className="card-img"
                                    src={index === 0 ? karan : index === 1 ? akash : shreya}
                                    alt={`${person.name}'s Avatar`}
                                />
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">{person.name}</h4>
                                <p className="card-info">{person.info}</p>
                                <div className="social">
                                    {person.linkedin && (
                                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-linkedin"></i>
                                        </a>
                                    )}
                                    {person.github && (
                                        <a href={person.github} target="_blank" rel="noopener noreferrer">
                                            <i className="fab fa-github"></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
