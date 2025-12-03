
export function getMarkerColorFromIndexValue(indexValue) {
  switch (indexValue) {
    case 0: return "#2ecc71"; // Bardzo dobry
    case 1: return "#27ae60"; // Dobry
    case 2: return "#f1c40f"; // Umiarkowany
    case 3: return "#e67e22"; // Dostateczny
    case 4: return "#e74c3c"; // Zły
    case 5: return "#8e44ad"; // Bardzo zły
    default: return "#1e88e5"; // brak indeksu
  }
}
