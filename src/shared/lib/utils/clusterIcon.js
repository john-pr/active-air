import L from "leaflet";
import { getMarkerColorFromIndexValue } from "./colors.js";


function getDominantIndexValue(childMarkers) {
  const counts = new Map();
  let hasAnyUsable = false;

  childMarkers.forEach((marker) => {
    const v = marker.options.indexValue;

    if (v === null || v === undefined || v < 0) return;

    hasAnyUsable = true;
    counts.set(v, (counts.get(v) || 0) + 1);
  });

  if (!hasAnyUsable) return null;

  let dominant = null;
  let maxCount = -1;
  counts.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      dominant = value;
    }
  });
  return dominant;
}

export function createClusterIcon(cluster) {
  const children = cluster.getAllChildMarkers();

  const dominantIndexValue = getDominantIndexValue(children);
  const color = getMarkerColorFromIndexValue(dominantIndexValue);
  const count = cluster.getChildCount();

  return L.divIcon({
    html: `
      <div class="cluster-bubble" style="--cluster-color:${color}">
        ${count}
      </div>
    `,
    className: "cluster-icon",
    iconSize: [36, 36],
  });
}
