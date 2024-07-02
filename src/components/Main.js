import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./main.css";


const Main = ({ className = "" }) => {
    const navigate = useNavigate();
  
    const handleLoginClick = () => {
      navigate("/login");
    };
  
    return (
      <div className={`main ${className}`} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="main-inner">
          <div className="frame-parent">
            <div className="frame">
              <img
                className="login-page"
                loading="lazy"
                alt="YOUDO PICT"
                src="/youdo.png"
              />
            </div>
            <button className="auto-layout-vertical" onClick={handleLoginClick}>
              Get Started
            </button>
          </div>
        </div>
        <div className="auto-layout-vertical1">
          <div className="by-signing-in">
            By signing in, you acknowledge and agree to our
          </div>
          <div className="legal-terms-and-privacy-policy-wrapper">
            <div className="legal-terms-and">Legal Terms and Privacy Policy.</div>
          </div>
        </div>
      </div>
    );
  };


Main.propTypes = {
  className: PropTypes.string,
};

export default Main;