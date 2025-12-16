import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks.js";
import { fetchStationDetails } from "@features/stationDetails/model/stationDetailsSlice.js";
import {
  selectDetailsForStation,
  selectDetailsStatusForStation,
} from "@features/stationDetails/model/selectors.js";
import { getMarkerColorFromIndexValue } from "@shared/lib/utils/colors.js";
import { useTranslation } from "react-i18next";

const StationDetailsPanel = ({ stationId, indexValue }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  const details = useAppSelector((state) =>
    selectDetailsForStation(state, stationId)
  );
  const status = useAppSelector((state) =>
    selectDetailsStatusForStation(state, stationId)
  );

  const fetchedOnceRef = useRef(false);

  useEffect(() => {
    fetchedOnceRef.current = false;
  }, [stationId]);

  useEffect(() => {
    if (!stationId) return;
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    if (status === "idle" || status === "failed") {
      dispatch(fetchStationDetails(stationId));
    }
  }, [stationId, status, dispatch]);

  const getAqiLabel = (value) => {
    switch (value) {
      case 0: return "legend.very_good";
      case 1: return "legend.good";
      case 2: return "legend.moderate";
      case 3: return "legend.sufficient";
      case 4: return "legend.bad";
      case 5: return "legend.very_bad";
      default: return "legend.no_data";
    }
  };

  const aqiColor = getMarkerColorFromIndexValue(indexValue);
  const aqiBgColor = { backgroundColor: aqiColor + "20", borderColor: aqiColor };
  const aqiTextColor = { color: aqiColor };
  const aqiLabel = getAqiLabel(indexValue);

  return (
    <div className="space-y-4 text-sm text-gray-900 dark:text-gray-100">
      <div className="p-4 rounded border" style={aqiBgColor}>
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: aqiColor }}>
          {t("station_popup.aqi")}
        </div>
        <div className="text-3xl font-bold mb-2" style={aqiTextColor}>
          {indexValue ?? t("station_popup.no_index")}
        </div>
        <div className="text-sm font-semibold" style={aqiTextColor}>
          {t(aqiLabel)}
        </div>
      </div>

      {status === "loading" && (
        <div className="text-gray-600 dark:text-gray-400 text-center py-4">
          {t("station_popup.loading_measurements")}
        </div>
      )}

      {status === "succeeded" && details && (
        <div className="bg-gray-200 dark:bg-gray-600 rounded p-4 space-y-3">
          <div className="border-b border-gray-300 dark:border-gray-500 pb-3">
            <div className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-3">
              {t("station_popup.measurements")}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{t("station_popup.pm10")}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{details.pm10 ?? t("station_popup.no_data")} µg/m³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{t("station_popup.pm25")}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{details.pm25 ?? t("station_popup.no_data")} µg/m³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{t("station_popup.o3")}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{details.o3 ?? t("station_popup.no_data")} µg/m³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{t("station_popup.no2")}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{details.no2 ?? t("station_popup.no_data")} µg/m³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{t("station_popup.so2")}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{details.so2 ?? t("station_popup.no_data")} µg/m³</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="text-gray-600 dark:text-gray-400 text-center py-4">
          {t("station_popup.no_measurements")}
        </div>
      )}
    </div>
  );
};

export default StationDetailsPanel;
