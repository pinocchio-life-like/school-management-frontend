import React, { useState } from "react";
import "./ExpandableDiv.css";
const ExpandableDiv = (props) => {
  const indexBool = props.index === 1 ? true : false;
  const [expanded, setExpanded] = useState(indexBool);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="expandable">
      <div className="expandable-header" onClick={toggleExpand}>
        <div
          style={{
            height: 20,
            width: 20,
            marginRight: 20,
            borderRadius: "100%",
            background: "#FF6E31",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}>
          *
        </div>{" "}
        <div style={{ color: "#E3F4F4", fontSize: 18 }}>About Us</div>
      </div>
      <div
        style={{ color: "aliceblue", lineHeight: 1.8, fontSize: 16 }}
        className={`expandable-content ${expanded ? "expanded" : ""}`}>
        <hr
          style={{
            border: "1px solid #f1f1f1",
            width: "100%",
            marginBottom: 20,
          }}
        />
        Founded in 1998, Ozone School has been a trusted institution dedicated
        to providing quality education and nurturing young minds for over two
        decades. With a rich history and a commitment to excellence, we are
        proud to be a leading educational establishment in our community. At
        Ozone School, we believe that education is the key to unlocking the full
        potential of every individual. Our dedicated team of experienced
        educators is passionate about creating a nurturing and inspiring
        environment where students can thrive academically, socially, and
        emotionally. With a holistic approach to education, we recognize the
        unique talents, interests, and aspirations of each student. That's why
        we offer a diverse range of academic programs, extracurricular
        activities, and personal development opportunities to cater to their
        individual needs. Academically, we follow a comprehensive curriculum
        that promotes critical thinking, problem-solving skills, and a lifelong
        love for learning. Our committed teachers provide personalized
        attention, ensuring that each student receives the support they need to
        reach their full potential.
      </div>
    </div>
  );
};

export default ExpandableDiv;
