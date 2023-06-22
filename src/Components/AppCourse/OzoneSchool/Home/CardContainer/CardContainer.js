import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import image1 from "../../../../../Resources/CardImages/716HH61BlzL._AC_UF1000,1000_QL80_.jpg";
import image2 from "../../../../../Resources/CardImages/81HXSzI7TOL.jpg";
import image3 from "../../../../../Resources/CardImages/91DL8oQ8OmL._AC_UF1000,1000_QL80_.jpg";
import image4 from "../../../../../Resources/CardImages/9781848771604.jpg";
import image5 from "../../../../../Resources/CardImages/DanielandtheLionsActivityBookforBeginners_Page_01-modified (1).jpg";
import image6 from "../../../../../Resources/CardImages/The Fallacy Detective.jpg";
import image7 from "../../../../../Resources/CardImages/TheSabbathActivityBook_Page_01-modified.jpg";
import image8 from "../../../../../Resources/CardImages/the-year-we-learned-to-fly-woodson.jpg.optimal.jpg";
import image9 from "../../../../../Resources/CardImages/716HH61BlzL._AC_UF1000,1000_QL80_.jpg";
import image10 from "../../../../../Resources/CardImages/81HXSzI7TOL.jpg";
import "./CardContainer.css";

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];
const imageWidth = 300;
const containerWidth = images.length * imageWidth - 325;

const CardContainer = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);
  const dragging = useMotionValue(false);

  const slideX = useTransform(
    x,
    [640, -(containerWidth - imageWidth)],
    ["-50px", `-${containerWidth - imageWidth}px`]
  );

  const handleDragStart = () => {
    dragging.set(true);
  };

  const handleDragEnd = (event, info) => {
    dragging.set(false);

    const swipeThreshold = imageWidth / 2;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? -1 : 1;
      const nextIndex =
        (activeIndex + direction + images.length) % images.length;
      setActiveIndex(nextIndex);
      const destination = direction * imageWidth * nextIndex;
      x.set(-destination);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="card-container-wrapper">
      <div className="card-container-scroll">
        <motion.div
          style={{
            display: "flex",
            width: containerWidth,
            height: "350px",
            x: slideX,
            cursor: dragging.get() ? "grabbing" : "grab",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: -(containerWidth - imageWidth) }}
          dragElastic={0.5}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}>
          {images.map((image, index) => {
            return (
              <motion.img
                className="PopupImageContainer"
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                style={{
                  border: "2px solid rgba(40, 21, 136, 0.8)",
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                  borderRadius: 9,
                  marginRight: 20,
                  padding: 10,
                  width: imageWidth,
                  height: "350px",
                }}
              />
            );
          })}
        </motion.div>
      </div>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <div
            key={index}
            className={`carousel-indicator ${
              index === activeIndex ? "active" : ""
            }`}
            onClick={() => {
              setActiveIndex(index);
              x.set(-index * imageWidth);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
