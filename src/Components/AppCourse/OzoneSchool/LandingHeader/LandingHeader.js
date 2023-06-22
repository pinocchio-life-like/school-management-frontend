import React, { useState } from "react";
import "./LandingHeader.css";
import { useNavigate } from "react-router-dom";

const LandingHeader = (props) => {
  const [routedItem, setRoutedItem] = useState("");
  const navigate = useNavigate();

  return (
    <div
      className={`LandingHeader ${props.isTransparent ? "transparent" : ""}`}>
      <div className="LandingHeaderLogo">Ozone School</div>
      <div className="LandingHeaderMenu">
        <div
          className={`LandingMenuItems ${
            routedItem === "about" ? "ItemSelectedClass" : ""
          }`}
          onClick={() => {
            props.routedItem("about");
            setRoutedItem("about");
          }}>
          About Us
        </div>
        <div
          className={`LandingMenuItems ${
            routedItem === "testimonials" ? "ItemSelectedClass" : ""
          }`}
          onClick={() => {
            props.routedItem("testimonials");
            setRoutedItem("testimonials");
          }}>
          Testimonials
        </div>
        <div
          className={`LandingMenuItems ${
            routedItem === "career" ? "ItemSelectedClass" : ""
          }`}
          onClick={() => {
            props.routedItem("career");
            setRoutedItem("career");
          }}>
          Career
        </div>
        <div
          className={`LandingMenuItems ${
            routedItem === "contact" ? "ItemSelectedClass" : ""
          }`}
          onClick={() => {
            props.routedItem("contact");
            setRoutedItem("contact");
          }}>
          Contact
        </div>
      </div>
      <div
        className="LandingHeaderLogin"
        onClick={() => {
          navigate("/login");
        }}>
        Login
      </div>
    </div>
  );
};

export default LandingHeader;
