import { POLLUTANT_THRESHOLDS, STATUS_THRESHOLDS, STATUS_LEVELS } from "../constants/pollutantThresholds.js";

/**
 * Calculate percentage of safety threshold for a pollutant value
 * @param {number} value - Current pollutant concentration
 * @param {string} pollutantCode - Pollutant identifier (pm10, pm25, o3, no2, so2)
 * @returns {number|null} Percentage of threshold (null if insufficient data)
 */
export const getThresholdPercentage = (value, pollutantCode) => {
  if (value === null || value === undefined || typeof value !== "number") {
    return null;
  }

  const thresholdData = POLLUTANT_THRESHOLDS[pollutantCode];
  if (!thresholdData) return null;

  // Use 24-hour threshold for all pollutants (most conservative)
  const threshold = thresholdData.threshold24h;
  if (!threshold) return null;

  return Math.round((value / threshold) * 100);
};

/**
 * Determine status level based on threshold percentage
 * @param {number} percentage - Percentage of threshold
 * @returns {string} Status level: 'safe', 'caution', 'hazard', or 'unknown'
 */
export const getStatusFromThreshold = (percentage) => {
  if (percentage === null || percentage === undefined) {
    return "unknown";
  }

  if (percentage <= STATUS_THRESHOLDS.safe.max) {
    return "safe";
  }
  if (percentage <= STATUS_THRESHOLDS.caution.max) {
    return "caution";
  }
  return "hazard";
};

/**
 * Get the overall status across all pollutants
 * Status priority: hazard > caution > safe > unknown
 * @param {Object} thresholdPercentages - Map of pollutant codes to percentages
 * @returns {string} Overall status level
 */
export const getOverallStatus = (thresholdPercentages) => {
  const statuses = Object.values(thresholdPercentages)
    .filter((val) => val !== null && val !== undefined)
    .map((percentage) => getStatusFromThreshold(percentage));

  if (statuses.includes("hazard")) return "hazard";
  if (statuses.includes("caution")) return "caution";
  if (statuses.includes("safe")) return "safe";
  return "unknown";
};

/**
 * Find the pollutant with highest threshold percentage exceedance
 * Used to highlight the primary concern
 * @param {Object} details - Station details with pollutant arrays
 * @returns {Object|null} {code, label, percentage, value} or null if no data
 */
export const getPrimaryPollutant = (details, pollutantLabels = {}) => {
  const pollutantCodes = ["pm10", "pm25", "o3", "no2", "so2"];
  let primaryPollutant = null;
  let maxPercentage = 0;

  pollutantCodes.forEach((code) => {
    const data = details[code];
    if (!data || data.length === 0) return;

    const currentValue = data[data.length - 1]?.value;
    if (currentValue === null || currentValue === undefined) return;

    const percentage = getThresholdPercentage(currentValue, code);
    if (percentage !== null && percentage > maxPercentage) {
      maxPercentage = percentage;
      primaryPollutant = {
        code,
        label: pollutantLabels[code] || code.toUpperCase(),
        percentage,
        value: currentValue,
      };
    }
  });

  return primaryPollutant;
};

/**
 * Calculate trend from measurement series
 * Compares recent measurements to older measurements
 * @param {Array} measurements - Array of {value, dateString} objects
 * @returns {string} Trend: 'improving' (↓), 'stable' (→), or 'degrading' (↑)
 */
export const calculateTrend = (measurements) => {
  if (!measurements || measurements.length < 2) {
    return "stable";
  }

  // Use last 3 measurements vs first 3 measurements if available
  const recentCount = Math.min(3, measurements.length);
  const comparisonCount = Math.min(3, Math.floor(measurements.length / 2));

  if (recentCount === 0 || comparisonCount === 0) {
    return "stable";
  }

  // Calculate average of recent values
  const recentAvg =
    measurements.slice(-recentCount).reduce((sum, m) => sum + (m.value || 0), 0) /
    recentCount;

  // Calculate average of older values (skip first to avoid duplicates)
  const olderStart = Math.max(0, measurements.length - recentCount - comparisonCount);
  const olderEnd = measurements.length - recentCount;
  const olderValues = measurements.slice(olderStart, olderEnd);

  if (olderValues.length === 0) {
    return "stable";
  }

  const olderAvg = olderValues.reduce((sum, m) => sum + (m.value || 0), 0) / olderValues.length;

  const diff = recentAvg - olderAvg;
  const percentChange = (diff / olderAvg) * 100;

  // Classify trend based on percent change
  if (percentChange > 5) {
    return "degrading";
  }
  if (percentChange < -5) {
    return "improving";
  }
  return "stable";
};

/**
 * Get all threshold percentages for a station's details
 * @param {Object} details - Station details object
 * @returns {Object} Map of pollutant codes to percentages
 */
export const getAllThresholdPercentages = (details) => {
  const pollutantCodes = ["pm10", "pm25", "o3", "no2", "so2"];
  const percentages = {};

  pollutantCodes.forEach((code) => {
    const data = details[code];
    if (data && data.length > 0) {
      const currentValue = data[data.length - 1]?.value;
      percentages[code] = getThresholdPercentage(currentValue, code);
    } else {
      percentages[code] = null;
    }
  });

  return percentages;
};

/**
 * Get status level details (label, icon, color)
 * @param {string} statusLevel - Status level ('safe', 'caution', 'hazard', 'unknown')
 * @returns {Object} Status details
 */
export const getStatusDetails = (statusLevel) => {
  return STATUS_LEVELS[statusLevel] || STATUS_LEVELS.unknown;
};
