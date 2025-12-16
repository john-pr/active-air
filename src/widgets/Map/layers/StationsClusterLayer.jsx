import MarkerClusterGroup from "react-leaflet-cluster";
import { useMap, Circle } from "react-leaflet";
import { useEffect, useRef } from "react";
import StationMarker from "../components/markers/StationMarker.jsx";
import { createClusterIcon } from "@shared/lib/utils/clusterIcon.js";
import { extractUsableIndexValue } from "@shared/lib/utils/extractIndexValue.js";

const StationsClusterLayer = ({
  stations,
  indicesById,
  selectedStationId,
  isInitialUrlEntry,
  selectedStationCircleData,
}) => {
  const map = useMap();
  const clusterGroupRef = useRef(null);

  const handleClusterClick = (cluster) => {
    const bounds = cluster.layer.getBounds();
    const currentZoom = map.getZoom();
    const duration = currentZoom >= 12 ? 0.5 : currentZoom >= 9 ? 0.75 : 1;
    map.flyToBounds(bounds, { duration, padding: [50, 50] });
  };

  // When indices load, rebuild cluster icons since they depend on indexValue
  useEffect(() => {
    if (clusterGroupRef.current && Object.keys(indicesById).length > 0) {
      clusterGroupRef.current.refreshClusters();
    }
  }, [indicesById]);

  return (
    <>
      <MarkerClusterGroup
        ref={clusterGroupRef}
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

      {/* Circle disabled for now - causing render issues when switching stations
      {selectedStationCircleData && (
        <Circle
          key={`circle-${selectedStationId}`}
          center={[selectedStationCircleData.lat, selectedStationCircleData.lon]}
          radius={1500}
          pathOptions={{
            color: selectedStationCircleData.color,
            weight: 2,
            opacity: 0.3,
            fill: true,
            fillColor: selectedStationCircleData.color,
            fillOpacity: 0.15,
            lineCap: 'round',
            lineJoin: 'round',
          }}
          pane="overlayPane"
        />
      )}
      */}
    </>
  );
};

export default StationsClusterLayer;
