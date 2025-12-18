const ThresholdGaugeRow = ({
  pollutantCode,
  currentValue,
  pollutantLabel,
  thresholdPercentage,
  unit = "µg/m³",
  onTap,
}) => {

  if (currentValue === null || currentValue === undefined || thresholdPercentage === null) {
    return null;
  }

  // Determine color based on threshold percentage
  const getGaugeColor = () => {
    if (thresholdPercentage <= 100) {
      // Safe: grayscale
      return "#d1d5db"; // gray-300
    }
    if (thresholdPercentage <= 200) {
      // Caution: orange
      return "#f39c12";
    }
    // Hazard: red
    return "#e74c3c";
  };

  // Get pollutant-specific colors for label (from current design)
  const getPollutantColor = () => {
    const colors = {
      pm10: "#dc2626",
      pm25: "#ea580c",
      o3: "#ca8a04",
      no2: "#0891b2",
      so2: "#7c3aed",
    };
    return colors[pollutantCode] || "#9ca3af";
  };

  const gaugeColor = getGaugeColor();
  const pollutantColor = getPollutantColor();

  // Calculate bar width: max 70% of container
  const maxBarWidth = 70; // percent
  const gaugeWidth = Math.min((thresholdPercentage / 200) * maxBarWidth, maxBarWidth);

  return (
    <button
      onClick={onTap}
      className="w-full text-left px-4 py-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase" style={{ color: pollutantColor }}>
            {pollutantLabel}
          </div>
        </div>
        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
          {thresholdPercentage}%
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-[70%] h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-300"
            style={{
              width: `${gaugeWidth}%`,
              backgroundColor: gaugeColor,
            }}
          />
        </div>
        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {currentValue.toFixed(1)} {unit}
        </div>
      </div>
    </button>
  );
};

export default ThresholdGaugeRow;
