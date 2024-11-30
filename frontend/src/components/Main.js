import React from "react";
// import { Link } from "react-router-dom";
// import { Link } from 'react-router-dom';
import "./Main.css"
import hero from "../assets/Images/hero-img.svg";
const Main = () => {
    return (
        // <div>
        //     <main role="main">
        //         <div className="jumbotron">
        //             <div className="container">
        //                 <h1 className="display-3 my-4">MediCrypt</h1>
        //                 <p>Survey on Automated Recognition of Handwritten Medical Prescriptions for Enhanced Healthcare Efficiency</p>

        //             </div>
        //         </div>

        //         <div className="container">
        //             <div className="row my-4">
        //                 <div className="col-md-4">
        //                     <h2>vision</h2>
        //                     <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>

        //                 </div>
        //                 <div className="col-md-4">
        //                     <h2>Mission</h2>
        //                     <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>

        //                 </div>
        //                 <div className="col-md-4">
        //                     <h2>Goal</h2>
        //                     <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>

        //                 </div>
        //             </div>

        //             <hr />

        //         </div>

        //     </main>
        // </div>
        <div className="page">

            <div className="homecontainer">

                <div className="maincontainer">
                    <div className="container">
                        <div className="row">
                            <div className="col-left">
                                <div className="section-title">
                                    <h1 className="heading">AI-Enabled Digital Prescription Generator
                                        for Enhanced Healthcare Efficiency
                                    </h1>
                                    <p className="description">A Solution to craft precise digital prescriptions from doctor-patient conversations and deliver them directly to patients via phone or email.</p>
                                </div>
                            </div>
                            <div className="col-right">
                                <img src={hero} className="hero-img" alt="hero" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Main;
