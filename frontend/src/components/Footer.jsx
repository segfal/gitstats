import React,{useContext, useState, useEffect} from "react";
import "../stylesheets/All_Components.css";
import "../stylesheets/Footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/favicon.png";

const Footer = () => {
    return (
        <div 
        className="footer bg-dark border-top border-body"
        data-bs-theme="dark"
        >
            <img className="logo" src={logo}></img>
            <p className="copyright">&copy; {new Date().getFullYear()} GitSight. For insight into your code. All rights reserved.</p>
        </div>
    )
}

export default Footer;