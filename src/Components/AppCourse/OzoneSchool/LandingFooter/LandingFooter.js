import React, { useEffect } from "react";
import "./LandingFooter.css";

import {
  MobileOutlined,
  PhoneOutlined,
  SendOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import facebook from "../../../../Resources/SvgLogos/facebook-1-svgrepo-com.svg";
import telegram from "../../../../Resources/SvgLogos/telegram-svgrepo-com.svg";
import instagram from "../../../../Resources/SvgLogos/instagram-svgrepo-com.svg";
import twitter from "../../../../Resources/SvgLogos/twitter-svgrepo-com.svg";
import linkedin from "../../../../Resources/SvgLogos/linkedin-svgrepo-com.svg";

const LandingFooter = (props) => {
  useEffect(() => {
    if (
      props.routed !== "career" &&
      props.routed !== "home" &&
      props.routed !== "about" &&
      props.routed !== "testimonials"
    ) {
      const element = document.getElementById(props.routed);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.routed]);
  return (
    <div id="contact" className="LandingFooter">
      <div
        style={{
          padding: "4% 8%",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 15 }}>
            Services
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            In Person Classroom
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            Well Put Laboratories
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            Students Playground
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 15 }}>
            Company
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            About us
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            FAQ
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            VAT
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 15 }}>
            Policy
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            Privacy Policy
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            Refund Policy
          </div>
          <div
            style={{
              color: "#8dadc1",
              fontWeight: 600,
              fontSize: 14,
              paddingBottom: 5,
            }}>
            Terms of Service
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 10 }}>
            Contacts
          </div>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 10 }}>
            <MobileOutlined /> +251 940 63 6550
          </div>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 10 }}>
            <PhoneOutlined /> +251 939 43 9998
          </div>
          <div style={{ color: "white", fontWeight: 700, marginBottom: 10 }}>
            <MailOutlined /> icbr19fl@gmail.com
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <img
          style={{ width: 29, height: 29, marginLeft: 5 }}
          src={facebook}
          alt=""
        />
        <img
          style={{ width: 26, height: 26, marginLeft: 5 }}
          src={telegram}
          alt=""
        />
        <img
          style={{ width: 34, height: 34, marginLeft: 5 }}
          src={instagram}
          alt=""
        />
        <img
          style={{ width: 32, height: 32, marginLeft: 5 }}
          src={twitter}
          alt=""
        />
        <img
          style={{ width: 32, height: 32, marginLeft: 5 }}
          src={linkedin}
          alt=""
        />
      </div>
      <hr
        style={{ width: "84%", border: "0.6px solid #f1f1f1", marginTop: 15 }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignSelf: "center",
          margin: "0 8%",
        }}>
        <div style={{ fontSize: 13, color: "#8dadc1" }}>
          © 2017-2023 Ozone™ — Primary School.
        </div>
        <div style={{ fontSize: 13, color: "#8dadc1" }}>Better Education</div>
      </div>
    </div>
  );
};

export default LandingFooter;
