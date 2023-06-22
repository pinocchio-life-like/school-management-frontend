import React, { useEffect, useState } from "react";
import LandingHeader from "./LandingHeader/LandingHeader";
import "./OzoneSchool.css";
import LandingFooter from "./LandingFooter/LandingFooter";
import bgVideo from "../../../Resources/hero-video-remote.mp4";
import Home from "./Home/Home";

const OzoneSchool = () => {
  const [isTransparent, setIsTransparent] = useState(true);
  const [theItem, setTheItem] = useState("home");
  useEffect(() => {
    const handleScroll = () => {
      setIsTransparent(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const routedItem = (value) => {
    setTheItem(value);
  };
  return (
    <div className="OzoneBody">
      <video autoPlay loop muted className="background-video">
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <LandingHeader routedItem={routedItem} isTransparent={isTransparent} />
      <div className="OzoneBodyContent">
        <Home routed={theItem} />
      </div>
      <LandingFooter routed={theItem} />
    </div>
  );
};

export default OzoneSchool;
