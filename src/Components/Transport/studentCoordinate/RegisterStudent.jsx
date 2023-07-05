import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

function RegisterStudent() {
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmV0YXdlciIsImEiOiJjazJld3N3NTMwZTNrM2xtbXVsc3ZhbG80In0.pDFq8W8k0g8FBZgZ9nitpg";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center,
      zoom: 15,
    });

    return () => {
      map.remove();
    };
  }, [center]);
  return (
    <div>
      <div
        id="map"
        style={{
          width: "800px",
          height: "800px",
        }}
      ></div>
    </div>
  );
}

export default RegisterStudent;
