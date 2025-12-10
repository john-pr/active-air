import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapEvents = ({ onViewPortChange }) => {
  const map = useMap();

  useEffect(() => {
    if (!onViewPortChange) return;

    const emit = () => {
      const b = map.getBounds();
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();

      const bbox = {
        minLat: sw.lat,
        minLon: sw.lng,
        maxLat: ne.lat,
        maxLon: ne.lng,
      };
    // debugging
    //   console.log("[viewport] bbox", bbox);
      onViewPortChange(bbox);
    };

    map.on("moveend", emit);
    map.on("zoomend", emit);
    emit();

    return () => {
      map.off("moveend", emit);
      map.off("zoomend", emit);
    };
  }, [map, onViewPortChange]);

  return null;
};

export default MapEvents;
