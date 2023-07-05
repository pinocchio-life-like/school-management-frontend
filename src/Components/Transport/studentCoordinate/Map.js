import React, {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import ReactMapboxGl, {
  Image,
  GeoJSONLayer,
  MapContext,
} from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMotion } from "./UseMotion.js";
import van from "./van_0.png";
const Mapbox = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoicmV0YXdlciIsImEiOiJjazJld3N3NTMwZTNrM2xtbXVsc3ZhbG80In0.pDFq8W8k0g8FBZgZ9nitpg",
});
const center = [30, 60];
const step = 5;
const inter = [
  "interpolate",
  ["linear"],
  ["to-number", ["get", "direction"]],
  0,
  0,
  360,
  360,
];
const layout = {
  "icon-image": "vehicle",
  "icon-rotate": inter,
  "icon-size": 0.35,
  "icon-ignore-placement": true,
  "icon-allow-overlap": true,
};
function getFeatures(data) {
  return data.map((i) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [i.lng, i.lat],
    },
    properties: {
      direction: i.direction,
    },
  }));
}

export default function Map({ dataSrc }) {
  const [selected, setSelected] = useState(1);
  const mapRef = useRef();
  const step = 120;
  const geoData = useMemo(
    () => ({
      type: "FeatureCollection",
      features: getFeatures(dataSrc[selected]),
    }),
    [dataSrc, selected]
  );

  const [frame, setMap] = useMotion(geoData, step);
  console.log("frame", frame);
  useLayoutEffect(() => {
    mapRef.current && mapRef.current.getSource("geo123").setData(frame);
  }, [frame, mapRef.current]);
  function handleUpdate() {
    setSelected(selected === 0 ? 1 : 0);
  }
  function onMapLoad(map) {
    mapRef.current = map;
    setMap(map);
    console.log("onMapLoad", map);
  }
  return (
    <>
      <button onClick={handleUpdate} style={{ margin: "5px" }}>
        Update Data
      </button>
      <Mapbox
        style="mapbox://styles/mapbox/streets-v8"
        containerStyle={{
          height: "100%",
          width: "100%",
        }}
        center={center}
        zoom={[12]}
        onDragEnd={(map, e) => console.log("Bounds:", map.getBounds())}
        onClick={(map, e) => console.log("clicked", e.lngLat)}
        onStyleLoad={(map) => onMapLoad(map)}
      >
        <Image
          id={"vehicle"}
          url={van}
          options={{ width: 20, height: 20 }}
          alt=""
        />
        {console.log("frame inside map", frame)}
        <GeoJSONLayer id={"geo123"} data={frame} symbolLayout={layout} />
      </Mapbox>
    </>
  );
}
