import MarkerClusterGroup from "react-leaflet-cluster";
import { useMap } from "react-leaflet";
import StationMarker from "./StationMarker.jsx";
import { createClusterIcon } from "../../utils/clusterIcon.js";
import { extractUsableIndexValue } from "../../utils/extractIndexValue.js";

const StationsClusterLayer = ({
  stations,
  indicesById,
  selectedStationId,
  isInitialUrlEntry,
}) => {
  const map = useMap();

  const handleClusterClick = (cluster) => {
    const bounds = cluster.layer.getBounds();
    const currentZoom = map.getZoom();
    const duration = currentZoom >= 12 ? 0.5 : currentZoom >= 9 ? 0.75 : 1;
    map.flyToBounds(bounds, { duration, padding: [50, 50] });
  };

  return (
    <MarkerClusterGroup
      chunkedLoading
      chunkInterval={200}
      chunkDelay={50}
      removeOutsideVisibleBounds
      animate={false}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      maxClusterRadius={40}
      disableClusteringAtZoom={14}
      zoomToBoundsOnClick={false}
      iconCreateFunction={createClusterIcon}
      eventHandlers={{
        clusterclick: handleClusterClick,
      }}
    >
     {stations.map((station) => {
        const indexData = indicesById?.[station.id];
        const usableIndexValue = extractUsableIndexValue(indexData);

        return (
          <StationMarker
            key={station.id}
            station={station}
            indexValue={usableIndexValue}
            isSelected={String(station.id) === selectedStationId}
            isInitialUrlEntry={isInitialUrlEntry && String(station.id) === selectedStationId}
          />
        );
      })}
    </MarkerClusterGroup>
  );
};

export default StationsClusterLayer;
