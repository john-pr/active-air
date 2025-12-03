import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import circleSvg from "../../../assets/mapMarkers/circleMarker.svg?raw";
import { getMarkerColorFromIndexValue } from "../utils/colors.js";
import { useNavigate } from "react-router";
import { useMemo, useRef, useEffect } from "react";

const cleanSvg = circleSvg
  .replace(/<\?xml.*?\?>/g, "")
  .replace(/<!DOCTYPE.*?>/g, "");

const buildIcon = (color) =>
  L.divIcon({
    className: "station-marker",
    html: `
      <div class="station-marker__wrap" style="--marker-color:${color}">
        ${cleanSvg}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  });

const StationMarker = ({
  station,
  indexValue,
  onMarkerClick,
}) => {

   const markerRef = useRef(null);
   const navigate = useNavigate();
   const color = getMarkerColorFromIndexValue(indexValue);
   const icon = useMemo(() => buildIcon(color), [color]);

    useEffect(() => {
      if (markerRef.current) {
        markerRef.current.options.indexValue = indexValue; 
      }
    }, [indexValue]);

  return (
    <Marker
      ref={markerRef}
      position={[station.lat, station.lon]}
      icon={icon}
      eventHandlers={{
        click: () => {
          navigate(`/station/${station.id}`);
          if (onMarkerClick) onMarkerClick(station.id);
        },
      }}
      options={{ indexValue }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold">{station.name}</div>
          <div>{station.city ?? "—"}</div>
          <div>{station.address ?? "—"}</div>
          {/* Additional station details can be added here */}
        </div>
      </Popup>
    </Marker>
  );
};

export default StationMarker;
