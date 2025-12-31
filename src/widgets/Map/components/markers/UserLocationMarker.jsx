import L from "leaflet";
import { Marker } from "react-leaflet";
import { useMemo } from "react";

const buildUserLocationIcon = () =>
  L.divIcon({
    className: "user-location-marker",
    html: `
      <div class="user-location-marker__wrap">
        <div class="user-location-marker__pulse"></div>
        <div class="user-location-marker__dot"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -12],
  });

const UserLocationMarker = ({ lat, lon }) => {
  const icon = useMemo(() => buildUserLocationIcon(), []);

  return (
    <Marker
      position={[lat, lon]}
      icon={icon}
    />
  );
};

export default UserLocationMarker;
