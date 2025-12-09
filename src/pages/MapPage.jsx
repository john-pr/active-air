import {useEffect, useState, useCallback, useMemo} from "react";
import MapView from "../features/map/MapView.jsx";
import { useParams, Outlet } from "react-router";
import MapButton from "../features/map/ui/MapButton.jsx";
import LocationBlockedModal from "../features/map/ui/LocationBlockedModal.jsx";
import ThreeDots from "../assets/loaders/threeDots.svg?react";
import { useStationsAndIndicesBootstrap } from "../features/stations/hooks/useStationsAndIndicesBootstrap.js";
import { useIndicesForViewport } from "../features/stations/hooks/useIndicesForViewport.js";
import { useDebouncedValue } from "../app/hooks.js";
import { useThrottledCallback } from "../features/map/hooks/useThrottledCallback.js"; 
import { useTheme } from "../app/hooks.js";
import MapControls from "../features/map/ui/MapControls.jsx"; 

const EPS = 1e-5;

const MapPage = () => {
    const { stationId } = useParams();
    const { toggleTheme, isDark } = useTheme();
    const { stations = [], status, error } = useStationsAndIndicesBootstrap();

    //bbox - bounding box of current viewport
    const [bbox, setBbox] = useState(null);
    const debouncedBbox = useDebouncedValue(bbox, 500);

    //compares two bounding boxes with tolerance
    const sameBbox = useCallback((a, b) => {
      if (!a || !b) return false;
      return (
        Math.abs(a.minLat - b.minLat) < EPS &&
        Math.abs(a.maxLat - b.maxLat) < EPS &&
        Math.abs(a.minLon - b.minLon) < EPS &&
        Math.abs(a.maxLon - b.maxLon) < EPS
      );
    }, []);

    const handleViewportChange = useCallback((newBbox) => {
      setBbox(prev => (sameBbox(prev, newBbox) ? prev : newBbox));
    }, [sameBbox]);

    const onViewPortChange = useThrottledCallback(handleViewportChange, 200);
    


    const stationsInView = useMemo(() => {
      if (!debouncedBbox) return [];

      return stations.filter((s) =>
        s.lat >= debouncedBbox.minLat &&
        s.lat <= debouncedBbox.maxLat &&
        s.lon >= debouncedBbox.minLon &&
        s.lon <= debouncedBbox.maxLon
      );
    }, [stations, debouncedBbox]);

    //Debugging
    //   useEffect(() => {
    //   if (!bbox) return;
    //   const ids = stationsInView.map(s => s.id);
    //   console.log("[viewport] stationsInView count:", ids.length);
    //   console.log("[viewport] stationsInView ids:", ids.slice(0, 50)); // nie spamuj całymi 500
    // }, [bbox, stationsInView]);

    const indicesById = useIndicesForViewport(stationsInView);

    const [selectedMapLayer, setSelectedMapLayer] = useState(() => {
        // Initialize from local storage or default to "osm"
        const savedLayer = localStorage.getItem("selectedMapLayer");
        return savedLayer || "osm";
    });
    
    const [isLayerReady, setIsLayerReady] = useState(false);
    const [mapCenter, setMapCenter] = useState([52.23, 21]); // Default: Warsaw
    const [mapZoom, setMapZoom] = useState(13);
    const [geoConsent, setGeoConsent] = useState(null);
    const [isBrowserBlocked, setIsBrowserBlocked] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);

    // Capture initial stationId from URL (only on first render)
    const [initialStationId] = useState(() => stationId);

    // Compute initial center/zoom for station from URL
    const initialStationTarget = useMemo(() => {
        if (!initialStationId) return null;
        if (status !== "succeeded" || !stations.length) return null;

        const station = stations.find(s => String(s.id) === initialStationId);
        if (station) {
            return { center: [station.lat, station.lon], zoom: 15 };
        }
        return null;
    }, [initialStationId, stations, status]);

    // Effective center/zoom: use URL station target if available, otherwise user state
    const effectiveCenter = initialStationTarget?.center ?? mapCenter;
    const effectiveZoom = initialStationTarget?.zoom ?? mapZoom;

    // Load layer from local storage on mount
    useEffect(() => {
        const savedLayer = localStorage.getItem("selectedMapLayer");
        if (savedLayer) {
            setSelectedMapLayer(savedLayer);
        }
        setIsLayerReady(true);
    }, []);

    // Check browser geolocation permission on mount
    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'denied') {
                    setGeoConsent(false);
                } else if (result.state === 'granted') {
                    setGeoConsent(true);
                } else {
                    // 'prompt' state - permission not yet decided
                    setGeoConsent(null);
                }
            }).catch(() => {
                // Fallback if permissions API not available
                setGeoConsent(null);
            });
        } else {
            setGeoConsent(null);
        }
    }, []);

    const getUserLocation = (shouldZoom = false) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = [position.coords.latitude, position.coords.longitude];
                    setMapCenter(newCenter);
                    setGeoConsent(true);
                    
                    // If shouldZoom is true, we'll pass zoom info to MapView
                    if (shouldZoom) setMapZoom(13);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    if (error.code === error.PERMISSION_DENIED) {
                        setGeoConsent(false);
                        setIsBrowserBlocked(true);
                    }
                }
            );
        }
    };

    const handleBlockedModalClose = () => {
        setShowBlockedModal(false);
    };

    const handleGeoButtonClick = () => {
        if (geoConsent === false || isBrowserBlocked) {
            // Location is blocked, show instructions
            setShowBlockedModal(true);
        } else {
            // Location enabled or prompt state - try to get location and zoom
            getUserLocation(true);
        }
    };

    // Save to local storage whenever layer changes
    useEffect(() => {
        if (isLayerReady) {
            localStorage.setItem("selectedMapLayer", selectedMapLayer);
        }
    }, [selectedMapLayer, isLayerReady]);


    if (!isLayerReady || status === "loading") {
        return (
          <div className="flex min-h-dvh w-dvw items-center justify-center">
            <ThreeDots
              className="
                w-[12vw] max-w-14 min-w-6
                aspect-60/16 h-auto
                text-blue-500
              "
            />
          </div>
        )
    }

    if (status === "failed") return <></>;

    return (
        <div className="h-screen w-screen relative">   
          {showBlockedModal && (
            <LocationBlockedModal 
              onClose={handleBlockedModalClose}
            />
          )}
          <MapControls
            isDark={isDark}
            toggleTheme={toggleTheme}
            geoConsent={geoConsent}
            handleGeoButtonClick={handleGeoButtonClick}
            selectedMapLayer={selectedMapLayer}
            setSelectedMapLayer={setSelectedMapLayer}
          />
          <MapView
           selectedStationId={stationId}
           selectedMapLayer={selectedMapLayer}
           center={effectiveCenter}
           stations={stations}
           indicesById={indicesById}
           onViewPortChange={onViewPortChange}
           zoom={effectiveZoom}
           flyToStation={!!initialStationTarget}
          />
          <Outlet />
        </div>
    );
};

export default MapPage;
