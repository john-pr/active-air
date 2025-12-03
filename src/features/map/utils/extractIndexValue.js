export function extractUsableIndexValue(indexResponse) {
  const aq = indexResponse?.AqIndex;
  if (!aq) return null;

  const overallStatus = aq["Status indeksu ogólnego dla stacji pomiarowej"];
  const overallValue = aq["Wartość indeksu"];

  // 1) overall ok
  if (overallStatus === true && overallValue >= 0 && overallValue <= 5) {
    return overallValue;
  }

  // 2) overall missing, take the worst
  const partialValues = [
    aq["Wartość indeksu dla wskaźnika PM10"],
    aq["Wartość indeksu dla wskaźnika PM2.5"],
    aq["Wartość indeksu dla wskaźnika NO2"],
    aq["Wartość indeksu dla wskaźnika SO2"],
    aq["Wartość indeksu dla wskaźnika O3"],
  ].filter(v => v !== null && v !== undefined && v >= 0 && v <= 5);

  if (partialValues.length > 0) {
    return Math.max(...partialValues); // worst one - highest value
  }

  // 3) nothing there
  return null;
}
