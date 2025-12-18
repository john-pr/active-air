import { useTranslation } from "react-i18next";
import { getStatusDetails } from "@shared/lib/utils/pollutantUtils.js";

const ThresholdStatusCard = ({
  status,
  primaryPollutant,
  aqiValue,
  trend,
}) => {
  const { t } = useTranslation("common");
  const statusDetails = getStatusDetails(status);

  const getTrendIcon = () => {
    switch (trend) {
      case "improving":
        return "↓";
      case "degrading":
        return "↑";
      default:
        return "→";
    }
  };

  const getTrendLabel = () => {
    switch (trend) {
      case "improving":
        return t("trend.improving");
      case "degrading":
        return t("trend.degrading");
      default:
        return t("trend.stable");
    }
  };

  const getBackgroundColor = () => {
    const color = statusDetails.color;
    return color + "20"; // 20% opacity
  };

  return (
    <div
      className="rounded border-2 p-4 text-center"
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: statusDetails.color,
      }}
    >
      {/* Icon */}
      <div className="mb-3">
        <span
          className="text-3xl font-bold"
          style={{ color: statusDetails.color }}
        >
          {statusDetails.icon}
        </span>
      </div>

      {/* Status Label */}
      <div
        className="text-lg font-bold mb-1"
        style={{ color: statusDetails.color }}
      >
        {t(statusDetails.label)}
      </div>

      {/* Status Description */}
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        {t(statusDetails.description)}
      </div>

      {/* Primary Pollutant Detail */}
      {primaryPollutant && (
        <div
          className="text-sm font-semibold mb-2"
          style={{ color: statusDetails.color }}
        >
          {primaryPollutant.label}: {primaryPollutant.percentage}% {t("threshold.of_limit")}
        </div>
      )}

      {/* AQI and Trend Row */}
      <div className="flex items-center justify-center gap-4 pt-2 border-t" style={{ borderColor: statusDetails.color + "40" }}>
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t("station_popup.aqi")}
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: statusDetails.color }}
          >
            {aqiValue !== null && aqiValue !== undefined ? aqiValue : "—"}
          </div>
        </div>

        <div className="text-gray-400">|</div>

        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Trend
          </div>
          <div className="flex items-center gap-1">
            <span
              className="text-lg font-bold"
              style={{ color: statusDetails.color }}
            >
              {getTrendIcon()}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {getTrendLabel()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdStatusCard;
