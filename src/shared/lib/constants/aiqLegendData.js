/**
 * Air Quality Index (AQI) legend data with PM thresholds and health recommendations
 * Based on GIOS (Główny Inspektorat Ochrony Środowiska) classifications
 *
 * PM ranges are averaged from PM10 and PM2.5 thresholds:
 * PM10: 0-20, 20.1-50, 50.1-80, 80.1-110, 110.1-150, >150
 * PM2.5: 0-13, 13.1-35, 35.1-55, 55.1-75, 75.1-110, >110
 */

export const AQI_LEGEND_DATA = [
  {
    index: 0,
    labelKey: "legend.very_good",
    pmRange: "0–16.5",
    healthRecommendationKey: "legend.health_very_good",
    activityRecommendationKey: "legend.activity_very_good",
  },
  {
    index: 1,
    labelKey: "legend.good",
    pmRange: "16.6–42.5",
    healthRecommendationKey: "legend.health_good",
    activityRecommendationKey: "legend.activity_good",
  },
  {
    index: 2,
    labelKey: "legend.moderate",
    pmRange: "42.6–67.5",
    healthRecommendationKey: "legend.health_moderate",
    activityRecommendationKey: "legend.activity_moderate",
  },
  {
    index: 3,
    labelKey: "legend.sufficient",
    pmRange: "67.6–92.5",
    healthRecommendationKey: "legend.health_sufficient",
    activityRecommendationKey: "legend.activity_sufficient",
  },
  {
    index: 4,
    labelKey: "legend.bad",
    pmRange: "92.6–150",
    healthRecommendationKey: "legend.health_bad",
    activityRecommendationKey: "legend.activity_bad",
  },
  {
    index: 5,
    labelKey: "legend.very_bad",
    pmRange: ">150",
    healthRecommendationKey: "legend.health_very_bad",
    activityRecommendationKey: "legend.activity_very_bad",
  },
];

export const NO_DATA_ITEM = {
  index: null,
  labelKey: "legend.no_data",
  pmRange: "-",
};
