import {
  Map,
  SatelliteDish,
  Locate,
  LocateOff,
  Sun,
  Moon,
} from "lucide-react";

const ICONS = {
  mapLayer: Map,
  satelliteLayer: SatelliteDish,
  geoLocation: Locate,
  geoLocationDisabled: LocateOff,
  lightTheme: Moon,
  darkTheme: Sun,
};

const SIZE = {
  mapLayer: "w-5.5 h-5.5",
  satelliteLayer: "w-5.5 h-5.5",
  geoLocation: "w-5 h-5",
  geoLocationDisabled: "w-5 h-5",
  lightTheme: "w-5 h-5",
  darkTheme: "w-5 h-5",
};

const MapButton = ({ handleClick, type, className = "" }) => {
  const Icon = ICONS[type];
  if (!Icon) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer flex items-center justify-center text-black dark:text-white ${className}`}
      aria-label={type}
    >
      <Icon className={`${SIZE[type]} stroke-current`} />
    </button>
  );
};

export default MapButton;
