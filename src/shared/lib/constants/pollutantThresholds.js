/**
 * WHO and EU air quality thresholds for pollutants
 * Used to calculate % of safety limit and determine air quality status
 *
 * References:
 * - WHO Air Quality Guidelines 2021
 * - EU Directive 2008/50/EC
 */

export const POLLUTANT_THRESHOLDS = {
  pm10: {
    // PM10 (Particulate Matter ≤10 micrometers)
    unit: "µg/m³",
    threshold24h: 45, // WHO 24-hour average guideline
    thresholdDaily: 150, // EU daily limit (averaged over 24h)
  },
  pm25: {
    // PM2.5 (Fine Particulate Matter ≤2.5 micrometers)
    unit: "µg/m³",
    threshold24h: 15, // WHO 24-hour average guideline
    thresholdDaily: 35, // EU daily limit (averaged over 24h)
  },
  o3: {
    // Ozone (O₃)
    unit: "µg/m³",
    threshold1h: 100, // WHO 1-hour mean guideline
    thresholdDaily: 60, // EU target value (8-hour mean, daily max)
  },
  no2: {
    // Nitrogen Dioxide (NO₂)
    unit: "µg/m³",
    threshold1h: 200, // EU limit value (1-hour mean)
    threshold24h: 40, // WHO/EU 24-hour annual mean
  },
  so2: {
    // Sulfur Dioxide (SO₂)
    unit: "µg/m³",
    threshold1h: 350, // EU limit value (1-hour mean)
    threshold24h: 125, // EU/WHO 24-hour mean
  },
};

/**
 * Threshold percentage ranges for status determination
 * These ranges define when air transitions from safe → caution → hazard
 */
export const STATUS_THRESHOLDS = {
  safe: { min: 0, max: 100 }, // 0-100% of limit
  caution: { min: 100, max: 200 }, // 100-200% of limit
  hazard: { min: 200, max: Infinity }, // 200%+ of limit
};

/**
 * Status levels with semantic meaning
 */
export const STATUS_LEVELS = {
  safe: {
    label: "status.safe",
    description: "status.safe_desc",
    icon: "✓",
    color: "#1e8449", // green
  },
  caution: {
    label: "status.caution",
    description: "status.caution_desc",
    icon: "⚠",
    color: "#f39c12", // orange
  },
  hazard: {
    label: "status.hazard",
    description: "status.hazard_desc",
    icon: "⛔",
    color: "#e74c3c", // red
  },
  unknown: {
    label: "status.unknown",
    description: "status.unknown_desc",
    icon: "?",
    color: "#95a5a6", // gray
  },
};
