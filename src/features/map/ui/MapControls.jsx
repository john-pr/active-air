import MapButton from "./MapButton";

const FloatingBtn = ({ className, children }) => (
  <div
    className={
      "absolute right-2.5 z-10 w-8.5 h-8.5 flex items-center justify-center rounded-sm bg-clip-padding shadow-sm border-2 " +
      "bg-white border-[rgba(0,0,0,0.2)] " +
      "hover:bg-gray-100 " +
      "dark:bg-gray-700 dark:hover:bg-gray-600 " +
      className
    }
  >
    {children}
  </div>
);

const MapControls = props => {
  const { isDark, toggleTheme, geoConsent, handleGeoButtonClick, selectedMapLayer, setSelectedMapLayer } = props

  return (
    <>
      <FloatingBtn className="top-2.5">
        <MapButton
          type={isDark ? "darkTheme" : "lightTheme"}
          handleClick={toggleTheme}
        />
      </FloatingBtn>

      <FloatingBtn className="bottom-23">
        <MapButton
          type={geoConsent === false ? "geoLocationDisabled" : "geoLocation"}
          handleClick={handleGeoButtonClick}
        />
      </FloatingBtn>

      <FloatingBtn className="bottom-32">
        <MapButton
          type={selectedMapLayer === "osm" ? "satelliteLayer" : "mapLayer"}
          handleClick={() =>
            setSelectedMapLayer(selectedMapLayer === "osm" ? "sat" : "osm")
          }
        />
      </FloatingBtn>
    </>
  );
}

export default MapControls;