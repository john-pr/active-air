import { TileLayer } from "react-leaflet";
import { useTheme } from "../../../../app/hooks.js";

const PROVIDERS = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors',
  },
   osmDark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    subdomains: "abcd",
  },
  sat: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/" +
         "World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

const TileLayerSwitcher = ({ selectedMapLayer  = "osm" }) => {
  const { isDark } = useTheme();

  const provider =
  selectedMapLayer === "osm"
    // ? (isDark ? "osmDark" : "osm")
    ? (isDark ? "osmDark" : "osm")
    : "sat";

  const p = PROVIDERS[provider] ?? PROVIDERS.osm;

  return (
    <TileLayer
      key={provider} 
      url={p.url}
      attribution={p.attribution}
      maxZoom={22}
    />
  );
}

export default TileLayerSwitcher;