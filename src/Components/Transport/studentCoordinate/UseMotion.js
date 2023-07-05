import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react";

function getFrames(from, to, step) {
  console.log("getFrames call");
  let frames = [];
  const fromFeatures = from.features;
  const toFeatures = to.features;

  const segments = fromFeatures.map((val, i) => {
    const lngFrom = val.geometry.coordinates[0];
    const lngTo = toFeatures[i].geometry.coordinates[0];
    const latFrom = val.geometry.coordinates[1];
    const latTo = toFeatures[i].geometry.coordinates[1];
    const directionFrom = val.properties.direction;
    const directionTo = toFeatures[i].properties.direction;
    const lngSegment = (Number(lngTo) - Number(lngFrom)) / step;
    const latSegment = (Number(latTo) - Number(latFrom)) / step;
    const directionSegment =
      (Number(directionTo) - Number(directionFrom)) / step;

    return [lngSegment, latSegment, directionSegment];
  });

  for (let p = 0; p <= step; p++) {
    let frame = {
      type: "FeatureCollection",
      features: [],
    };
    fromFeatures.forEach((val, i) => {
      const lngFrom = val.geometry.coordinates[0];
      const latFrom = val.geometry.coordinates[1];
      const directionFrom = val.properties.direction;
      const feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            Number(lngFrom) + segments[i][0] * p,
            Number(latFrom) + segments[i][1] * p,
          ],
        },
        properties: {
          direction: Number(directionFrom) + segments[i][2] * p,
        },
      };
      frame.features.push(feature);
    });
    frames.push(frame);
  }
  console.log("frames:", frames);
  return frames;
}

export function useMotion(geoData, step, mapObj) {
  const oldGeoData = usePrevious(geoData);
  const [frame, frames] = useFrames(oldGeoData, geoData, step);
  const mapRef = useRef();
  const setMap = useCallback(setMapRef, [mapRef]);

  useLayoutEffect(() => {
    if (frames && frames.length > 1 && mapRef.current) {
      startMove(mapRef.current);
    }
  }, [frames, mapRef.current]);

  function startMove(map) {
    let p = 0;
    if (frames && frames.length > 0) {
      requestAnimationFrame(function animate() {
        console.log("run animation");
        if (map) map.getSource("geo123").setData(frames[p]);
        if (p++ < step) {
          requestAnimationFrame(animate);
        }
      });
    } else console.log("frames:", frames);
  }

  function setMapRef(map) {
    mapRef.current = map;
  }

  return [frame, setMap];
}

function useFrames(from, to, step) {
  const frames = useMemo(
    () =>
      from && to && step && from !== to
        ? getFrames(from, to, step)
        : from && to && step && from === to
        ? [from]
        : [null],
    [from, to, step]
  );

  const oldGeoData = usePrevious(from);
  const frame = useMemo(
    () => (frames && frames[0] ? frames[0] : oldGeoData),
    [frames, oldGeoData]
  );

  return [frame, frames];
}

function usePrevious(value) {
  const ref = useRef(value);

  const hasChanged = ref.current !== value;

  useEffect(() => {
    if (hasChanged) ref.current = value;
  }, [value]);

  return ref.current;
}
