import React, { useEffect } from "react";
import { MapContainer, ZoomControl, useMap } from "react-leaflet";
import TileLayerSwitcher from "./layers/TileLayerSwitcher";
import MapEvents from "./MapEvents";
import StationsClusterLayer from "./layers/StationsClusterLayer";

const MapCenterUpdater = ({ center, flyToStation, isPanelOpen }) => {
    const map = useMap();

    useEffect(() => {
        if (!center) return;

        // If flyToStation is set, do a smooth flyTo animation (for URL station entry)
        if (flyToStation) {
            // Start at zoom 12, then fly to zoom 14
            map.setView(center, 12);
            setTimeout(() => {
                map.flyTo(center, 14, { duration: 1.5 });
            }, 100);
            return;
        }

        // Regular center update
        if (center.length === 3) {
            map.setView([center[0], center[1]], center[2]);
        } else {
            map.setView(center, map.getZoom());
        }
    }, [center, flyToStation, map]);

    // When panel closes, adjust the map view to compensate for the offset
    useEffect(() => {
        if (isPanelOpen === undefined) return;

        if (!isPanelOpen) {
            // Panel just closed, shift the map right by 160px to keep the same location visible
            const panelWidth = 320;
            const currentCenter = map.getCenter();
            const centerPixel = map.project([currentCenter.lat, currentCenter.lng], map.getZoom());
            const adjustedCenter = map.unproject([centerPixel.x + panelWidth / 2, centerPixel.y], map.getZoom());

            map.setView(adjustedCenter, map.getZoom());
        }
    }, [isPanelOpen, map]);

    return null;
};

const MapView = props => {
    const { selectedStationId, selectedMapLayer, center, stations, indicesById, onViewPortChange, zoom, flyToStation, isPanelOpen, selectedStationCircleData } = props;


    return (
        <MapContainer
            className="h-full w-full z-0"
            id="map"
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            zoomControl={false}
        >
             <MapCenterUpdater center={center} flyToStation={flyToStation} isPanelOpen={isPanelOpen} />
             <TileLayerSwitcher selectedMapLayer={selectedMapLayer}/>
             <MapEvents onViewPortChange={onViewPortChange} />
             <StationsClusterLayer
                stations={stations}
                indicesById={indicesById}
                selectedStationId={selectedStationId}
                isInitialUrlEntry={flyToStation}
                selectedStationCircleData={selectedStationCircleData}
             />
             <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default MapView;
